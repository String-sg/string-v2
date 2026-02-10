import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { apps, featuredApps, bumpRules } from '../src/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export const config = {
  runtime: 'edge',
};

export default async function handler(_request: Request) {
  try {
    const sqlClient = neon(process.env.DATABASE_URL!);
    const db = drizzle(sqlClient);

    // Get all apps sorted by frequency
    const allApps = await db
      .select()
      .from(apps)
      .orderBy(desc(apps.frequency));

    // Get today's featured app (if any)
    const today = new Date().toISOString().split('T')[0];
    const todaysFeatured = await db
      .select()
      .from(featuredApps)
      .where(eq(featuredApps.date, today))
      .limit(1);

    let featured = null;
    if (todaysFeatured.length > 0) {
      const featuredApp = allApps.find((a) => a.id === todaysFeatured[0].appId);
      if (featuredApp) {
        featured = {
          app: featuredApp,
          headline: todaysFeatured[0].headline,
          description: todaysFeatured[0].description,
        };
      }
    }

    // Check for time-based bump rules
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const activeBumpRules = await db
      .select()
      .from(bumpRules)
      .where(
        and(
          eq(bumpRules.ruleType, 'time_window'),
          eq(bumpRules.isActive, true),
          lte(bumpRules.startTime, currentTime),
          gte(bumpRules.endTime, currentTime)
        )
      );

    // If no featured app but there's an active bump rule, use that
    if (!featured && activeBumpRules.length > 0) {
      const topRule = activeBumpRules.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
      const bumpedApp = allApps.find((a) => a.id === topRule.appId);
      if (bumpedApp) {
        featured = {
          app: bumpedApp,
          headline: `${bumpedApp.name}`,
          description: topRule.description || bumpedApp.description,
        };
      }
    }

    return new Response(
      JSON.stringify({
        apps: allApps,
        featured,
        count: allApps.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=60, stale-while-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch apps' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
