import test from "node:test";
import assert from "node:assert/strict";
import { initialState } from "../src/criteria.js";
import { evaluateCriteria } from "../src/engine.js";

const scenario = (changes) => ({ ...initialState, procedure: "egd", site: "other", bmi: "25", ...changes });

test("EGD BMI boundary routes exactly as supplied", () => {
  assert.equal(evaluateCriteria(scenario({ bmi: "42.9" })).level, "none");
  assert.equal(evaluateCriteria(scenario({ bmi: "43" })).level, "optiflow");
  assert.equal(evaluateCriteria(scenario({ bmi: "50" })).level, "optiflow");
  assert.equal(evaluateCriteria(scenario({ bmi: "50.1" })).level, "mac");
  assert.equal(evaluateCriteria(scenario({ bmi: "55" })).level, "mac");
  assert.equal(evaluateCriteria(scenario({ bmi: "55.1" })).level, "or");
});

test("colonoscopy BMI boundary routes exactly as supplied", () => {
  assert.equal(evaluateCriteria(scenario({ procedure: "colonoscopy", bmi: "50" })).level, "none");
  assert.equal(evaluateCriteria(scenario({ procedure: "colonoscopy", bmi: "50.1" })).level, "mac");
  assert.equal(evaluateCriteria(scenario({ procedure: "colonoscopy", bmi: "60" })).level, "mac");
  assert.equal(evaluateCriteria(scenario({ procedure: "colonoscopy", bmi: "60.1" })).level, "or");
});

test("BMI 80 exposes an OR signal before location is selected", () => {
  const result = evaluateCriteria({ ...initialState, procedure: "egd", bmi: "80" });
  assert.equal(result.completedBasics, false);
  assert.equal(result.level, "or");
  assert.equal(result.bmiAssessment.state, "ready");
  assert.equal(result.bmiAssessment.label, "Operating room");
  assert.ok(result.bmiAssessment.reasons.some((reason) => reason.includes("BMI 80")));
});

test("BMI entered without a procedure explicitly requests procedure context", () => {
  const result = evaluateCriteria({ ...initialState, bmi: "80" });
  assert.equal(result.bmiAssessment.state, "needsProcedure");
  assert.equal(result.bmiAssessment.value, 80);
});

test("highest-acuity criterion wins while all reasons remain", () => {
  const result = evaluateCriteria(scenario({ bmi: "52", severeGastroparesis: true, chronicLung: true }));
  assert.equal(result.level, "or");
  assert.ok(result.reasons.some((reason) => reason.includes("BMI")));
  assert.ok(result.reasons.some((reason) => reason.includes("gastroparesis")));
  assert.ok(result.reasons.some((reason) => reason.includes("lung")));
  assert.ok(result.advisories.some((item) => item.includes("POM")));
});

test("oxygen routing differs by procedure and dose", () => {
  assert.equal(evaluateCriteria(scenario({ oxygen: "intermittentUnder2" })).level, "or");
  assert.equal(evaluateCriteria(scenario({ procedure: "colonoscopy", oxygen: "twoToUnder4" })).level, "macPom");
  assert.equal(evaluateCriteria(scenario({ procedure: "colonoscopy", oxygen: "fourPlus" })).level, "or");
});

test("intellectual disability routes according to IV tolerance", () => {
  assert.equal(evaluateCriteria(scenario({ cognitive: "canIv" })).level, "macPom");
  assert.equal(evaluateCriteria(scenario({ cognitive: "cannotIv" })).level, "or");
});

test("dialysis produces MAC and correct preparation instructions", () => {
  const hd = evaluateCriteria(scenario({ dialysis: "hd" }));
  const pd = evaluateCriteria(scenario({ dialysis: "pd" }));
  assert.equal(hd.level, "mac");
  assert.ok(hd.advisories.some((item) => item.includes("STAT potassium order")));
  assert.equal(pd.level, "mac");
  assert.ok(pd.advisories.some((item) => item.includes("antibiotics")));
  assert.ok(pd.advisories.some((item) => item.includes("Antioch only") && item.includes("not Walnut Creek")));
  assert.ok(pd.advisories.some((item) => item.includes("STAT potassium order")));
});

test("Pleasanton exclusion does not silently alter sedation level", () => {
  const result = evaluateCriteria(scenario({ site: "pleasanton", procedure: "colonoscopy", ageOver75: true }));
  assert.equal(result.level, "none");
  assert.equal(result.status, "excluded");
  assert.ok(result.pleasantonExclusions.some((item) => item.includes("75")));
});

test("exactly four short-acting opioid tablets is flagged, not guessed", () => {
  const result = evaluateCriteria(scenario({ opioid: "shortExactly4" }));
  assert.equal(result.level, "none");
  assert.equal(result.status, "review");
  assert.ok(result.reviewFlags.some((item) => item.includes("exactly 4")));
});

test("short-acting opioid use below four tablets stays in the moderate-sedation lane", () => {
  const result = evaluateCriteria(scenario({ opioid: "shortUnder4" }));
  assert.equal(result.level, "none");
  assert.equal(result.status, "ready");
  assert.equal(result.remimazolam.length, 0);
});

test("heavy-hitter opioid choices trigger MAC and a Remimazolam consideration", () => {
  for (const opioid of ["msContin", "dilaudid", "fentanyl", "opioidBenzo", "shortMore4"]) {
    const result = evaluateCriteria(scenario({ opioid }));
    assert.equal(result.level, "mac", opioid);
    assert.ok(result.remimazolam.some((item) => item.includes("High-dose or long-acting")), opioid);
  }
});

test("OR always adds POM instruction", () => {
  const result = evaluateCriteria(scenario({ severePulmonaryHypertension: true }));
  assert.equal(result.level, "or");
  assert.ok(result.advisories.includes("POM clinic is required before all OR procedures"));
});
