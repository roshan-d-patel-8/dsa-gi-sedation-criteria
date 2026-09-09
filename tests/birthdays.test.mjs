import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { birthdayEvents } from "../src/birthdays.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contactsRoot = resolve(repoRoot, "..", "Contacts");

test("September through December GI birthday data is complete and has portraits", () => {
  assert.equal(birthdayEvents.length, 11);
  assert.deepEqual([...birthdayEvents].sort((a, b) => a.date.localeCompare(b.date)), birthdayEvents);
  assert.equal(new Set(birthdayEvents.map(({ name }) => name)).size, birthdayEvents.length);

  for (const birthday of birthdayEvents) {
    assert.match(birthday.date, /^2026-(09|10|11|12)-\d{2}$/);
    assert(existsSync(resolve(repoRoot, "public", "portraits", birthday.photo)), `${birthday.name} must have a portrait`);
  }
});

test("GI birthdays match their vault contact cards when the vault is available", { skip: !existsSync(contactsRoot) }, () => {
  for (const birthday of birthdayEvents.filter(({ sourceNote }) => sourceNote)) {
    const contactPath = resolve(contactsRoot, birthday.sourceNote);
    const contact = readFileSync(contactPath, "utf8");
    assert.match(contact, /^relationship: colleague$/m, `${birthday.name} must be a colleague`);
    assert.match(contact, /^role: Gastroenterologist$/m, `${birthday.name} must be a gastroenterologist`);
    assert.match(contact, /^organization: DSA Gastroenterology$/m, `${birthday.name} must be in DSA Gastroenterology`);
    assert.equal(contact.match(/^birthday:\s*(.+)$/m)?.[1], birthday.displayDate, `${birthday.name}'s birthday must match the vault`);
  }
});

test("Roshan Patel's user-supplied birthday is represented", () => {
  assert.deepEqual(
    birthdayEvents.find(({ name }) => name === "Roshan Patel"),
    {
      name: "Roshan Patel",
      date: "2026-11-21",
      displayDate: "November 21",
      photo: "roshan-patel.webp",
      source: "user",
    },
  );
});
