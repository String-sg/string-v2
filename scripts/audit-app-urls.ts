import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { apps as appsTable } from '../src/db/schema';
import { isIntranetUrl } from '../src/lib/app-access';

const shouldPurge404 = process.argv.includes('--purge-404');
const reportPath = path.resolve(process.cwd(), 'data/url-audit-report.json');

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'string-url-audit/1.0',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUrl(url: string): Promise<{ status: number | null; finalUrl: string | null }> {
  try {
    const headRes = await fetchWithTimeout(url, { method: 'HEAD' });
    if (headRes.status !== 405 && headRes.status !== 501) {
      return { status: headRes.status, finalUrl: headRes.url || null };
    }
  } catch {
    // Fall through to GET
  }

  try {
    const getRes = await fetchWithTimeout(url, { method: 'GET' });
    return { status: getRes.status, finalUrl: getRes.url || null };
  } catch {
    return { status: null, finalUrl: null };
  }
}

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for URL audit.');
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const appRows = await db
    .select({
      id: appsTable.id,
      name: appsTable.name,
      slug: appsTable.slug,
      url: appsTable.url,
    })
    .from(appsTable);

  const deadLinks: Array<{ id: string; name: string; slug: string; url: string }> = [];
  const intranetApps: Array<{ id: string; name: string; slug: string; url: string }> = [];
  const checked: Array<{
    id: string;
    slug: string;
    name: string;
    url: string;
    status: number | null;
    finalUrl: string | null;
    intranetOnly: boolean;
  }> = [];

  for (const app of appRows) {
    const result = await checkUrl(app.url);
    const intranetOnly = isIntranetUrl(app.url);

    checked.push({
      ...app,
      status: result.status,
      finalUrl: result.finalUrl,
      intranetOnly,
    });

    if (intranetOnly) {
      intranetApps.push(app);
    }

    if (result.status === 404) {
      deadLinks.push(app);
      if (shouldPurge404) {
        await db.delete(appsTable).where(eq(appsTable.id, app.id));
      }
    }

    const statusLabel = result.status === null ? 'ERR' : String(result.status);
    const intranetLabel = intranetOnly ? ' [INTRANET]' : '';
    console.log(`${statusLabel} ${app.slug}${intranetLabel}`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: shouldPurge404 ? 'purged-404' : 'audit-only',
    summary: {
      total: checked.length,
      deadLinks: deadLinks.length,
      intranetOnly: intranetApps.length,
    },
    deadLinks,
    intranetApps,
    checked,
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

  console.log('\nURL audit complete');
  console.log(`Total checked: ${checked.length}`);
  console.log(`404 links: ${deadLinks.length}${shouldPurge404 ? ' (purged)' : ''}`);
  console.log(`Intranet links: ${intranetApps.length}`);
  console.log(`Report: ${reportPath}`);
}

run().catch((error) => {
  console.error('URL audit failed:', error);
  process.exit(1);
});
