import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const source = JSON.parse(readFileSync(new URL('../content/gi-path-workflow-source.json', import.meta.url)));
const html = readFileSync(new URL('../src/path-workflow.html', import.meta.url), 'utf8');
const norm = text => text.replace(/\s+/g, ' ').trim();
const decode = text => text.replace(/&(?:amp|lt|gt|quot|#x27);/g, entity => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#x27;':"'"}[entity]));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('pathology workflow preserves every source paragraph in source order', () => {
  const rendered = new Map();
  for (const match of html.matchAll(/<([a-z0-9]+) data-source-paragraph="(\d+)"[^>]*>([\s\S]*?)<\/\1>/g)) {
    const index = Number(match[2]);
    rendered.set(index, [...(rendered.get(index) || []), decode(match[3].replace(/<[^>]+>/g, ''))]);
  }
  assert.equal(source.paragraphs.length, 37);
  assert.deepEqual([...rendered.keys()], source.paragraphs.map(p => p.index));
  for (const paragraph of source.paragraphs) assert.equal(norm(rendered.get(paragraph.index).join(' ')), norm(paragraph.text));
});

test('all five original screenshots retain exact bytes and dimensions', () => {
  assert.equal(source.images.length, 5);
  for (const image of source.images) {
    const bytes = readFileSync(new URL(`../public/${image.path}`, import.meta.url));
    assert.equal(hash(bytes), image.sha256);
    assert.equal(bytes.readUInt32BE(16), image.width);
    assert.equal(bytes.readUInt32BE(20), image.height);
    assert.ok(html.includes(`data-workflow-src="${image.path}"`));
    assert.ok(html.includes(`alt="${image.alt}"`));
  }
});

test('local original DOCX remains unchanged when available', {skip: !existsSync('/Users/roshanpatel/Desktop/GI path workflow (DSA).docx')}, () => {
  assert.equal(hash(readFileSync('/Users/roshanpatel/Desktop/GI path workflow (DSA).docx')), source.sourceSha256);
});
