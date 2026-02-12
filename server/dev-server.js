import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { appSubmissions } from '../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sqlClient = neon(connectionString);
const db = drizzle(sqlClient);

// POST /api/submissions
app.post('/api/submissions', async (req, res) => {
  try {
    const { name, url, description, logoUrl, category, submittedByUserId, submittedByEmail } = req.body;

    // Validate required fields
    if (!name || !url || !submittedByUserId || !submittedByEmail) {
      return res.status(400).json({
        error: 'Name, URL, submittedByUserId, and submittedByEmail are required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log('Inserting submission:', { name, url, description, logoUrl, category, submittedByUserId, submittedByEmail });

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

    res.json({ success: true, message: 'App submitted for review' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    // Users can only see their own submissions
    const submissions = await db
      .select()
      .from(appSubmissions)
      .where(eq(appSubmissions.submittedByUserId, userId))
      .orderBy(desc(appSubmissions.submittedAt));

    res.json({ submissions });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Dev API server running at http://localhost:${port}`);
});