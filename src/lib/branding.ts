export const OPAL_CANONICAL_LOGO = '/icons/opal2.png';

export function normalizeOpalLogo<T extends { slug: string | null; logoUrl: string | null }>(app: T): Omit<T, 'logoUrl'> & { logoUrl: string | null } {
  if (app.slug === 'opal') {
    return {
      ...app,
      logoUrl: OPAL_CANONICAL_LOGO,
    };
  }
  return app;
}
