import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { apps, userProfileApps } from '../../src/db/schema';
import { eq, and } from 'drizzle-orm';

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const sqlClient = neon(connectionString!);
    const db = drizzle(sqlClient);

    const body = await request.json();
    const { appId, userId } = body;

    if (!appId || !userId) {
      return new Response(JSON.stringify({ error: 'App ID and User ID are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if app exists in main library
    const appExists = await db
      .select()
      .from(apps)
      .where(eq(apps.id, appId))
      .limit(1);

    if (appExists.length === 0) {
      return new Response(JSON.stringify({ error: 'App not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if already in user's profile
    const existing = await db
      .select()
      .from(userProfileApps)
      .where(and(
        eq(userProfileApps.userId, userId),
        eq(userProfileApps.appId, appId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ message: 'App already in profile', existing: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add to user's profile
    await db.insert(userProfileApps).values({
      userId,
      appId,
      appType: 'pinned',
      isVisible: true,
      displayOrder: 0
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'App added to profile'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error adding app to profile:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
