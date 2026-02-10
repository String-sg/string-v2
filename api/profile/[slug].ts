import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, userProfileApps, apps, appSubmissions } from '../../src/db/schema';
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const slug = url.pathname.split('/').pop();

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sqlClient = neon(connectionString!);
    const db = drizzle(sqlClient);

    // Find user by slug
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        slug: users.slug,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.slug, slug))
      .limit(1);

    if (!user.length) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const profile = user[0];

    // Get user's visible profile apps
    const profileApps = await db
      .select({
        id: userProfileApps.id,
        appType: userProfileApps.appType,
        isVisible: userProfileApps.isVisible,
        displayOrder: userProfileApps.displayOrder,
        // App details (for pinned apps)
        appId: apps.id,
        appName: apps.name,
        appSlug: apps.slug,
        appUrl: apps.url,
        appLogoUrl: apps.logoUrl,
        appDescription: apps.description,
        appTagline: apps.tagline,
        appCategory: apps.category,
        // Submission details (for submitted apps)
        submissionId: appSubmissions.id,
        submissionName: appSubmissions.name,
        submissionUrl: appSubmissions.url,
        submissionLogoUrl: appSubmissions.logoUrl,
        submissionDescription: appSubmissions.description,
        submissionCategory: appSubmissions.category,
      })
      .from(userProfileApps)
      .leftJoin(apps, eq(userProfileApps.appId, apps.id))
      .leftJoin(appSubmissions, and(
        eq(userProfileApps.submissionId, appSubmissions.id),
        eq(appSubmissions.status, 'approved')  // Only show approved submissions
      ))
      .where(and(
        eq(userProfileApps.userId, profile.id),
        eq(userProfileApps.isVisible, true)
      ))
      .orderBy(userProfileApps.displayOrder);

    // Transform the data into a cleaner format
    const apps_data = profileApps.map((item) => {
      if (item.appType === 'pinned' && item.appId) {
        return {
          id: item.appId,
          name: item.appName,
          slug: item.appSlug,
          url: item.appUrl,
          logoUrl: item.appLogoUrl,
          description: item.appDescription,
          tagline: item.appTagline,
          category: item.appCategory,
          type: 'pinned' as const,
        };
      } else if (item.appType === 'submitted' && item.submissionId) {
        return {
          id: item.submissionId,
          name: item.submissionName,
          slug: null,
          url: item.submissionUrl,
          logoUrl: item.submissionLogoUrl,
          description: item.submissionDescription,
          tagline: null,
          category: item.submissionCategory,
          type: 'submitted' as const,
        };
      }
      return null;
    }).filter(Boolean);

    return new Response(JSON.stringify({
      profile: {
        name: profile.name,
        slug: profile.slug,
        avatarUrl: profile.avatarUrl,
        memberSince: profile.createdAt,
      },
      apps: apps_data,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}