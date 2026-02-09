import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { db } from '../src/db';
import { userPreferences } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const prefs = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      return NextResponse.json({
        pinnedApps: prefs[0]?.pinnedApps || [],
        hiddenApps: prefs[0]?.hiddenApps || [],
        appArrangement: prefs[0]?.appArrangement || []
      });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = await req.json();
      const { pinnedApps, hiddenApps, appArrangement } = body;

      await db
        .insert(userPreferences)
        .values({
          userId,
          pinnedApps: pinnedApps || [],
          hiddenApps: hiddenApps || [],
          appArrangement: appArrangement || [],
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: userPreferences.userId,
          set: {
            pinnedApps: pinnedApps || [],
            hiddenApps: hiddenApps || [],
            appArrangement: appArrangement || [],
            updatedAt: new Date()
          }
        });

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}