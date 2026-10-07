---
tags:
  - ClaudeAI
---

# DSA GI Resources

A compact, tabbed DSA GI clinical-operations reference. The primary Home tab carries a Pacific-time countdown strip, a navigable January–December 2026 milestone calendar, and month-specific department meeting resources. The calendar opens to the current Pacific-time month. The remaining tabs contain the August 2026 anesthesia procedure criteria, DSA GI MA–MD pod assignments, and a searchable New Physician Orientation field guide.

## Live site

[Open DSA GI Resources](https://roshan-d-patel-8.github.io/dsa-gi-sedation-criteria/)

## Purpose

The site converts dense operational material into scan-friendly references. The Home tab surfaces upcoming departmental milestones from the September 8, 2026 Sheikah Slate plus the October 16 TPMG POS and JAMM Survey deadline, hides cards once their days remaining reach zero, and refreshes the Pacific date each minute and when the window regains focus. The survey countdown links directly to the supplied survey URL. Completed milestones remain in the calendar. Its calendar rail also scopes announcements and meeting references to the selected month. July 2026 includes a native 22-slide viewer for ERBE Settings and Upper EMR, while September includes the 19-slide Four Habits deck and the 15-slide Immunotherapy-Induced Hepatitis deck from the September 21 Topic Based Discussion; all support click, keyboard, touch, and fullscreen controls without requiring Microsoft PowerPoint. The sedation tab preserves the core criteria, preparation instructions, Pleasanton exclusions, and remimazolam considerations. The coverage tab expands screenshot abbreviations into vault-verified provider names, pairs locally sourced physician portraits with each podlet, and exposes the supplied In Basket Podlet Coverage snapshot through an accessible hover, focus, and tap control. The orientation tab preserves the complete text of the supplied 2026 guide in 12 searchable sub-tabs, displaying one color-coded section at a time.

It does not clear patients, replace clinician judgment, or independently validate the clinical policy.

## Local development

```sh
npm install
npm run dev
```

## Validation

```sh
npm test
npm run build
```

## Privacy

The application is static and has no clinical inputs, backend, database, analytics, cookies, or persistent storage. Physician portraits and presentation slides are optimized local assets; the site does not fetch external profile data. The original PowerPoint file is not included in the public build. The orientation source contains internal operational details, including facility door codes, phone numbers, inbox names, schedules, and named staff. Its two HealthConnect screenshots were not imported because they show patient names.

## Publication

On 2026-10-07 Roshan requested a denser In Basket coverage window. The compact layout preserves all memberships and full names while fitting the complete reference in the tested desktop and phone viewports.

On 2026-10-07 Roshan requested removal of transferred Tom Haddad from current coverage. The In Basket reference now contains 24 clinicians across nine groups; the main Podlets roster retains Aysha Aslam as the standalone provider in the existing row. Historical source material and events are retained.

On 2026-10-07 Roshan requested the Medication holds (DOAC/Diabetes meds) reference on the existing public sedation page. Its grouped intervals and skipped-dose counts are transcribed from the two supplied DSA GI dropdown screenshots; cropped follow-up sentences are excluded. The screenshots themselves are not published. This is a source-provided reference, not an independently revised clinical policy.

On 2026-10-07 Roshan clarified that each original In Basket coverage column is its own group. The public reference now displays nine independent groups without numbering, preserving all names, portraits, and per-column order. This clarification supersedes the original five-block grouping interpretation.

The Podlet Coverage dismissal correction was requested on 2026-10-07 for the existing public control. It changes only focus restoration and dismissal behavior; no new operational content or source assets are published.

The user supplied Omar and Aysha’s welcome artwork and explicitly requested their first clinical days on the public calendar on 2026-10-04: August 31, 2026, and October 5, 2026, respectively. Gold star markers open their welcome cards.

The source repository and GitHub Pages website are public by explicit authorization on 2026-08-16. The DSA GI MA-MD Podlets roster, workday details, assignments, and physician portraits were separately authorized for public deployment on 2026-08-17.

The complete orientation text—including facility door codes, internal contact details, inbox names, schedules, and operational workflows—was explicitly authorized for public deployment on 2026-08-26. The two HealthConnect screenshots remain excluded because they display patient names.

The remaining six Sheikah Slate countdown labels and dates were explicitly requested for this public site on 2026-09-09. Tom Haddad's completed last-on-site milestone was removed on request on 2026-09-26.

The 2026 TPMG POS and JAMM Survey countdown and its October 16, 2026 deadline were supplied through the private Dispatch assignment and explicitly requested for public display on 2026-10-06. The public countdown links to the survey URL in the original sender email; the forwarded email files and their internal instructions are excluded from the site.

The Four Habits slide deck was confirmed clear for public presentation and explicitly authorized for deployment as September 2026 department meeting resources on 2026-09-11. Its 19 slides are published as fully revealed final frames; PowerPoint animations are intentionally flattened for dependable in-browser viewing.

The Immunotherapy-Induced Hepatitis slide deck was supplied through the private Dispatch assignment and explicitly requested for this public reference site on 2026-09-24. Its September 21, 2026 Topic Based Discussion date is shown on the resource card. The 15 slides are published only as static frames; speaker notes, their external hyperlink, the forwarded email, the original PowerPoint, and the temporary PDF are excluded from the public build.

The ERBE Settings and Upper EMR slide deck was explicitly requested for deployment as July 2026 department meeting resources on 2026-09-11. Its 22 slides are published only as static frames; four embedded videos, eight external hyperlinks, timing behavior, and the original PowerPoint and temporary PDF files are excluded from the public build.

Erina Foster's October 17 birthday was supplied by the user and explicitly requested for public calendar display on 2026-09-11.

The October 22, 2026 DSA GI Monthly Happy Hour details and accompanying infographic were supplied through the private Dispatch assignment and explicitly requested for public department-calendar display on 2026-09-30.

The January–August 2026 calendar expansion and its vault-recorded DSA GI physician birthdays were explicitly requested for public display on 2026-09-11.

## Backlinks

- [[2026-06-16 DSA GI Sedation Driver Workflow]]
- [[Physician DEX]]
- [[DSAGI House]]
- [[Sheikah Slate]]
