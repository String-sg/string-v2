/**
 * Seed the database with apps from research data
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { apps, bumpRules, categories } from '../src/db/schema';
import seedData from '../data/apps-seed.json';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set. Create a .env file with your NeonDB connection string.');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Seeding database...\n');

  // Seed categories first
  console.log('Seeding categories...');
  for (const cat of seedData.categories) {
    await db.insert(categories).values({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      sortOrder: seedData.categories.indexOf(cat),
    }).onConflictDoNothing();
  }
  console.log(`  ✓ ${seedData.categories.length} categories\n`);

  // Seed apps
  console.log('Seeding apps...');
  const appIdMap: Record<string, string> = {};

  for (const app of seedData.apps) {
    const [inserted] = await db.insert(apps).values({
      name: app.name,
      slug: app.slug,
      url: app.url,
      description: app.description,
      tagline: app.tagline,
      category: app.category.toLowerCase().replace(/ /g, '-'),
      tags: app.tags,
      isOfficial: app.is_official,
      frequency: app.frequency,
      featured: app.featured || false,
    }).onConflictDoNothing().returning({ id: apps.id });

    if (inserted) {
      appIdMap[app.slug] = inserted.id;
      console.log(`  ✓ ${app.name}`);
    } else {
      console.log(`  - ${app.name} (already exists)`);
    }
  }
  console.log(`\n  Total: ${Object.keys(appIdMap).length} apps seeded\n`);

  // Seed bump rules for apps that have them
  console.log('Seeding bump rules...');
  let ruleCount = 0;

  for (const app of seedData.apps) {
    if (app.bump_rules && appIdMap[app.slug]) {
      for (const rule of app.bump_rules) {
        await db.insert(bumpRules).values({
          appId: appIdMap[app.slug],
          ruleType: rule.type,
          startTime: rule.start || null,
          endTime: rule.end || null,
          description: rule.description || null,
          priority: rule.priority || 5,
          isActive: true,
        });
        ruleCount++;
        console.log(`  ✓ ${app.name}: ${rule.type}`);
      }
    }
  }
  console.log(`\n  Total: ${ruleCount} bump rules seeded\n`);

  console.log('✅ Database seeding complete!');
}

main().catch(console.error);
