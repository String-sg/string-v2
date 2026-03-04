import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppCard } from './AppCard';

const app = {
  id: 'app-1',
  name: 'String Bingo',
  category: 'Teaching',
  url: 'https://bingo.string.sg',
};

test('renders cross remove affordance with neutral default and red hover styles', () => {
  const html = renderToStaticMarkup(
    <AppCard app={app} onClick={() => undefined} onRemove={() => undefined} />
  );

  assert.match(html, /title="Remove from profile"/);
  assert.match(html, /text-gray-400 hover:bg-red-500 hover:text-white/);
  assert.match(html, /d="M6 18L18 6M6 6l12 12"/);
});

test('renders loading state for remove affordance while removing', () => {
  const html = renderToStaticMarkup(
    <AppCard app={app} onClick={() => undefined} onRemove={() => undefined} removing />
  );

  assert.match(html, /title="Removing app"/);
  assert.match(html, /bg-red-500 text-white/);
  assert.match(html, /animate-spin/);
});
