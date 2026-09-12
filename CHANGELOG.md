---
tags:
  - ClaudeAI
---

# Changelog

## 0.29.0 — 2026-09-11

- Added a month-aware Department meeting resources library beside the calendar, with The Four Habits assigned only to September 2026.
- Added a native 19-slide viewer with click, keyboard, and touch navigation; progress feedback; an accessible modal; and browser fullscreen with an in-page fallback.
- Rendered the PowerPoint-native final slide frames at 2560×1440 with embedded Selawik and Source Sans Pro fonts; the original PowerPoint file is not published, and build/browser coverage now checks image fidelity, month isolation, desktop/mobile behavior, focus return, and fullscreen.

## 0.28.1 — 2026-09-09

- Restored Choosing Wisely to its original fully open campaign layout, removing the eight accordion wrappers introduced in version 0.26.0.
- Preserved the complete Choosing Wisely content, bold Smartphrases, expandable infographic, and new search highlighting.
- Kept nested accordions unchanged across the other eleven Field Guide sections.

## 0.28.0 — 2026-09-09

- Added visible, case-insensitive highlighting for every literal Field Guide search match in the active section, section tab, and section heading.
- Automatically opens only the nested accordion branches containing a matching term and brings the first hit into view so filtered results are immediately readable.
- Clearing the search removes all highlights and restores the Field Guide's normal collapsed accordion state.

## 0.27.0 — 2026-09-09

- Added a persistent Zoom control in the upper-right of the global header, available from every primary page.
- Added 90%, 100%, 110%, 125%, and 140% levels with zoom-in, zoom-out, reset, keyboard dismissal, and saved preference support.
- Kept the control itself fixed-size and outside the zoomed content surface so the page reflows without introducing horizontal scrolling on desktop or mobile.

## 0.26.0 — 2026-09-09

- Extended the nested accordion system to every Field Guide tab while preserving all source content and existing interactive tools.
- Added topic-specific folds for Schedules, Contacts, Services, Clinic, Orders, OR workflow, Ergonomics, MA-MD Partnership, and Choosing Wisely; existing Communication, People, and Procedures folds remain intact.
- Added full-guide regression coverage for collapsed defaults, keyboard expansion, source-text preservation, and mobile accordion layout.

## 0.25.0 — 2026-09-09

- Reorganized every item in Communication into three collapsed nested accordions: Email Directory, Secure Channels, and Pool Party.
- Consolidated every email address found across the Field Guide into Email Directory, including the centralized physician schedule and time-off request mailbox.
- Added one-click clipboard controls for both email addresses and responsive stacked rows that keep those controls visible on mobile.

## 0.24.0 — 2026-09-09

- Added a nested Pool Party accordion beneath Communication with all nine normalized Health Connect pool addresses and their Field Guide uses.
- Added an individual clipboard button and visible confirmation state for every pool, plus the source warning that the three infusion RN destinations are reference-only.
- Added desktop and mobile browser coverage for accordion behavior, table completeness, exact copy output, and responsive access to every row.

## 0.23.1 — 2026-09-09

- Fixed Tom's September 10 farewell hover card being clipped at the calendar's top boundary after the announcements-rail layout change.
- Preserved the rounded calendar shell while allowing image-rich calendar overlays to extend beyond it, with a focused browser regression check.

## 0.23.0 — 2026-09-09

- Added the video’s nine published chapter markers beside the embedded Skills Day player, from Variceal banding through Trapezoid basket.
- Made every timestamp a direct YouTube hyperlink while keeping ordinary clicks in the Field Guide by jumping the embedded player to the selected chapter.
- Added visible current-chapter feedback and desktop/mobile browser coverage for chapter text, source timestamps, links, layout, and in-place playback.

## 0.22.0 — 2026-09-09

- Added a month-aware Announcements rail to the right of the desktop calendar with a stacked responsive layout on smaller screens.
- Added September reminders for the September 14 Desktop Medicine pharmacy authorization deadline and the November 5, 6–8 PM NCAL GI TPIP makeup.
- Added browser coverage for announcement content, dates, month navigation, responsive positioning, and the empty state in later months.

## 0.21.0 — 2026-09-09

- Moved Skills Day from People to Procedures while preserving the privacy-enhanced YouTube embed and direct video link.
- Converted Procedures into four nested keyboard-accessible foldouts for appointment types, sedation and flex-sig routing, documentation, and Skills Day.
- Added desktop and mobile browser coverage for the new location, collapsed defaults, arrow controls, retained procedure content, and video behavior.

## 0.20.1 — 2026-09-09

- Removed the standalone Medication holds card from the Procedure Sedation Criteria tab.
- Rebalanced the reference layout to six cards and added browser coverage confirming that the removed card and POM guidance label no longer render.

## 0.20.0 — 2026-09-09

- Added a dedicated cocktail marker to September 10 for Tom's Farewell Happy Hour without adding the social event to the countdown strip.
- Added an image-rich hover, keyboard-focus, and tap card using the supplied farewell artwork, date, Barebottle Brewing Co., and Walnut Creek Taproom & Kitchen details.
- Added desktop/mobile browser checks for the calendar date, cocktail marker, full event text, source-artwork dimensions, and responsive tooltip behavior.

## 0.19.0 — 2026-09-09

- Added the January–July 2026 Choosing Wisely graduation infographic as a proportional thumbnail in the Choosing Wisely panel header.
- Added an accessible full-size lightbox with mouse, keyboard, Escape, close-button, and backdrop interactions.
- Added desktop/mobile browser checks for source-image fidelity, responsive thumbnail sizing, expanded image display, and close behavior.

## 0.18.2 — 2026-09-09

- Replaced Natalie with Martha in the Walnut Creek Pod 03 MA roster.
- Added browser coverage confirming Martha appears in the intended podlet and Natalie no longer appears anywhere in the MA-MD Podlets view.

## 0.18.1 — 2026-09-09

- Added Roshan Patel's November 21 birthday to the Home calendar using his existing portrait and the cupcake hover/focus interaction.
- Kept the ten colleague birthdays vault-verified while explicitly recording Roshan's date as user-supplied.
- Updated November browser coverage to require all four birthday markers and Roshan's birthday label.

## 0.18.0 — 2026-09-09

- Converted the People section's Walnut Creek, Deer Valley, and departmentwide groups into nested native foldouts with visible arrow controls and keyboard support.
- Added a full-width Skills Day foldout with a responsive, privacy-enhanced embed of “DSA GI Skills Day 2025” and a direct YouTube link.
- Added desktop and mobile browser checks for accordion behavior, retained directory content, embed metadata, and responsive width.

## 0.17.1 — 2026-09-09

- Added door code 7343 for the additional DRV office space to the Field Guide's People section.
- Added a browser regression check for the complete Deer Valley door-code line.

## 0.17.0 — 2026-09-09

- Added cupcake-and-candle birthday markers to the September–December Home calendar for 10 DSA Gastroenterology colleagues identified from their vault contact cards.
- Added portrait birthday cards reading “Happy Birthday, Name!” on hover, keyboard focus, or tap.
- Preserved operational milestones on dates that also contain birthdays, including September 28.
- Added source-integrity tests that verify every birthday against the colleague's Markdown card, DSA Gastroenterology role, and matched portrait.
- Added desktop/mobile browser checks for birthday counts, portraits, accessible interactions, and the celebratory calendar treatment.

## 0.16.0 — 2026-09-09

- Added a dedicated Choosing Wisely Field Guide section immediately after Procedures.
- Preserved all non-checkboxed content from the four-page GI Choosing Wisely TPIP consensus presentation, including age-based recommendations, risk/benefit scripting, patient-facing copy, procedural-note language, and the PROMPT outreach letter.
- Elevated `DSAGIGRADNOTE`, `DSAGIGRADLETTER`, `DSAGIGRADMA`, and `DSAGIGRADDC` in a prominent SmartPhrase panel.
- Omitted the presentation's four checkbox-status lines as requested.
- Added responsive decision cards and browser checks for source completeness, SmartPhrase emphasis, omission rules, the UCSF ePrognosis link, section count, and mobile layout.

## 0.15.0 — 2026-09-09

- Removed the redundant “Rest of 2026” title, date-range label, and duplicate monthly milestone sidebar.
- Centered one prominent month label immediately above a full-width calendar grid.
- Increased the month, weekday, date, and event typography for faster scanning.
- Kept event names readable in desktop cells and added large hover, keyboard-focus, and tap details for constrained screens.
- Expanded browser QA to enforce the simplified labels, month-specific event counts, minimum font sizes, and desktop/mobile tooltip behavior.

## 0.14.2 — 2026-09-09

- Corrected Tom Haddad's last on-site day from Friday, September 18 to Thursday, September 17, 2026.
- Moved the corresponding Home countdown and September calendar marker to the corrected date.
- Added browser checks confirming the milestone appears on September 17 and no longer appears on September 18.

## 0.14.1 — 2026-09-09

- Removed the complete orientation hero/banner area, including the oversized field-guide heading, description, and operational-reference strip.
- Kept an accessible screen-reader-only page title while moving the search and section tabs to the top of the orientation view.
- Increased orientation subtab title text to 14px, descriptors to 10px, and section numbers to 10.5px.
- Increased subtab height and mobile width so larger labels wrap cleanly without truncation.
- Added browser regression checks for banner removal and minimum subtab typography sizes.

## 0.14.0 — 2026-09-09

- Removed the Sheikah Slate attribution from the public Home page.
- Added a navigable September–December 2026 calendar beneath the countdown strip.
- Marked countdown milestones on their calendar dates and added a month-specific milestone summary.
- Added Previous/Next controls, disabled September/December boundaries, keyboard navigation, accessible month grids, and responsive mobile treatment.
- Expanded browser QA to traverse all four remaining months and verify event counts, calendar boundaries, and the absence of the removed attribution.

## 0.13.1 — 2026-09-09

- Removed the oversized Home-page hero, descriptive lede, and separate source card.
- Replaced “What is approaching.” with the compact header “Countdowns!” and an inline “Sheikah Slate · As of Sep 8, 2026” reference.
- Moved the countdown cards directly beneath the site tabs to prioritize operational information above decorative copy.

## 0.13.0 — 2026-09-09

- Added a new primary Home tab with a blue house icon and made it the default landing view.
- Added a seven-card countdown strip sourced from the Sheikah Slate's September 8 countdown section.
- Made countdown values update automatically against the current Pacific date while preserving the Slate's labels, dates, priority colors, and confirmed E2K status.
- Added desktop and mobile browser checks for the Home tab, countdown content, tab state, and small-screen horizontal scrolling.
- Brought the existing podlet portrait regression count in line with Omar Al-Shuwaykh's previously added portrait.

## 0.12.4 — 2026-08-29

- Added a "best viewed on desktop rather than mobile" note to the KPATHS facility-directory link.

## 0.12.3 — 2026-08-29

- Expanded the KPATHS facility-directory access note: reachable from a KP device on site or via GlobalProtect offsite.

## 0.12.2 — 2026-08-29

- Updated the orientation tab eyebrow's source-material year from "GI Orientation 2024" to "GI Orientation 2026".

## 0.12.1 — 2026-08-29

- Added the KPATHS Facility Information directory link in parentheses directly under the "Helpful Phone Numbers" heading in orientation Section 4 (Contacts), noted as accessible only from a KP device.

## 0.12.0 — 2026-08-29

- Replaced the top-left brand mark (the three-bar CSS glyph) with the official DSA GI "Trust Your Gut" logo, served as `public/dsa-gi-logo.png` (180×180, downscaled from the Propaganda master). The mark keeps its 36px rounded frame and −2° tilt, with a subtle navy ring instead of the solid navy background.

## 0.11.1 — 2026-08-29

- Removed the orientation header stat strip (reference-section count / source edition / live search) and its styles; the heading column now spans full width.

## 0.11.0 — 2026-08-29

- Renamed the site from "DSA GI Sedation Criteria" to "DSA GI Resources" — browser-tab title, header brand ("DSA GI · Resources"), meta description, and README. The name now reflects all three tabs rather than the sedation tab alone. The repository slug and public URL are unchanged so existing links keep working.

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
