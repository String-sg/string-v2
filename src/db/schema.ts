import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  time,
  date,
} from 'drizzle-orm/pg-core';

// Apps table - core app directory
export const apps = pgTable('apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  url: text('url').notNull(),
  logoUrl: text('logo_url'),
  description: text('description'),
  tagline: text('tagline'),
  category: text('category').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  isOfficial: boolean('is_official').default(true),
  frequency: integer('frequency').default(0),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bump rules - time-based or date-based app promotion
export const bumpRules = pgTable('bump_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  ruleType: text('rule_type').notNull(), // 'time_window' | 'date_range' | 'manual'
  startTime: time('start_time'), // For daily time windows (e.g., 06:00)
  endTime: time('end_time'), // For daily time windows (e.g., 07:30)
  startDate: date('start_date'), // For date ranges
  endDate: date('end_date'), // For date ranges
  description: text('description'),
  priority: integer('priority').default(5),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Featured apps - daily featured app with custom messaging
export const featuredApps = pgTable('featured_apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(),
  headline: text('headline'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  slug: text('slug').unique(), // e.g., 'lee-kh' from email prefix
  avatarUrl: text('avatar_url'),
  provider: text('provider'), // 'google' | 'magic_link'
  role: text('role').default('user').notNull(), // 'user' | 'admin' | 'moderator'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
});

// User preferences - app arrangement and settings
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  appArrangement: jsonb('app_arrangement').$type<string[]>().default([]), // Ordered app IDs
  hiddenApps: jsonb('hidden_apps').$type<string[]>().default([]),
  pinnedApps: jsonb('pinned_apps').$type<string[]>().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User app launches - for analytics
export const userAppLaunches = pgTable('user_app_launches', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  launchedAt: timestamp('launched_at').defaultNow().notNull(),
});

// App submissions - UGC with moderation
export const appSubmissions = pgTable('app_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  category: text('category'),
  submittedByUserId: uuid('submitted_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  submittedByEmail: text('submitted_by_email'),
  status: text('status').default('pending').notNull(), // 'pending' | 'approved' | 'rejected'
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
});

// User profile apps - controls which apps are visible on public profiles
export const userProfileApps = pgTable('user_profile_apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }),
  submissionId: uuid('submission_id').references(() => appSubmissions.id, { onDelete: 'cascade' }),
  appType: text('app_type').notNull(), // 'pinned' or 'submitted'
  isVisible: boolean('is_visible').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
});

// Type exports for use in application code
export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;
export type BumpRule = typeof bumpRules.$inferSelect;
export type NewBumpRule = typeof bumpRules.$inferInsert;
export type FeaturedApp = typeof featuredApps.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type AppSubmission = typeof appSubmissions.$inferSelect;
export type NewAppSubmission = typeof appSubmissions.$inferInsert;
export type Category = typeof categories.$inferSelect;
