import test from 'node:test';
import assert from 'node:assert/strict';
import { getAppAvailability, isIntranetUrl, getHostname } from './app-access';

test('detects intranet hostnames and flags availability', () => {
  assert.equal(isIntranetUrl('https://intranet.moe.edu.sg/home'), true);
  assert.equal(isIntranetUrl('https://services.internal'), true);
  assert.equal(isIntranetUrl('https://public.moe.edu.sg'), false);

  assert.equal(getAppAvailability('https://hr.corp'), 'intranet-only');
  assert.equal(getAppAvailability('https://string.sg'), 'available');
});

test('getHostname returns null for invalid URLs', () => {
  assert.equal(getHostname('not-a-url'), null);
});
