export const OPAL_CANONICAL_LOGO = '/icons/opal2.png';

export function normalizeOpalLogo<T extends { slug: string | null; logoUrl: string | null }>(app: T): T {
  if (app.slug === 'opal') {
    return {
      ...app,
      logoUrl: OPAL_CANONICAL_LOGO,
    };
  }
  return app;
}
