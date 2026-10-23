import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { recentFieldGuideUpdates } from "../src/field-guide-updates.js";

const today = (date) => Date.parse(`${date}T00:00:00Z`);
const entries = JSON.parse(readFileSync(new URL('../content/practice-updates.json', import.meta.url)));

test('only the four published Field Guide content updates qualify on October 23', () => {
  assert.deepEqual(recentFieldGuideUpdates(entries, today('2026-10-23')), {
    Clinic: '2026-10-19', 'Choosing Wisely': '2026-10-14', 'MA-MD': '2026-10-14', Referrals: '2026-10-09',
  });
});

test('the publication date through day 29 qualifies; day 30 expires', () => {
  const entry = [{ date: '2026-10-09', fieldGuideSections: ['Referrals'] }];
  assert.deepEqual(recentFieldGuideUpdates(entry, today('2026-10-09')), { Referrals: '2026-10-09' });
  assert.deepEqual(recentFieldGuideUpdates(entry, today('2026-11-07')), { Referrals: '2026-10-09' });
  assert.deepEqual(recentFieldGuideUpdates(entry, today('2026-11-08')), {});
});

test('future/invalid/unmapped entries cannot light a section; latest qualifying date wins', () => {
  const data = [
    { date: '2026-10-09', fieldGuideSections: ['Referrals'] },
    { date: '2026-10-19', fieldGuideSections: ['Referrals'] },
    { date: '2026-10-24', fieldGuideSections: ['Referrals'] },
    { date: '2026-02-30', fieldGuideSections: ['Schedules'] },
    { date: '2026-10-23' },
  ];
  assert.deepEqual(recentFieldGuideUpdates(data, today('2026-10-23')), { Referrals: '2026-10-19' });
});
