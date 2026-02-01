import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// For serverless environments (Vercel Edge, etc.)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';
