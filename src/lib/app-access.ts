export type AppAvailability = 'available' | 'intranet-only';

const INTRANET_PATTERNS = [
  /(^|\.)intranet\./i,
  /\.internal$/i,
  /\.corp$/i,
  /\.local$/i,
];

export function getHostname(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isIntranetUrl(rawUrl: string): boolean {
  const hostname = getHostname(rawUrl);
  if (!hostname) {
    return false;
  }

  return INTRANET_PATTERNS.some((pattern) => pattern.test(hostname));
}

export function getAppAvailability(rawUrl: string): AppAvailability {
  return isIntranetUrl(rawUrl) ? 'intranet-only' : 'available';
}
