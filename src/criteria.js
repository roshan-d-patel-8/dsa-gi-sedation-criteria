export const POLICY_VERSION = "August 2026";

export const initialState = {
  procedure: "",
  site: "",
  bmi: "",
  oxygen: "none",
  opioid: "none",
  antagonist: "none",
  dialysis: "none",
  cognitive: "none",
  chf: "none",
  severeOsa: false,
  chronicLung: false,
  valvular: false,
  stableAngina: false,
  reversibleCad: false,
  activeChfFlare: false,
  heavyAlcoholDrug: false,
  heavyCannabis: false,
  excessivePainAnxiety: false,
  priorIntolerance: false,
  colonoscopyPain: false,
  traumaHistory: false,
  severeGastroparesis: false,
  severePulmonaryHypertension: false,
  majorMobilityLimitation: false,
  ageOver75: false,
  highRiskIntervention: false,
  deepBrainStimulator: false,
  coagulopathy: false,
  meld11OrMore: false,
};

export const procedureOptions = [
  { value: "egd", label: "EGD" },
  { value: "colonoscopy", label: "Colonoscopy" },
  { value: "turns", label: "TURNS" },
];

export const policySections = [
  {
    id: "optiflow",
    title: "Optiflow",
    tone: "optiflow",
    items: [
      "EGD and TURNS with BMI 43–50.",
      "Document in booking instructions on the e-consult or case request.",
      "Optiflow case request order set is needed.",
    ],
  },
  {
    id: "mac",
    title: "MAC",
    tone: "mac",
    items: [
      "BMI >50 for EGD or colonoscopy.",
      "Severe OSA requiring CPAP/BiPAP for EGD; conscious sedation is listed for colonoscopy.",
      {
        text: "Chronic pain with high-dose narcotic dependence. MAC only if the patient is taking high-dose or long-acting narcotics:",
        contrast: [
          {
            tone: "moderate",
            label: "Moderate sedation",
            title: "Short-acting, lower-dose",
            details: ["Norco, Percocet, or Vicodin <4 tabs/day is generally appropriate for moderate sedation."],
          },
          {
            tone: "heavy",
            label: "MAC + Remimazolam signal",
            title: "High-dose or long-acting",
            details: ["MS Contin", "Oral Dilaudid", "Fentanyl Patch", "Opiate AND Benzo use", "Norco, Percocet, or Vicodin >4 tabs/day"],
          },
        ],
        boundary: "Exactly 4 tabs/day is not defined in the supplied policy and requires review.",
      },
      "Opioid antagonist use, including naloxone, naltrexone, or buprenorphine/Suboxone.",
      "Heavy alcohol or drug use.",
      "Excessive pain/anxiety or prior intolerance to moderate sedation.",
      "History of sexual or physical trauma.",
      "ESRD on hemodialysis or peritoneal dialysis, with two-hour early-arrival instructions.",
    ],
  },
  {
    id: "mac-pom",
    title: "MAC + POM",
    tone: "macPom",
    items: [
      "Symptomatic chronic lung disease.",
      "Symptomatic valvular disease.",
      "CHF with EF <30%.",
      "CAD with active stable angina.",
      "Oxygen dependence for colonoscopy, subject to the low-dose/intermittent exception.",
      "Intellectual disability or dementia when pre-procedure IV can be tolerated.",
    ],
  },
  {
    id: "or",
    title: "Operating room",
    tone: "or",
    items: [
      "BMI >55 for EGD or >60 for colonoscopy.",
      "Oxygen dependence for EGD.",
      "Home oxygen ≥4 L/min for colonoscopy.",
      "Severe gastroparesis.",
      "Intellectual disability or dementia when pre-procedure IV cannot be tolerated.",
      "Severe pulmonary hypertension.",
      "Physical limitation such as quadriplegia or being bedbound when multiple people are needed for transfer.",
      "All OR procedures require POM clinic beforehand.",
    ],
  },
  {
    id: "pleasanton",
    title: "Pleasanton exclusions",
    tone: "exclusion",
    items: [
      "BMI >42 for EGD or >50 for colonoscopy.",
      "Home oxygen therapy.",
      "Age >75.",
      "Dialysis or renal failure.",
      "High-risk intervention, including banding or EMR/removal of large polyps.",
      "Severe OSA requiring CPAP/BiPAP.",
      "Known reversible CAD or unstable angina.",
      "Severe or poorly controlled CHF.",
      "Deep brain stimulator.",
      "Coagulopathy or thrombocytopenia with potential need for blood products.",
      "Cirrhosis with MELD score ≥11.",
    ],
  },
  {
    id: "remimazolam",
    title: "Remimazolam considerations",
    tone: "remi",
    items: [
      "High-dose or long-acting opiates.",
      "Failed moderate sedation in the past.",
      "Very heavy alcohol or drug use.",
      "No BMI or cardiopulmonary criteria currently listed.",
      "Consider MAC for significant colonoscopy pain under moderate sedation because remimazolam has no analgesic properties.",
      "Consider MAC for heavy cannabis use.",
    ],
  },
];

export const medicationGuidance = [
  {
    medication: "Naltrexone–bupropion",
    brand: "Contrave",
    risk: "Opioid antagonist; risk of inadequate perioperative pain management.",
    instruction: "Discontinue 7 days before surgery and/or opioid administration.",
  },
  {
    medication: "Naltrexone",
    brand: "Revia",
    risk: "Opioid receptor antagonist.",
    instruction: "Stop 3 days before surgery.",
  },
  {
    medication: "Long-acting IM naltrexone",
    brand: "Vivitrol",
    risk: "May increase opioid anesthetic or postoperative analgesic dose requirements.",
    instruction: "Stop 1 month before surgery.",
  },
];
