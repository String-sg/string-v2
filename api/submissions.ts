import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { db } from '../src/db';
import { appSubmissions, users } from '../src/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: NextRequest) {
  if (req.method === 'POST') {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const body = await req.json();
      const { name, url, description, logoUrl, category } = body;

      // Validate required fields
      if (!name || !url) {
        return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }

      await db.insert(appSubmissions).values({
        name,
        url,
        description,
        logoUrl,
        category,
        submittedByUserId: session.user.id,
        submittedByEmail: session.user.email,
        status: 'pending'
      });

      return NextResponse.json({ success: true, message: 'App submitted for review' });
    } catch (error) {
      console.error('Submission error:', error);
      return NextResponse.json({ error: 'Failed to submit app' }, { status: 500 });
    }
  }

  if (req.method === 'GET') {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Users can only see their own submissions
      const submissions = await db
        .select()
        .from(appSubmissions)
        .where(eq(appSubmissions.submittedByUserId, session.user.id))
        .orderBy(desc(appSubmissions.submittedAt));

      return NextResponse.json({ submissions });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}