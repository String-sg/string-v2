import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { appSubmissions, users } from '../src/db/schema';
import { eq, desc } from 'drizzle-orm';

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
    const sqlClient = neon(connectionString!);
    const db = drizzle(sqlClient);

    if (request.method === 'POST') {
      const body = await request.json();
      const { name, url, description, logoUrl, category, submittedByUserId, submittedByEmail } = body;

      // Validate required fields
      if (!name || !url || !submittedByUserId || !submittedByEmail) {
        return new Response(
          JSON.stringify({ error: 'Name, URL, submittedByUserId, and submittedByEmail are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid URL format' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Inserting submission:', { name, url, description, logoUrl, category, submittedByUserId, submittedByEmail });

      // Ensure user exists in database before creating submission
      try {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, submittedByUserId))
          .limit(1);

        if (existingUser.length === 0) {
          // Create user if doesn't exist
          await db.insert(users).values({
            id: submittedByUserId,
            email: submittedByEmail,
            name: null, // Will be updated from OAuth data
            slug: null, // Will be generated later
          });
          console.log('Created new user:', submittedByUserId);
        }
      } catch (userError) {
        console.error('Error checking/creating user:', userError);
        // Continue anyway - if user creation fails, the FK constraint will handle it
      }

      await db.insert(appSubmissions).values({
        name,
        url,
        description,
        logoUrl,
        category,
        submittedByUserId,
        submittedByEmail,
        status: 'pending'
      });


      return new Response(
        JSON.stringify({ success: true, message: 'App submitted for review' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

      // Users can only see their own submissions
      const submissions = await db
        .select()
        .from(appSubmissions)
        .where(eq(appSubmissions.submittedByUserId, userId))
        .orderBy(desc(appSubmissions.submittedAt));


      return new Response(
        JSON.stringify({ submissions }),
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
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}