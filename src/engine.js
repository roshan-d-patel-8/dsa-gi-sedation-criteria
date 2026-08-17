const LEVELS = ["none", "optiflow", "mac", "macPom", "or"];

const labelFor = {
  none: "No listed escalation",
  optiflow: "Optiflow workflow",
  mac: "MAC",
  macPom: "MAC + POM",
  or: "Operating room",
};

function addUnique(list, value) {
  if (value && !list.includes(value)) list.push(value);
}

export function evaluateCriteria(state) {
  let level = "none";
  const reasons = [];
  const advisories = [];
  const reviewFlags = [];
  const pleasantonExclusions = [];
  const remimazolam = [];

  const elevate = (next, reason) => {
    if (LEVELS.indexOf(next) > LEVELS.indexOf(level)) level = next;
    addUnique(reasons, reason);
  };

  const bmi = state.bmi === "" ? null : Number(state.bmi);
  const hasValidBmi = bmi !== null && Number.isFinite(bmi) && bmi > 0;

  if (hasValidBmi) {
    if (state.procedure === "egd") {
      if (bmi > 55) elevate("or", `EGD BMI ${bmi} is greater than 55`);
      else if (bmi > 50) elevate("mac", `EGD BMI ${bmi} is greater than 50`);
      else if (bmi >= 43) elevate("optiflow", `EGD BMI ${bmi} is within the listed 43–50 Optiflow range`);
      if (state.site === "pleasanton" && bmi > 42) {
        addUnique(pleasantonExclusions, `EGD BMI ${bmi} is greater than the Pleasanton limit of 42`);
      }
    }

    if (state.procedure === "colonoscopy") {
      if (bmi > 60) elevate("or", `Colonoscopy BMI ${bmi} is greater than 60`);
      else if (bmi > 50) elevate("mac", `Colonoscopy BMI ${bmi} is greater than 50`);
      if (state.site === "pleasanton" && bmi > 50) {
        addUnique(pleasantonExclusions, `Colonoscopy BMI ${bmi} is greater than the Pleasanton limit of 50`);
      }
    }

    if (state.procedure === "turns") {
      if (bmi >= 43 && bmi <= 50) elevate("optiflow", `TURNS BMI ${bmi} is within the listed 43–50 Optiflow range`);
      if (bmi > 50) addUnique(reviewFlags, "The supplied policy does not define a TURNS route for BMI above 50");
      if (state.site === "pleasanton") addUnique(reviewFlags, "Pleasanton BMI exclusions are not defined for TURNS");
    }
  }

  if (state.severeOsa) {
    if (state.procedure === "egd") elevate("mac", "Severe OSA requiring CPAP/BiPAP for EGD");
    else if (state.procedure === "colonoscopy") addUnique(advisories, "Conscious sedation is listed for colonoscopy with severe OSA");
    else addUnique(reviewFlags, "Severe OSA routing is not defined for TURNS");
    if (state.site === "pleasanton") addUnique(pleasantonExclusions, "Severe OSA requiring CPAP/BiPAP");
  }

  if (state.oxygen !== "none") {
    if (state.procedure === "egd") elevate("or", "Oxygen dependence for EGD");
    else if (state.procedure === "colonoscopy") {
      if (state.oxygen === "fourPlus") elevate("or", "Home oxygen at 4 L/min or more for colonoscopy");
      else elevate("macPom", "Oxygen dependence for colonoscopy");
      if (state.oxygen === "intermittentUnder2" && !state.activeChfFlare) {
        addUnique(reviewFlags, "POM may not be warranted for intermittent oxygen below 2 L/min without an active CHF flare");
      }
    } else addUnique(reviewFlags, "Oxygen-dependence routing is not defined for TURNS");
    if (state.site === "pleasanton") addUnique(pleasantonExclusions, "Home oxygen therapy");
  }

  if (state.chronicLung) elevate("macPom", "Symptomatic chronic lung disease");
  if (state.valvular) elevate("macPom", "Symptomatic valvular disease");
  if (state.chf === "under30") elevate("macPom", "CHF with EF below 30%");
  if (state.stableAngina) elevate("macPom", "CAD with active stable angina");
  if (state.reversibleCad && state.site === "pleasanton") addUnique(pleasantonExclusions, "Known reversible CAD or unstable angina");
  if (state.activeChfFlare && state.site === "pleasanton") addUnique(pleasantonExclusions, "Severe or poorly controlled CHF");

  const longActingOpioids = ["msContin", "dilaudid", "fentanyl", "opioidBenzo", "shortMore4"];
  if (longActingOpioids.includes(state.opioid)) {
    elevate("mac", "High-dose or long-acting opioid use");
    addUnique(remimazolam, "High-dose or long-acting opioid use");
  }
  if (state.opioid === "shortExactly4") addUnique(reviewFlags, "The policy defines fewer than 4 and more than 4 tablets/day, but not exactly 4");

  if (state.antagonist !== "none") {
    elevate("mac", "Opioid antagonist use");
    if (state.antagonist === "contrave") addUnique(advisories, "Contrave: discontinue 7 days before surgery and/or opioid administration");
    if (state.antagonist === "revia") addUnique(advisories, "Oral naltrexone/Revia: stop 3 days before surgery");
    if (state.antagonist === "vivitrol") addUnique(advisories, "Long-acting IM naltrexone/Vivitrol: stop 1 month before surgery");
    if (state.antagonist === "buprenorphine") addUnique(reviewFlags, "The supplied policy routes buprenorphine/Suboxone to MAC but does not provide a medication-hold instruction");
  }

  if (state.heavyAlcoholDrug) {
    elevate("mac", "Heavy alcohol or drug use");
    addUnique(remimazolam, "Very heavy alcohol or drug use");
  }
  if (state.heavyCannabis) {
    addUnique(advisories, "Consider MAC for heavy cannabis use");
    addUnique(reviewFlags, "Heavy cannabis use is a MAC consideration, not an automatic route in the supplied policy");
  }
  if (state.excessivePainAnxiety) elevate("mac", "Excessive pain or anxiety");
  if (state.priorIntolerance) {
    elevate("mac", "Prior intolerance or failure of moderate sedation");
    addUnique(remimazolam, "Failed moderate sedation in the past");
  }
  if (state.colonoscopyPain) {
    addUnique(advisories, "Consider MAC because remimazolam has no analgesic properties");
    addUnique(reviewFlags, "Significant colonoscopy pain is a MAC consideration, not an automatic route in the supplied policy");
  }
  if (state.traumaHistory) elevate("mac", "History of sexual or physical trauma");

  if (state.dialysis === "hd") {
    elevate("mac", "ESRD on hemodialysis");
    addUnique(advisories, "Arrive 2 hours early for potassium check");
  }
  if (state.dialysis === "pd") {
    elevate("mac", "ESRD on peritoneal dialysis");
    addUnique(advisories, "Arrive 2 hours early for antibiotics and potassium check");
  }
  if (state.dialysis !== "none" && state.site === "pleasanton") addUnique(pleasantonExclusions, "Dialysis or renal failure");
  if (state.dialysis !== "none" && state.chf !== "none") addUnique(reviewFlags, "Combined CHF and ESRD may warrant OR; individualized anesthesia input is advised");

  if (state.cognitive === "canIv") elevate("macPom", "Intellectual disability or dementia with ability to tolerate pre-procedure IV");
  if (state.cognitive === "cannotIv") elevate("or", "Intellectual disability or dementia without ability to tolerate pre-procedure IV");
  if (state.severeGastroparesis) elevate("or", "Severe gastroparesis");
  if (state.severePulmonaryHypertension) elevate("or", "Severe pulmonary hypertension");
  if (state.majorMobilityLimitation) elevate("or", "Physical limitation requiring multiple people for transfer");

  if (state.site === "pleasanton") {
    if (state.ageOver75) addUnique(pleasantonExclusions, "Age greater than 75");
    if (state.highRiskIntervention) addUnique(pleasantonExclusions, "High-risk intervention");
    if (state.deepBrainStimulator) addUnique(pleasantonExclusions, "Deep brain stimulator");
    if (state.coagulopathy) addUnique(pleasantonExclusions, "Coagulopathy or thrombocytopenia with possible need for blood products");
    if (state.meld11OrMore) addUnique(pleasantonExclusions, "Cirrhosis with MELD score 11 or greater");
  }

  if (level === "or") addUnique(advisories, "POM clinic is required before all OR procedures");
  if (level === "optiflow") addUnique(advisories, "Add Optiflow to booking instructions on the e-consult/case request");
  if (level === "macPom") addUnique(advisories, "POM clinic review indicated");

  const completedBasics = Boolean(state.procedure && state.site && hasValidBmi);
  const status = !completedBasics
    ? "incomplete"
    : reviewFlags.length > 0
      ? "review"
      : pleasantonExclusions.length > 0
        ? "excluded"
        : "ready";

  return {
    level,
    label: labelFor[level],
    status,
    completedBasics,
    reasons,
    advisories,
    reviewFlags,
    pleasantonExclusions,
    remimazolam,
  };
}

export function bookingSummary(state, result) {
  if (!result.completedBasics) return "Complete procedure, site, and BMI before generating a routing summary.";
  const procedure = state.procedure === "egd" ? "EGD" : state.procedure === "colonoscopy" ? "Colonoscopy" : "TURNS";
  const lines = [
    `${procedure} sedation routing support — ${result.label}.`,
    result.reasons.length ? `Trigger(s): ${result.reasons.join("; ")}.` : "No listed escalation criterion identified from the supplied answers.",
  ];
  if (result.pleasantonExclusions.length) lines.push(`Pleasanton exclusion(s): ${result.pleasantonExclusions.join("; ")}.`);
  if (result.advisories.length) lines.push(`Instructions: ${result.advisories.join("; ")}.`);
  if (result.reviewFlags.length) lines.push(`Anesthesia review: ${result.reviewFlags.join("; ")}.`);
  if (result.remimazolam.length) lines.push(`Remimazolam consideration(s): ${result.remimazolam.join("; ")}.`);
  lines.push("Decision-support output only; confirm against current policy and clinical judgment.");
  return lines.join("\n");
}
