import test from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

test('adds an existing app to the profile launcher without waiting for approval', async () => {
  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];

  // Keep auth in a signed-in state for the form
  window.localStorage.setItem(
    'string-auth-user',
    JSON.stringify({
      id: 'user-1',
      email: 'user@example.com',
      name: 'Demo User',
      image: '',
    })
  );

  globalThis.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    fetchCalls.push(url);

    if (url === '/api/apps') {
      return {
        ok: true,
        json: async () => ({ apps: [] }),
      } as unknown as Response;
    }

    throw new Error(`Unexpected fetch call: ${url}`);
  };

  const addedApps: unknown[] = [];
  let successCount = 0;

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  try {
    const { AppSubmissionForm } = await import('./AppSubmissionForm');

    await act(async () => {
      root.render(
        <AppSubmissionForm
          fromProfile
          testSelectedExistingApp={{
            id: 'app-123',
            name: 'Demo App',
            url: 'https://demo.app',
          }}
          onAddExistingApp={async (app) => {
            addedApps.push(app);
            return true;
          }}
          onSuccess={() => successCount++}
        />
      );
    });

    const addButton = Array.from(
      container.querySelectorAll('button')
    ).find((button) =>
      button.textContent?.includes('Add to profile and homepage')
    );
    assert.ok(addButton);

    await act(async () => {
      addButton.dispatchEvent(
        new window.MouseEvent('click', { bubbles: true })
      );
    });

    assert.equal(addedApps.length, 1);
    assert.equal((addedApps[0] as { id: string }).id, 'app-123');
    assert.equal(successCount, 1);
    assert.deepEqual(fetchCalls, ['/api/apps']);
  } finally {
    root.unmount();
    container.remove();
    globalThis.fetch = originalFetch;
    window.localStorage.removeItem('string-auth-user');
  }
});
