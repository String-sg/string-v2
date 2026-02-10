/**
 * Utility functions for generating and managing user profile slugs
 */

/**
 * Generate a slug from an email address
 * Takes the part before @ and converts it to a URL-safe slug
 */
export function generateSlugFromEmail(email: string): string {
  // Extract username part (before @)
  const username = email.split('@')[0];

  // Convert to lowercase and replace non-alphanumeric chars with hyphens
  let slug = username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens

  // Ensure minimum length
  if (slug.length < 3) {
    slug = slug + '-' + Math.random().toString(36).substring(2, 5);
  }

  // Limit max length
  if (slug.length > 50) {
    slug = slug.substring(0, 50).replace(/-+$/, '');
  }

  return slug;
}

/**
 * Generate a unique slug by adding a number suffix if needed
 * This should be called with database check for uniqueness
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  // Keep trying with incremented numbers until we find a unique one
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Validate if a slug meets our requirements
 */
export function isValidSlug(slug: string): boolean {
  // Must be 3-50 chars, lowercase alphanumeric and hyphens only
  // Cannot start or end with hyphen
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return (
    slug.length >= 3 &&
    slug.length <= 50 &&
    slugRegex.test(slug) &&
    !slug.startsWith('-') &&
    !slug.endsWith('-')
  );
}

/**
 * Reserved slugs that users cannot use
 */
export const RESERVED_SLUGS = [
  'api',
  'admin',
  'dashboard',
  'profile',
  'user',
  'users',
  'app',
  'apps',
  'auth',
  'login',
  'logout',
  'signup',
  'signin',
  'register',
  'home',
  'about',
  'contact',
  'help',
  'support',
  'privacy',
  'terms',
  'static',
  'public',
  'assets',
  'www',
  'mail',
  'email',
  'ftp',
  'root',
  'string',
  'sg',
  'singapore'
];

/**
 * Check if a slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}