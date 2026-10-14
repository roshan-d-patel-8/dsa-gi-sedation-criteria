import assert from "node:assert/strict";
import test from "node:test";

import { dtmMedicationGroups } from "../src/dtm.js";

test("DTM agreement preserves the five supplied medication groups and 54 actionable entries", () => {
  assert.deepEqual(
    dtmMedicationGroups.map(({ title }) => title),
    ["IBD Medications", "Liver medications", "Anti-diarrhea / IBS medications", "GERD/nausea medications", "Constipation medications"],
  );
  assert.equal(dtmMedicationGroups.flatMap(({ rows }) => rows).length, 54);
});

test("DTM source boundaries remain explicit rather than inferred", () => {
  const medications = dtmMedicationGroups.flatMap(({ rows }) => rows);
  assert.equal(medications.some(({ generic }) => generic === "TCA's?"), false);
  assert.equal(medications.find(({ generic, brand }) => generic === "Simethicone" && brand === "Gas-X").refills, null);
  assert.equal(medications.find(({ generic, brand }) => generic === "Infliximab" && brand === "Remicade").refills, "Up to the next related lab due date (max- 6 months)");
});
