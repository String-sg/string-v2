import test from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { LaunchButton } from './LaunchButton';

test('renders target and rel attributes for external launch', () => {
  const html = renderToStaticMarkup(<LaunchButton url="https://example.com" />);

  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /href="https:\/\/example.com"/);
});

test('stops click propagation to parent elements', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  let parentClicks = 0;

  const root = createRoot(container);
  act(() => {
    root.render(
      <div onClick={() => parentClicks++}>
        <LaunchButton url="https://string.sg" />
      </div>
    );
  });

  const anchor = container.querySelector('a');
  assert.ok(anchor);

  anchor?.dispatchEvent(
    new window.MouseEvent('click', { bubbles: true, cancelable: true })
  );

  assert.equal(parentClicks, 0);

  act(() => {
    root.unmount();
  });
  container.remove();
});
