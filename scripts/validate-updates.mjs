import { readFileSync } from "node:fs";
import { validateUpdateEntries } from "../src/update-links.js";
const entries = JSON.parse(readFileSync(new URL("../content/practice-updates.json", import.meta.url), "utf8"));
validateUpdateEntries(entries);
console.log(`Validated section links for ${entries.length} What's New entries.`);
