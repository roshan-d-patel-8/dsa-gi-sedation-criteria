---
tags:
  - ClaudeAI
---

# Changelog

## 0.10.5 — 2026-08-29

- Added Omar Al-Shuwaykh's portrait to the Deer Valley Pod 3 roster (144×173 webp from his vault contact-card photo), replacing the "OA" initials avatar. The "New" tag is unchanged.

## 0.10.4 — 2026-08-27

- Clarified the MAC ESRD criterion: peritoneal-dialysis cases must be booked at Antioch only, not Walnut Creek.
- Added the requirement for a STAT potassium order for every hemodialysis and peritoneal-dialysis patient.
- Updated the preserved policy source, routing advisories, and regression checks together.

## 0.10.3 — 2026-08-27

- Added the black “next review date February 2027” label to the upper-right of the Procedure Sedation Criteria header.

## 0.10.2 — 2026-08-26

- Replaced every paragraph wrapper inside orientation list items with a true inline text span so markers and first-line text share one browser-independent line box.
- Expanded browser QA across all 11 orientation sections to reject any remaining list-item paragraph wrappers.

## 0.10.1 — 2026-08-26

- Removed list-marker gaps by keeping bullets and numbered labels on the same line as their text at every nesting level.
- Bolded colon-delimited labels at the start of orientation lines while preserving the supplied wording and links.
- Grouped management roles and contact details into Walnut Creek, Deer Valley, Dublin, and departmentwide panels.
- Added browser checks for list alignment, label emphasis, site grouping, and cross-site content separation.

## 0.10.0 — 2026-08-26

- Replaced orientation quick-jump links and the long 11-section document stack with a true accessible sub-tab interface that displays one section at a time.
- Increased orientation body copy from 11.5px to 15.25px on desktop and 14.25px on mobile.
- Added six section-specific color systems and reformatted top-level lists, facts, warnings, and subheadings as colored cards and callouts.
- Preserved guide-wide search by filtering the section tabs and automatically presenting the first matching section.
- Added arrow, Home, and End keyboard navigation across the orientation sub-tabs.

## 0.9.0 — 2026-08-26

- Added New Physician Orientation Materials as a third folder tab.
- Preserved the full supplied GI Orientation 2024 text across 11 collapsible reference sections.
- Added guide search, section quick jumps, keyboard tab navigation, responsive layouts, and internal-detail markers.
- Excluded two HealthConnect screenshots because they display patient names.
- Published the complete text after explicit public-visibility authorization on 2026-08-26; the two HealthConnect screenshots remain excluded because they display patient names.

## 0.8.0 — 2026-08-17

- Removed the redundant Coverage Rhythm footer from every pod.
- Moved MA workday, float, and coverage details into hover and keyboard-focus tooltips on MA Responsible chips.
- Kept coverage-only MAs within the MA Responsible block so every assignment remains visible while each panel uses less space.

## 0.7.1 — 2026-08-17

- Renamed the second tab and page to DSA GI MA-MD Podlets so the title matches the represented scope.

## 0.7.0 — 2026-08-17

- Reframed the site as a file-folder interface with two clickable top tabs.
- Preserved the Procedure Sedation Criteria matrix as tab 01.
- Added DSA GI MA-MD Podlets as tab 02 with DRV and WCR pod cards.
- Expanded screenshot abbreviations into vault-verified provider names.
- Added 23 optimized local physician portraits and branded initial medallions for providers without vault portraits.
- Labeled the podlet roster broadly as 2026 assignments and omitted the empty DRV Pod 4.
- Published the expanded roster, workday patterns, assignments, and portraits after explicit public-visibility authorization.

## 0.6.2 — 2026-08-17

- Removed the explanatory sentence beside the criteria-matrix heading and collapsed the unused heading space.

## 0.6.1 — 2026-08-17

- Removed the undefined exactly-four-tablets-per-day boundary callout from the MAC opioid comparison.

## 0.6.0 — 2026-08-17

- Removed the interactive Navigator and all tab and filter buttons.
- Made the Criteria Matrix the sole page.
- Integrated the POM naltrexone medication guide as card 07.
- Repacked the reference into balanced desktop columns and ordered responsive grids to reduce scrolling.

## 0.5.0 — 2026-08-17

- Added an immediate BMI-to-sedation signal inside Procedure Coordinates with a visible BMI → route relationship.
- Exposed the provisional BMI route in the result panel as soon as procedure and BMI are available, without waiting for location.
- Added a specific procedure prompt when BMI is entered first because EGD, colonoscopy, and TURNS use different thresholds.
- Added engine and browser regression tests for the reported BMI 80 scenario.

## 0.4.1 — 2026-08-17

- Repaired the Navigator step-card grid after the taller opioid comparison disrupted its compact tile rhythm.
- Allowed Step 05 to span two layout tracks so Step 06 can rise beneath Step 04 and Steps 07–08 realign cleanly.
- Preserved the original sequential single-column layout on mobile.
- Added browser geometry assertions to prevent the desktop spacing regression from returning.

## 0.4.0 — 2026-08-17

- Replaced the flat opioid selector with a two-lane visual contrast between lower-dose short-acting use and high-dose or long-acting use.
- Added explicit Moderate Sedation and MAC + Remimazolam visual signals in both the Navigator and Criteria Matrix.
- Preserved exactly four short-acting tablets per day as a separate policy-boundary review state.
- Added routing tests for the moderate-sedation lane and all five heavy-hitter opioid choices.

## 0.3.1 — 2026-08-17

- Restored the complete high-dose and long-acting narcotic MAC criteria in the Criteria Matrix.
- Added the same opioid routing details beside the Navigator medication choices.
- Added browser assertions to prevent these five supplied details from being summarized away again.

## 0.3.0 — 2026-08-16

- Compressed the Navigator into a denser two-column clinical workstation to reduce scrolling.
- Removed the copy-booking-summary control and its unused browser clipboard logic.
- Simplified the Criteria Matrix heading.
- Recolored and retyped the application using the DSA GI Aligned House brand system: Deep Navy, Pillar Blue, Band Blue, DSA Way Blue, Paper, Gut Pink, and the approved geometric sans stack.

## 0.2.0 — 2026-08-16

- Added a dedicated GitHub Pages build-and-deployment workflow.
- Authorized public website and source-repository access after explicit visibility approval.
- Preserved the no-PHI, no-storage, and clinical-decision-support boundaries.

## 0.1.0 — 2026-08-16

- Added the interactive Sedation Routing Rail.
- Added procedure, location, BMI, cardiopulmonary, medication, dialysis, cognitive, OR, and Pleasanton inputs.
- Added transparent precedence logic and explicit ambiguity flags.
- Added criteria matrix and naltrexone medication guide.
- Added copyable booking summaries, print support, responsive layout, and accessibility treatments.
- Added boundary, precedence, oxygen, dialysis, Pleasanton, and OR/POM tests.

## Backlinks

- [[2026-06-16 DSA GI Sedation Driver Workflow]]
- [[Physician DEX]]
