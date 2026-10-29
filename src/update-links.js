// Stable destination keys are public URLs. Preserve keys when labels/layout change.
export const updateDestinations = {
  "remimazolam": { label: "Remimazolam criteria", tab: "sedation", selector: "#criteria-remimazolam" },
  "remimazolam-booking": { label: "Remimazolam HC booking note", tab: "sedation", selector: '[aria-controls="remimazolam-hc-booking"]', action: "click", opened: "#remimazolam-hc-booking" },
  "advanced-adenoma": { label: "Choosing Wisely: advanced adenoma", tab: "orientation", section: "Choosing Wisely", selector: '[data-workflow-image="advanced-adenoma-definition.png"]' },
  "procedures-erbe": { label: "Procedures: ERBE slides", tab: "orientation", section: "Procedures", selector: '[data-presentation-resource="erbe-settings-and-upper-emr"]' },
  "ergonomics": { label: "Ergonomics reference", tab: "orientation", section: "Ergonomics", selector: '[data-presentation-resource="gi-ergonomics"]' },
  "four-habits-video": { label: "Clinic: Four Habits video", tab: "orientation", section: "Clinic", selector: ".patient-communication-video" },
  "choosing-wisely-results": { label: "Choosing Wisely: graduation results", tab: "orientation", section: "Choosing Wisely", selector: ".cw-infographic-launch" },
  "october-meeting-notes": { label: "October 2026 meeting notes", tab: "home", month: 9, selector: ".meeting-notes-card", action: "click", opened: ".meeting-notes-dialog" },
  "inbasket-coverage": { label: "In Basket Podlet Coverage", tab: "coverage", selector: ".inbasket-trigger", action: "click", opened: "#inbasket-coverage-panel" },
  "desktop-medicine": { label: "Desktop Medicine: pharmacy refill support", tab: "dtm", selector: ".dtm-hero" },
  "desktop-medicine-matrix": { label: "Desktop Medicine: medication matrix", tab: "dtm", selector: "#dtm-agreement-title" },
  "desktop-medicine-readiness": { label: "Desktop Medicine: launch requirements", tab: "dtm", selector: "#dtm-launch-note-title" },
  "pathology-workflow": { label: "MA–MD: Messages & Result Notes", tab: "orientation", section: "MA-MD", selector: ".topic-ma-results" },
  "quadriplegia-note": { label: "Operating room: quadriplegia HC note", tab: "sedation", selector: '[aria-controls="quadriplegia-hc-rationale"]', action: "click", opened: "#quadriplegia-hc-rationale" },
  "dialysis-rationale": { label: "MAC: peritoneal-dialysis location rationale", tab: "sedation", selector: '[aria-controls="peritoneal-dialysis-location"]', action: "click", opened: "#peritoneal-dialysis-location" },
  "dialysis-booking": { label: "MAC: dialysis booking and potassium note", tab: "sedation", selector: '[aria-controls="dialysis-hc-instructions"]', action: "click", opened: "#dialysis-hc-instructions" },
  "outside-kp-referrals": { label: "Referrals: Outside KP Referrals", tab: "orientation", section: "Services", selector: ".topic-services-outside" },
  "podlets": { label: "MA–MD Podlets", tab: "coverage", selector: ".site-stack" },
  "medication-holds": { label: "Sedation: medication holds", tab: "sedation", selector: ".medication-trigger", action: "click", opened: "#medication-holds-panel" },
  "september-hepatitis": { label: "September 2026: Immunotherapy-Induced Hepatitis", tab: "home", month: 8, selector: '[data-calendar-resource="immunotherapy-induced-hepatitis"]' },
  "july-erbe": { label: "July 2026: ERBE presentation", tab: "home", month: 6, selector: '[data-calendar-resource="erbe-settings-and-upper-emr"]' },
  "september-four-habits": { label: "September 2026: Four Habits presentation", tab: "home", month: 8, selector: '[data-calendar-resource="four-habits"]' },
  "choosing-wisely": { label: "Choosing Wisely: colonoscopy graduation", tab: "orientation", section: "Choosing Wisely", selector: ".orientation-card" },
  "pool-party": { label: "Communication: Pool Party", tab: "orientation", section: "Communication", selector: ".orientation-pool-party" },
  "email-directory": { label: "Communication: Email Directory", tab: "orientation", section: "Communication", selector: ".orientation-email-directory" },
  "walnut-creek-podlets": { label: "Walnut Creek MA–MD Podlets", tab: "coverage", selector: ".site-wcr" },
  "skills-day": { label: "Procedures: Skills Day", tab: "orientation", section: "Procedures", selector: ".orientation-skills-day" },
  "facility-directory": { label: "Contacts: KPATHS Directory Access", tab: "orientation", section: "Contacts", selector: ".topic-contact-directory" },
  "field-guide": { label: "New Physician Orientation Field Guide", tab: "orientation", section: "Schedules", selector: ".orientation-page" },
  "mac-opioids": { label: "MAC: high-dose and long-acting narcotics", tab: "sedation", selector: "#criteria-mac .criteria-contrast" },
  "sedation": { label: "Procedure Sedation Criteria", tab: "sedation", selector: "#sedation-panel" },
};

const tabs = new Set(["home", "sedation", "coverage", "orientation", "dtm"]);

export function destinationHref(key) {
  if (!Object.hasOwn(updateDestinations, key)) throw new Error(`Unknown update destination: ${key}`);
  return `?section=${encodeURIComponent(key)}`;
}

export function readSiteLocation(search) {
  const params = new URLSearchParams(search);
  if (params.get("view") === "change-log") return { tab: "home", updates: true, destination: null };
  const key = params.get("section");
  if (Object.hasOwn(updateDestinations, key)) return { tab: updateDestinations[key].tab, updates: false, destination: key };
  return { tab: tabs.has(params.get("tab")) ? params.get("tab") : "home", updates: false, destination: null };
}

export function validateUpdateEntries(entries) {
  const ids = new Set();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate/missing update id: ${entry.id}`);
    ids.add(entry.id);
    if (!Array.isArray(entry.changes) || !entry.changes.length || !Array.isArray(entry.targets) || entry.targets.length !== entry.changes.length) {
      throw new Error(`${entry.id}: every change must have a matching targets array`);
    }
    entry.targets.forEach((targets, index) => {
      if (!Array.isArray(targets) || !targets.length || new Set(targets).size !== targets.length) throw new Error(`${entry.id} change ${index}: supply unique, nonempty section targets`);
      for (const key of targets) {
        destinationHref(key);
        const destination = updateDestinations[key];
        if (!destination.label?.trim() || !tabs.has(destination.tab) || !destination.selector?.trim()) throw new Error(`${key}: supply a label, valid tab and exact section selector`);
        if (destination.month !== undefined && (!Number.isInteger(destination.month) || destination.month < 0 || destination.month > 11)) throw new Error(`${key}: calendar month must be 0–11`);
      }
    });
  }
  return entries;
}
