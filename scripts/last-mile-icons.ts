import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { apps as appsTable } from '../src/db/schema';

type IconDef = {
  slug: string;
  label: string;
  text: string;
  bg: string;
  fg: string;
};

const iconDefs: IconDef[] = [
  { slug: 'sc-mobile', label: 'SC Mobile', text: 'SC', bg: '#0F172A', fg: '#22D3EE' },
  { slug: 'school-cockpit', label: 'School Cockpit', text: 'SC', bg: '#1F2937', fg: '#34D399' },
  { slug: 'iexams', label: 'iEXAMS', text: 'EX', bg: '#1E1B4B', fg: '#C4B5FD' },
  { slug: 'moe-intranet', label: 'MOE Intranet', text: 'MI', bg: '#450A0A', fg: '#FCA5A5' },
  { slug: 'hr-online', label: 'HR Online', text: 'HR', bg: '#3F1D2E', fg: '#F9A8D4' },
  { slug: 'mims', label: 'MIMS', text: 'MM', bg: '#0C4A6E', fg: '#7DD3FC' },
  { slug: 'ssoe2', label: 'SSOE2', text: 'IT', bg: '#0F3D2E', fg: '#6EE7B7' },
  { slug: 'ps21', label: 'PS21', text: 'P21', bg: '#3B0764', fg: '#D8B4FE' },
  { slug: 'stu', label: 'STU', text: 'STU', bg: '#422006', fg: '#FCD34D' },
  { slug: 'imtl', label: 'iMTL', text: 'MT', bg: '#172554', fg: '#93C5FD' },
  { slug: 'ict-connection', label: 'ICT Connection', text: 'ICT', bg: '#083344', fg: '#67E8F9' },
  { slug: 'pacgov', label: 'PaC@Gov', text: 'PAC', bg: '#14532D', fg: '#86EFAC' },
  { slug: 'traisi', label: 'TRAISI', text: 'TR', bg: '#1E293B', fg: '#94A3B8' },
  { slug: 'bingo', label: 'String Bingo', text: 'B', bg: '#052E2B', fg: '#5EEAD4' },
];

const iconDir = path.resolve(process.cwd(), 'public/src/app-icons');
const manifestPath = path.join(iconDir, 'manifest.json');
const targetSeedFiles = [
  path.resolve(process.cwd(), 'data/apps-seed.json'),
  path.resolve(process.cwd(), 'public/apps-seed.json'),
];

function buildSvg(def: IconDef): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="' + def.label + '">',
    '<rect width="256" height="256" rx="56" fill="' + def.bg + '"/>',
    '<text x="128" y="142" text-anchor="middle" font-size="' + (def.text.length > 2 ? '72' : '92') + '" font-family="Arial, sans-serif" font-weight="700" fill="' + def.fg + '">' + def.text + '</text>',
    '</svg>',
    '',
  ].join('\n');
}

async function upsertSeedLogoUrls(filePath: string, logoPathMap: Record<string, string>) {
  const raw = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(raw) as { apps?: Array<Record<string, unknown>> };
  const apps = data.apps || [];

  for (const app of apps) {
    const slug = String(app.slug || '');
    const logoPath = logoPathMap[slug];
    if (logoPath) {
      app.logo_url = logoPath;
    }
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function main() {
  await fs.mkdir(iconDir, { recursive: true });

  const logoPathMap: Record<string, string> = {};

  for (const def of iconDefs) {
    const fileName = `${def.slug}.svg`;
    const diskPath = path.join(iconDir, fileName);
    const logoPath = `/src/app-icons/${fileName}`;

    await fs.writeFile(diskPath, buildSvg(def), 'utf8');
    logoPathMap[def.slug] = logoPath;
    console.log(`✓ icon ${def.slug} -> ${logoPath}`);
  }

  let existingManifest: Record<string, string> = {};
  try {
    existingManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as Record<string, string>;
  } catch {
    existingManifest = {};
  }

  const mergedManifest = {
    ...existingManifest,
    ...logoPathMap,
  };
  await fs.writeFile(manifestPath, JSON.stringify(mergedManifest, null, 2) + '\n', 'utf8');
  console.log(`✓ updated manifest (${Object.keys(mergedManifest).length} entries)`);

  for (const seedFile of targetSeedFiles) {
    await upsertSeedLogoUrls(seedFile, logoPathMap);
    console.log(`✓ updated seed file ${path.basename(seedFile)}`);
  }

  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not set, skipped DB updates.');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  let dbUpdated = 0;

  for (const [slug, logoPath] of Object.entries(logoPathMap)) {
    const updated = await db
      .update(appsTable)
      .set({
        logoUrl: logoPath,
        updatedAt: new Date(),
      })
      .where(eq(appsTable.slug, slug))
      .returning({ id: appsTable.id });

    if (updated.length > 0) {
      dbUpdated += updated.length;
      console.log(`✓ db ${slug}`);
    } else {
      console.log(`- db ${slug} not found`);
    }
  }

  console.log(`\nLast-mile pass complete. DB rows updated: ${dbUpdated}`);
}

main().catch((error) => {
  console.error('Last-mile pass failed:', error);
  process.exit(1);
});
