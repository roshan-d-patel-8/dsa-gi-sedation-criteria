import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { validateUpdateEntries, updateDestinations, destinationHref, readSiteLocation } from "../src/update-links.js";
const entries = JSON.parse(readFileSync(new URL("../content/practice-updates.json", import.meta.url)));

test("every published change has valid explicit section links", () => {
  assert.equal(validateUpdateEntries(entries), entries);
});
test("future updates fail validation when a change lacks a link or names a missing section", () => {
  const entry = { id: "new-update", changes: ["Changed one section."] };
  assert.throws(() => validateUpdateEntries([entry]), /matching targets/);
  assert.throws(() => validateUpdateEntries([{ ...entry, targets: [[]] }]), /nonempty/);
  assert.throws(() => validateUpdateEntries([{ ...entry, targets: [["missing"]] }]), /Unknown/);
  assert.throws(() => validateUpdateEntries([{ ...entry, targets: [["sedation", "sedation"]] }]), /unique/);
});
test("section URLs round trip and retain legacy update-view compatibility", () => {
  for (const [key, target] of Object.entries(updateDestinations)) assert.deepEqual(readSiteLocation(destinationHref(key)), { tab: target.tab, updates: false, destination: key });
  assert.deepEqual(readSiteLocation("?view=change-log&section=sedation"), { tab: "home", updates: true, destination: null });
  assert.deepEqual(readSiteLocation("?section=unknown&tab=sedation"), { tab: "sedation", updates: false, destination: null });
  assert.deepEqual(readSiteLocation("?tab=invalid"), { tab: "home", updates: false, destination: null });
});
test("archived presentations and meeting notes retain their assigned months", () => {
  assert.equal(updateDestinations["july-erbe"].month, 6);
  assert.equal(updateDestinations["september-four-habits"].month, 8);
  assert.equal(updateDestinations["september-hepatitis"].month, 8);
  assert.equal(updateDestinations["october-meeting-notes"].month, 9);
});
