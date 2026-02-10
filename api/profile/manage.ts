import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, userProfileApps, apps, appSubmissions, userPreferences } from '../../src/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export const config = {
  runtime: 'edge',
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default async function handler(request: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const sqlClient = neon(connectionString!);
    const db = drizzle(sqlClient);

    if (request.method === 'GET') {
      // Get user's current profile configuration
      const body = await request.json();
      const { userId } = body;

      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get user info
      const user = await db
        .select({
          id: users.id,
          name: users.name,
          slug: users.slug,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get user's pinned apps
      const preferences = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      const pinnedAppIds = preferences.length > 0 ? preferences[0].pinnedApps || [] : [];

      // Get pinned apps details
      const pinnedApps = pinnedAppIds.length > 0 ? await db
        .select()
        .from(apps)
        .where(inArray(apps.id, pinnedAppIds)) : [];

      // Get user's approved submissions
      const submissions = await db
        .select()
        .from(appSubmissions)
        .where(and(
          eq(appSubmissions.submittedByUserId, userId),
          eq(appSubmissions.status, 'approved')
        ));

      // Get current profile app settings
      const profileApps = await db
        .select()
        .from(userProfileApps)
        .where(eq(userProfileApps.userId, userId));

      return new Response(JSON.stringify({
        user: user[0],
        pinnedApps,
        submissions,
        profileApps,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      // Update profile app visibility
      const body = await request.json();
      const { userId, appId, submissionId, appType, isVisible, displayOrder } = body;

      if (!userId || !appType || (!appId && !submissionId)) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if profile app entry already exists
      const existingEntry = await db
        .select()
        .from(userProfileApps)
        .where(and(
          eq(userProfileApps.userId, userId),
          appId ? eq(userProfileApps.appId, appId) : eq(userProfileApps.submissionId, submissionId),
          eq(userProfileApps.appType, appType)
        ))
        .limit(1);

      if (existingEntry.length > 0) {
        // Update existing entry
        await db
          .update(userProfileApps)
          .set({
            isVisible: isVisible ?? true,
            displayOrder: displayOrder ?? 0,
          })
          .where(eq(userProfileApps.id, existingEntry[0].id));
      } else {
        // Create new entry
        await db
          .insert(userProfileApps)
          .values({
            userId,
            appId: appId || null,
            submissionId: submissionId || null,
            appType,
            isVisible: isVisible ?? true,
            displayOrder: displayOrder ?? 0,
          });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Profile management API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}