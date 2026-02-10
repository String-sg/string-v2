import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { generateSlugFromEmail, generateUniqueSlug, isReservedSlug } from '../src/lib/slug-utils';

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
      const { id, email, name, image, provider = 'google' } = body;

      if (!id || !email) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: id, email' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      let user;

      if (existingUser.length === 0) {
        // Generate unique slug from email
        const baseSlug = generateSlugFromEmail(email);
        const uniqueSlug = await generateUniqueSlug(db, baseSlug);

        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            id,
            email,
            name: name || null,
            avatarUrl: image || null,
            provider,
            slug: uniqueSlug,
            lastLogin: new Date(),
          })
          .returning();

        user = newUser;
        console.log('Created new user:', user.email, 'with slug:', user.slug);
      } else {
        // Update existing user's last login
        const [updatedUser] = await db
          .update(users)
          .set({
            lastLogin: new Date(),
            name: name || existingUser[0].name,
            avatarUrl: image || existingUser[0].avatarUrl,
          })
          .where(eq(users.id, id))
          .returning();

        user = updatedUser;
        console.log('Updated user login:', user.email);
      }


      return new Response(
        JSON.stringify({ user, success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET method - retrieve user by ID
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const userId = url.searchParams.get('id');

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Missing user ID' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);


      if (user.length === 0) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ user: user[0] }),
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