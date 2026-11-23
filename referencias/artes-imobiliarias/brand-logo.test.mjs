import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyBrandLogo } from './brand-logo.mjs';

test('aplica o arquivo da logo sobre a arte sem deformar sua proporção', async () => {
  const previousImage = globalThis.Image, previousDocument = globalThis.document;
  const drawn = [];
  globalThis.Image = class {
    set src(value) { this.id = value; this.naturalWidth = value === 'logo-original' ? 400 : 1000; this.naturalHeight = value === 'logo-original' ? 100 : 1000; queueMicrotask(() => this.onload()); }
  };
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ({ drawImage: (...args) => drawn.push(args) }), toDataURL: () => 'data:image/png;base64,teste' }) };
  try {
    const output = await applyBrandLogo('arte', 'logo-original');
    assert.equal(output, 'data:image/png;base64,teste');
    assert.equal(drawn.length, 2); assert.equal(drawn[0][0].id, 'arte'); assert.equal(drawn[1][0].id, 'logo-original');
    assert.equal(drawn[1][3] / drawn[1][4], 4);
  } finally { globalThis.Image = previousImage; globalThis.document = previousDocument; }
});

test('não entrega uma arte afirmando que possui logo quando ela não está disponível', async () => {
  await assert.rejects(() => applyBrandLogo('arte', null), /logo/i);
});
