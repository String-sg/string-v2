import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { userPreferences } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Edge runtime configuration
export const config = {
  runtime: 'edge',
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default async function handler(request: Request) {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const client = postgres(connectionString);
    const db = drizzle(client);

    // Simple auth check - get user ID from request headers or body
    // For now, we'll get userId from the request body/query params
    // TODO: Implement proper JWT/session validation

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Missing userId parameter' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const prefs = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      await client.end();

      return new Response(
        JSON.stringify({
          pinnedApps: prefs[0]?.pinnedApps || [],
          hiddenApps: prefs[0]?.hiddenApps || [],
          appArrangement: prefs[0]?.appArrangement || []
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (request.method === 'PUT') {
      const body = await request.json();
      const { userId, pinnedApps, hiddenApps, appArrangement } = body;

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Missing userId' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if user preferences exist
      const existingPrefs = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      if (existingPrefs.length === 0) {
        // Create new preferences
        await db
          .insert(userPreferences)
          .values({
            userId,
            pinnedApps: pinnedApps || [],
            hiddenApps: hiddenApps || [],
            appArrangement: appArrangement || [],
            updatedAt: new Date()
          });
      } else {
        // Update existing preferences
        await db
          .update(userPreferences)
          .set({
            pinnedApps: pinnedApps || existingPrefs[0].pinnedApps,
            hiddenApps: hiddenApps || existingPrefs[0].hiddenApps,
            appArrangement: appArrangement || existingPrefs[0].appArrangement,
            updatedAt: new Date()
          })
          .where(eq(userPreferences.userId, userId));
      }

      await client.end();

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}