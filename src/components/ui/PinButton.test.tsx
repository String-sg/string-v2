import test from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { PinButton } from './PinButton';

test('renders correct title and styles for pinned vs unpinned states', () => {
  const unpinnedHtml = renderToStaticMarkup(
    <PinButton isPinned={false} onPin={() => undefined} onUnpin={() => undefined} />
  );
  assert.match(unpinnedHtml, /title="Pin"/);
  assert.match(unpinnedHtml, /hover:bg-string-mint/);

  const pinnedHtml = renderToStaticMarkup(
    <PinButton isPinned onPin={() => undefined} onUnpin={() => undefined} />
  );
  assert.match(pinnedHtml, /title="Unpin"/);
  assert.match(pinnedHtml, /bg-string-mint\/10/);
});

test('invokes correct handlers and stops propagation', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  let parentClicks = 0;
  let pinCalls = 0;
  let unpinCalls = 0;

  const root = createRoot(container);
  act(() => {
    root.render(
      <div onClick={() => parentClicks++}>
        <PinButton
          isPinned={false}
          onPin={() => pinCalls++}
          onUnpin={() => unpinCalls++}
        />
      </div>
    );
  });

  const button = container.querySelector('button');
  assert.ok(button);

  button?.dispatchEvent(
    new window.MouseEvent('click', { bubbles: true, cancelable: true })
  );

  assert.equal(parentClicks, 0);
  assert.equal(pinCalls, 1);
  assert.equal(unpinCalls, 0);

  act(() => {
    root.render(
      <div onClick={() => parentClicks++}>
        <PinButton
          isPinned
          onPin={() => pinCalls++}
          onUnpin={() => unpinCalls++}
        />
      </div>
    );
  });

  const pinnedButton = container.querySelector('button');
  pinnedButton?.dispatchEvent(
    new window.MouseEvent('click', { bubbles: true, cancelable: true })
  );

  assert.equal(parentClicks, 0);
  assert.equal(pinCalls, 1);
  assert.equal(unpinCalls, 1);

  act(() => {
    root.unmount();
  });
  container.remove();
});
