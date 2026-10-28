---
tags:
  - ClaudeAI
---

# DSA GI Resources

A compact, tabbed DSA GI clinical-operations reference. The primary Calendar tab carries compact Pacific-time countdown tiles, a navigable January–December 2026 milestone calendar, month-specific department meeting resources, a chicklet-style app icon linking to the password-gated DSA GI Conjunctions companion site, and a Change Log link to the chronological practice updates. The calendar opens to the current Pacific-time month. The remaining tabs contain the August 2026 anesthesia procedure criteria, DSA GI MA–MD pod assignments, a searchable New Physician Orientation field guide, and the Phase I Desktop Medicine pharmacy refill agreement. Its Referrals section includes regional routes, DSA GI subspecialists, and a source-labeled Outside KP Referrals reference for transplant coordination.

## Live site

[Open DSA GI Resources](https://roshan-d-patel-8.github.io/dsa-gi-sedation-criteria/)

## Purpose

The site converts dense operational material into scan-friendly references. The Calendar tab surfaces upcoming departmental milestones from the September 8, 2026 Sheikah Slate plus the October 21 TPMG POS and JAMM Survey deadline (updated deadline highlighted with a red dot), hides cards once their days remaining reach zero, and refreshes the Pacific date each minute and when the window regains focus. The survey detail card links to the supplied survey URL. Full milestone copy is available on hover, keyboard focus, and tap; the colored square tiles use locally rendered pixel digits. Completed milestones remain in the calendar. Its calendar rail also scopes announcements and meeting references to the selected month. July 2026 includes a native 22-slide viewer for ERBE Settings and Upper EMR, while September includes the 19-slide Four Habits deck and the 15-slide Immunotherapy-Induced Hepatitis deck from the September 21 Topic Based Discussion; all support click, keyboard, touch, and fullscreen controls without requiring Microsoft PowerPoint. The sedation tab preserves the core criteria, preparation instructions, Pleasanton exclusions, and remimazolam considerations. The coverage tab expands screenshot abbreviations into vault-verified provider names, pairs locally sourced physician portraits with each podlet, and exposes the supplied In Basket Podlet Coverage snapshot through an accessible hover, focus, and tap control. The orientation tab preserves the complete text of the supplied 2026 guide in 12 searchable sub-tabs, displaying one color-coded section at a time. Each section header has a folding-map Expand all / Collapse all control for all nested foldouts; the fully visible Choosing Wisely section keeps the control disabled. The Desktop Medicine tab states the Phase I pharmacy workflow, routing boundaries, provider responsibilities, and the 54 actionable entries in the supplied working medication matrix.

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

The Four Habits companion video uses YouTube’s privacy-enhanced `youtube-nocookie.com` player, loaded lazily without autoplay, plus a direct YouTube watch link. Using the player contacts YouTube; YouTube controls playback and its own data handling. No video file or thumbnail is copied into the public build.

The application is static and has no clinical inputs, backend, database, or analytics. The application itself sets no cookies; embedded playback is handled by YouTube as described above. Physician portraits and presentation slides are optimized local assets; the site does not fetch external profile data. The original PowerPoint file is not included in the public build. The orientation source contains internal operational details, including facility door codes, phone numbers, inbox names, schedules, named staff, and source-labeled referral contacts. Its original two HealthConnect screenshots were not imported because they show patient names. This exclusion does not apply to the separately authorized October 14 pathology-workflow screenshots described below. The DTM interface contains only the authorized operational guidance and medication matrix; its forwarded-email HTML, spreadsheet, Todoist comments, and other source attachments are excluded from the public build.

## Publication

On 2026-10-28 Roshan supplied a Crow Canyon location screenshot and requested a registration substep. Step 1 now instructs choosing Crow Canyon, 3 Crow Canyon Court #205, San Ramon, CA 94583. This is the registration-site selection; the final skills test remains team-arranged at one of our sites. The screenshot itself is excluded from public assets.

On 2026-10-28 Roshan explicitly requested this Construct update to the public site: an October 29 meeting announcement with an ACLS certification workflow. Published copy follows his current recommended/opt-in language and supplied four-step pathway, including the exact registration and readiness-form links plus individual MD People reimbursement instructions. No exact test dates, named coordinator, or reimbursement guarantee are added. The flow is native linked HTML; no source files, slides, or attachments are published. October 14 notes remain dated October 14.

On 2026-10-23 Roshan supplied `GI - Ergonomics_Desktop.pptx` for Field Guide → Ergonomics. The release includes all 18 slides, slide 1 as cover, source fonts, and original evaluation guidance. Animations/transitions and embedded slide hyperlinks are flattened into static frames; the original PPTX, rendering PDF, and speaker notes are excluded. A temporary web-render copy repositions slide 2’s off-canvas question without changing its text, font or images, and freezes the stored July 7, 2026 date to prevent automatic export-date substitution. Your original PowerPoint remains unchanged. Roshan explicitly cleared public release of all slides, including slide 16’s “For internal use only” label, on October 23: “also i clear public release on the slides.” No meeting date, calendar placement, attendance or completed training is inferred.

On 2026-10-23 Roshan requested moving Conjunctions to the top-right header, revealing its label/caption on hover or keyboard focus, and a glow for recently updated Field Guide sections. The link retains its existing destination and opens in a new tab with a 44×44 target. Gold glow, an Updated date and accessible description use explicit `fieldGuideSections` mappings in published practice history: ages 0–29 Pacific calendar days qualify; future dates and day 30 onward do not. Date state refreshes every minute and on window focus. These dates indicate published reference changes, not clinical review or policy effective dates. The v0.48.0 UI release excluded the then-unpublished ergonomics candidate. The explicitly cleared v0.49.0 ergonomics reference uses its October 23 publication date for the same glow.

On 2026-10-23 Roshan explicitly requested adding Omar Al-Shuwaykh’s birthday (October 22) to this public site and a current-day calendar designation. The release reuses Omar’s existing public portrait, preserves the October 22 happy hour, and highlights the current America/Los_Angeles date with a Today label and accessible date state. No birth year or internal source documents are published.

On 2026-10-14 Roshan explicitly requested publication of a dated yellow note on the Desktop Medicine tab. Its Readiness Requirements, Operational Impact and Feedback sections preserve his supplied wording, including the conditional Town Hall recording requirement, Pharmacy Authorization Form / Clinician Protocol Authorization wording, “may notice” expectation, Clinical Medication Request handling “as appropriate”, and exact `DMSpecialtyFeedback@kp.org` mailto link. The source ends “with the following information” without supplying fields; that text is preserved pending clarification, with no invented checklist, recording/form URL, deadline, adoption claim or expansion of the working agreement. October 14 is note provenance.

On 2026-10-14 Roshan requested the quadriplegia OR explanation as an HC sticky note with the exact dated “per some anesthesiologists” and “dysautonomia (HTN)” wording. The transfer criterion and routing remain unchanged. **HC sticky-note convention:** use the shared `CriteriaExplanation` control through a criterion’s `note` object with `icon: "HC"` and `tone: "sticky"`, preserving any supplied date, attribution, and exact text. The same convention applies to the existing dialysis booking/potassium note. Keep detailed context in the sticky rather than the main criterion line; retain hover, keyboard focus and tap access. This layout change receives no separate clinician history entry.

On 2026-10-14 Roshan supplied the January–September 2026 Choosing Wisely banner (281 surveillance-colonoscopy graduations; 56 procedure units freed; five colonoscopies per unit). Its exact original PNG is archived at `ARCHIVES/Choosing Wisely banner January–September 2026.png`; the public WebP preserves its complete composition and 5504×3072 dimensions. The prior January–July asset remains historical. The public image, alternative text, and caption use the new period and supplied metrics; no recalculation or additional utilization claim is made. Source and derivative hashes are in `content/choosing-wisely-banner-2026-09.json`. Roshan also requested more visible October 14 meeting content: all eight main items now have grouped inline highlights and direct links, with full notes retained. That presentation-only adjustment is excluded from the clinician practice history.

On 2026-10-14 Roshan supplied the October 14 Department Meeting Notes for publication in that month’s announcements/meeting section. All supplied paragraphs and both exact links are included, with structured sections and expandable sticky notes for the optional TPIP alternatives and OR consent context. Notes remain scoped to October 2026. Parking is labeled separately from the meeting venue; optional sessions and the two-of-six-hour makeup retain their supplied qualifications.

On 2026-10-14 Roshan requested the primary navigation label “03 Field Guide”. The tab uses the shorter label with its existing number and content-sized width; the document heading and content are preserved. This navigation-only correction is excluded from the clinician practice history.

On 2026-10-14 Roshan requested a new In Basket Podlet Coverage pair: Omar Al-Shuwaykh and Aysha Aslam. Their existing portraits are reused. The reference now contains ten groups and 26 clinicians (23 physicians and three PAs); all earlier groups and main MA-MD assignments remain unchanged. This supersedes the October 7 count below.

On 2026-10-14 Roshan requested that primary navigation words not be cut off. Tabs now retain their full labels, use content-based sizing, and wrap long text when needed within the viewport. The compact “02 Podlets” label is preserved. This formatting correction is excluded from the clinician practice history.

On 2026-10-14 Roshan requested the compact primary navigation label “02 Podlets”. The tab now fits its label without the former long-name minimum widths; the full page heading and clinical content remain unchanged. This presentation-only update is excluded from the clinician-facing practice history.

On 2026-10-14 Roshan assigned Construct to add a public DTM tab with the Phase I pharmacy rollout as its bulletin and the supplied working refill agreement. The release identifies the October 14 go-live, pharmacy workflow, provider responsibilities, explicit out-of-scope medications, and 54 actionable medication entries across five groups. The unresolved `TCA's?` worksheet marker is excluded because the rollout brief explicitly places TCAs outside Phase I; the blank Simethicone refill field remains visibly unspecified. The forwarded email and original spreadsheet remain outside the public build.

On 2026-10-14 Roshan explicitly requested all content from `GI path workflow (DSA).docx` verbatim, better formatted, with its screenshots retained. The complete titled workflow appears under Orientation → MA-MD → Messages & Result Notes. All 37 nonempty paragraphs and all five original PNG screenshots are preserved; only layout whitespace is normalized. The two paired screenshot captions remain attached to their respective images. The full-chart example visibly identifies a “DO NOT USE Test Patient”; the remaining images show workflow menus, a result-note example, or blank-recipient templates. The original DOCX stays outside the public repository and build. `content/gi-path-workflow-source.json` records the source hash, text, image dimensions, and image hashes for fidelity checks. Document metadata identifies Courtney Gonzales and July 2025; those are provenance, not an inferred policy adoption date. Existing orientation instructions are retained, and the new document remains a separately titled source.

On 2026-10-14 Roshan requested an HC sticky-note icon beside the dialysis question mark. This presentation-only follow-up moves the existing booking-comment and STAT potassium sentences into its hover/focus/tap note, preserving the exact clinical instructions.

On 2026-10-14 Roshan invoked Construct to publish scoped sedation-reference clarifications: dysautonomia as an additional quadriplegia OR rationale, bold Antioch-only peritoneal-dialysis routing, a blue question-mark explanation of Walnut Creek’s 3 admit bays and antibiotic administration taking over 60 minutes, and explicit peritoneal-dialysis booking comments for schedulers. The explanation supports hover, keyboard focus, and touch. The dated source addendum preserves the original August policy; no patient information or new source attachments are published.

On 2026-10-12 Roshan clarified that mobile countdowns should appear above the calendar. The narrow-screen order is countdowns, calendar, then announcements/resources; desktop retains the calendar at left and countdowns above announcements at right.

On 2026-10-12 Roshan requested the Calendar navigation icon and a denser calendar page with square, color-coded countdown tiles above the announcements rail. This public interface update preserves all milestone dates, event copy, resource assets, and clinical data; the supplied layout sketch remains outside the public build.

On 2026-10-09 Roshan requested a bottom-of-Home Change Log link and chronological subpage so users can quickly see what changed. The public page is curated in `content/practice-updates.json` for a clinician audience. Include only substantive clinical guidance, workflow or coverage changes, and newly available practice references. Explain what clinicians need to know or do; label added references without implying a new policy, adoption, or effective date. Dates are reference-update dates. Omit formatting, interface behavior, engineering details, QA, deployment notes, and release numbers. A technical-only release must not add a public entry. Keep technical history in `CHANGELOG.md`; `sourceReleases` provides internal provenance for each curated entry. This audience convention was clarified by Roshan on 2026-10-14.

On 2026-10-09 Roshan supplied an October 2026 Suk Seo reference through the private Dispatch project and requested an Outside KP Referrals section on the existing public Services field guide. The release publishes only the task-authorized transplant-coordinator routing, Mayo Clinic Arizona coverage hours, and UCSF clinic contacts. The attached forwarded-email HTML and its confidentiality footer remain excluded; an ambiguous duplicate transfer sentence is omitted in favor of the task's explicit primary-contact wording.

On 2026-10-07 Roshan requested a per-section folding-map Expand all / Collapse all control on the existing public orientation guide. This release adds the control and preserves all existing orientation copy and source exclusions.

On 2026-10-07 Roshan requested a denser In Basket coverage window. The compact layout preserves all memberships and full names while fitting the complete reference in the tested desktop and phone viewports.

On 2026-10-07 Roshan requested removal of transferred Tom Haddad from current coverage. The In Basket reference now contains 24 clinicians across nine groups; the main Podlets roster retains Aysha Aslam as the standalone provider in the existing row. Historical source material and events are retained.

On 2026-10-07 Roshan requested the Medication holds (DOAC/Diabetes meds) reference on the existing public sedation page. Its grouped intervals and skipped-dose counts are transcribed from the two supplied DSA GI dropdown screenshots; cropped follow-up sentences are excluded. The screenshots themselves are not published. This is a source-provided reference, not an independently revised clinical policy.

On 2026-10-07 Roshan clarified that each original In Basket coverage column is its own group. The public reference now displays nine independent groups without numbering, preserving all names, portraits, and per-column order. This clarification supersedes the original five-block grouping interpretation.

The Podlet Coverage dismissal correction was requested on 2026-10-07 for the existing public control. It changes only focus restoration and dismissal behavior; no new operational content or source assets are published.

The user supplied Omar and Aysha’s welcome artwork and explicitly requested their first clinical days on the public calendar on 2026-10-04: August 31, 2026, and October 5, 2026, respectively. Gold star markers open their welcome cards.

The source repository and GitHub Pages website are public by explicit authorization on 2026-08-16. The DSA GI MA-MD Podlets roster, workday details, assignments, and physician portraits were separately authorized for public deployment on 2026-08-17.

The complete orientation text—including facility door codes, internal contact details, inbox names, schedules, and operational workflows—was explicitly authorized for public deployment on 2026-08-26. The two HealthConnect screenshots remain excluded because they display patient names.

The remaining six Sheikah Slate countdown labels and dates were explicitly requested for this public site on 2026-09-09. Tom Haddad's completed last-on-site milestone was removed on request on 2026-09-26.

The 2026 TPMG POS and JAMM Survey countdown and its October 16, 2026 deadline were supplied through the private Dispatch assignment and explicitly requested for public display on 2026-10-06. Roshan explicitly authorized the public deadline correction to October 21, 2026 and red-dot emphasis on 2026-10-16. The public countdown links to the survey URL in the original sender email; the forwarded email files and their internal instructions are excluded from the site.

The Four Habits slide deck was confirmed clear for public presentation and explicitly authorized for deployment as September 2026 department meeting resources on 2026-09-11. Its 19 slides are published as fully revealed final frames; PowerPoint animations are intentionally flattened for dependable in-browser viewing.

On 2026-10-19 Roshan explicitly authorized public embedding and deployment of the unlisted video “The Four Habits (featuring Habit Zero!)” (`8v02PAIYWyw`, 3:39). It is a permanent Field Guide → Clinic reference and a companion beside the September 2026 Four Habits deck. September is the placement of the existing deck, not the video’s October 9 upload date or a new teaching event. The video plays through YouTube; the existing 19-slide deck and its flattened animations are unchanged, and original source files remain excluded. Publication does not establish training completion or adoption.

The Immunotherapy-Induced Hepatitis slide deck was supplied through the private Dispatch assignment and explicitly requested for this public reference site on 2026-09-24. Its September 21, 2026 Topic Based Discussion date is shown on the resource card. The 15 slides are published only as static frames; speaker notes, their external hyperlink, the forwarded email, the original PowerPoint, and the temporary PDF are excluded from the public build.

The ERBE Settings and Upper EMR slide deck was explicitly requested for deployment as July 2026 department meeting resources on 2026-09-11. Its 22 slides are published only as static frames; four embedded videos, eight external hyperlinks, timing behavior, and the original PowerPoint and temporary PDF files are excluded from the public build.

Erina Foster's October 17 birthday was supplied by the user and explicitly requested for public calendar display on 2026-09-11.

Anish Patel's birthday was corrected to October 17 for the existing public calendar at Roshan's explicit request on 2026-10-18. Erina Foster's birthday remains on the same date.

The October 22, 2026 DSA GI Monthly Happy Hour details and accompanying infographic were supplied through the private Dispatch assignment and explicitly requested for public department-calendar display on 2026-09-30.

The January–August 2026 calendar expansion and its vault-recorded DSA GI physician birthdays were explicitly requested for public display on 2026-09-11.

## Backlinks

- [[2026-06-16 DSA GI Sedation Driver Workflow]]
- [[Physician DEX]]
- [[DSAGI House]]
- [[Sheikah Slate]]
