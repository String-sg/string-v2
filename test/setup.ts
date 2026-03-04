import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});

globalThis.window = dom.window as unknown as typeof globalThis.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true
});
Object.defineProperty(globalThis, 'HTMLElement', {
  value: dom.window.HTMLElement,
  configurable: true
});
Object.defineProperty(globalThis, 'SVGElement', {
  value: dom.window.SVGElement,
  configurable: true
});
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
