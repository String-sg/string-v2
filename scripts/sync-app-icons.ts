import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { apps as appsTable } from '../src/db/schema';

type AppRecord = {
  id?: string;
  name: string;
  slug: string;
  url: string;
  logoUrl: string | null;
};

const ICON_DIR = path.resolve(process.cwd(), 'public/src/app-icons');
const MANIFEST_PATH = path.join(ICON_DIR, 'manifest.json');
const shouldOverwrite = process.argv.includes('--overwrite');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : null;
const delayArg = process.argv.find((arg) => arg.startsWith('--delay='));
const parsedDelay = delayArg ? Number(delayArg.split('=')[1]) : NaN;
const delayMs = Number.isFinite(parsedDelay) && parsedDelay >= 0 ? parsedDelay : 500;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'string-icon-sync/1.0',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function inferExt(contentType: string | null, sourceUrl: string): string {
  if (contentType) {
    if (contentType.includes('image/svg+xml')) return 'svg';
    if (contentType.includes('image/png')) return 'png';
    if (contentType.includes('image/x-icon') || contentType.includes('image/vnd.microsoft.icon')) return 'ico';
    if (contentType.includes('image/jpeg')) return 'jpg';
    if (contentType.includes('image/webp')) return 'webp';
  }

  const pathname = new URL(sourceUrl).pathname.toLowerCase();
  if (pathname.endsWith('.svg')) return 'svg';
  if (pathname.endsWith('.png')) return 'png';
  if (pathname.endsWith('.ico')) return 'ico';
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'jpg';
  if (pathname.endsWith('.webp')) return 'webp';

  return 'png';
}

async function listIconCandidates(appUrl: string): Promise<string[]> {
  const parsed = new URL(appUrl);
  const candidates = new Set<string>([
    `${parsed.origin}/favicon.ico`,
    `${parsed.origin}/favicon.png`,
    `${parsed.origin}/favicon.svg`,
    `${parsed.origin}/favicon-32x32.png`,
    `${parsed.origin}/favicon-16x16.png`,
    `${parsed.origin}/apple-touch-icon.png`,
    `${parsed.origin}/site.webmanifest`,
    `${parsed.origin}/manifest.json`,
  ]);

  try {
    const res = await fetchWithTimeout(appUrl);
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      $('link[rel]').each((_, element) => {
        const rel = ($(element).attr('rel') || '').toLowerCase();
        const href = $(element).attr('href');
        if (!href) return;
        if (!rel.includes('icon') && rel !== 'manifest') return;

        try {
          const resolved = new URL(href, res.url || appUrl).toString();
          candidates.add(resolved);

          if (rel === 'manifest') {
            candidates.add(resolved);
          }
        } catch {
          // Ignore invalid URLs from source HTML
        }
      });
    }
  } catch {
    // Ignore parse/fetch errors and fallback to defaults
  }

  // Expand any discovered manifest URLs into icon URLs.
  const manifestUrls = Array.from(candidates).filter((url) => /manifest(\.json)?$/i.test(url) || url.endsWith('.webmanifest'));
  for (const manifestUrl of manifestUrls) {
    try {
      const res = await fetchWithTimeout(manifestUrl);
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('json') && !contentType.includes('manifest')) continue;

      const manifest = await res.json() as { icons?: Array<{ src?: string }> };
      for (const icon of manifest.icons || []) {
        if (!icon.src) continue;
        try {
          candidates.add(new URL(icon.src, res.url || manifestUrl).toString());
        } catch {
          // Ignore invalid manifest icon URLs
        }
      }
    } catch {
      // Ignore bad manifest URLs
    }
  }

  // Fallback icon providers.
  candidates.add(`https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=128`);
  candidates.add(`https://www.google.com/s2/favicons?domain_url=${parsed.origin}&sz=128`);

  return Array.from(candidates);
}

async function downloadIcon(urls: string[]) {
  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) continue;

      const contentType = res.headers.get('content-type');
      if (contentType && !contentType.startsWith('image/')) {
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 64) {
        continue;
      }

      return {
        bytes: buffer,
        ext: inferExt(contentType, res.url || url),
      };
    } catch {
      // Try next candidate
    }
  }

  return null;
}

async function removePriorIcons(slug: string) {
  try {
    const files = await fs.readdir(ICON_DIR);
    await Promise.all(
      files
        .filter((file) => file.startsWith(`${slug}.`))
        .map((file) => fs.unlink(path.join(ICON_DIR, file)))
    );
  } catch {
    // Directory may not exist yet
  }
}

async function getAppsFromSeed(): Promise<AppRecord[]> {
  const seedPath = path.resolve(process.cwd(), 'data/apps-seed.json');
  const raw = await fs.readFile(seedPath, 'utf8');
  const parsed = JSON.parse(raw) as { apps?: Array<Record<string, unknown>> };

  return (parsed.apps || []).map((app) => ({
    name: String(app.name || ''),
    slug: String(app.slug || ''),
    url: String(app.url || ''),
    logoUrl: typeof app.logo_url === 'string' ? app.logo_url : null,
  }));
}

async function run() {
  await fs.mkdir(ICON_DIR, { recursive: true });

  let db: ReturnType<typeof drizzle> | null = null;
  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
  }

  const sourceApps: AppRecord[] = db
    ? await db.select({
        id: appsTable.id,
        name: appsTable.name,
        slug: appsTable.slug,
        url: appsTable.url,
        logoUrl: appsTable.logoUrl,
      }).from(appsTable)
    : await getAppsFromSeed();

  const apps = typeof limit === 'number' && Number.isFinite(limit)
    ? sourceApps.slice(0, limit)
    : sourceApps;

  const manifest: Record<string, string> = {};
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const app of apps) {
    if (!app.slug || !app.url) {
      failed++;
      continue;
    }

    const existingFilePath = app.logoUrl
      ? path.resolve(process.cwd(), 'public', app.logoUrl.replace(/^\//, ''))
      : null;

    if (!shouldOverwrite && existingFilePath) {
      try {
        await fs.access(existingFilePath);
        manifest[app.slug] = app.logoUrl!;
        skipped++;
        continue;
      } catch {
        // Continue to fetch a fresh icon
      }
    }

    const candidates = await listIconCandidates(app.url);
    const icon = await downloadIcon(candidates);

    if (!icon) {
      failed++;
      continue;
    }

    await removePriorIcons(app.slug);

    const fileName = `${app.slug}.${icon.ext}`;
    const diskPath = path.join(ICON_DIR, fileName);
    const publicPath = `/src/app-icons/${fileName}`;
    await fs.writeFile(diskPath, icon.bytes);

    manifest[app.slug] = publicPath;

    if (db && app.id) {
      await db
        .update(appsTable)
        .set({
          logoUrl: publicPath,
          updatedAt: new Date(),
        })
        .where(eq(appsTable.id, app.id));
    }

    updated++;
    console.log(`✓ ${app.name} -> ${publicPath}`);

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log('\nIcon sync complete');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

run().catch((error) => {
  console.error('Icon sync failed:', error);
  process.exit(1);
});
