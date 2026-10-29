---
tags:
  - ClaudeAI
---

# DSA GI Resources

A compact, tabbed DSA GI clinical-operations reference. The primary Calendar tab carries compact Pacific-time countdown tiles, a navigable January–December 2026 milestone calendar, month-specific department meeting resources, a chicklet-style app icon linking to the password-gated DSA GI Conjunctions companion site, and a compact What's New button in the shared header, available from every tab, linking to the chronological practice updates. The calendar opens to the current Pacific-time month. The remaining tabs contain the August 2026 anesthesia procedure criteria, DSA GI MA–MD pod assignments, a searchable New Physician Orientation field guide, and the Phase I Desktop Medicine pharmacy refill agreement. Its Referrals section includes regional routes, DSA GI subspecialists, and a source-labeled Outside KP Referrals reference for transplant coordination.

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

## What's New publication standard

Every change bullet in `content/practice-updates.json` must have a matching nonempty `targets` array, containing stable destination keys from `src/update-links.js`. A bullet affecting multiple sections needs all relevant links. Reuse existing keys; keep their public `?section=...` URLs compatible when content moves. Targets select the owning tab, exact Field Guide subsection or assigned calendar month, reveal enclosing foldouts, focus/highlight the changed section, and open notes/panels containing the actual change. The existing history's copy and dates are retained.

Both `npm test` and `npm run build` enforce this contract. Missing, empty or unknown targets stop publication. Before release run `tests/update_links_qa.py` through the existing webapp-testing server helper, then repeat against the deployed site: all published links, every destination on phones, Back/Forward, direct URLs, reload and native new tabs must work. These requirements also live in this repository's `AGENTS.md` for future maintainers.

## Publication

On 2026-10-29 Roshan made direct links from every What's New item to its changed section standard work and requested retroactive application. All 27 existing entries (40 change bullets) now have 41 section links, including multiple destinations when needed. Clinical copy/dates remain intact. This adds navigation and publication validation, not clinical guidance or a new practice-history entry.

On 2026-10-29 Roshan corrected the Remimazolam presentation: all booking text belongs inside the HC sticky note at the bottom, with the staff-message review/indication sentence as introduction and two numbered actions (MAC request/fallback dates; REMI-first comments/depot rationale). The inline three-step block is removed and the prior one-line note replaced. Six inline clinical bullets, including the sigmoid/pain example, remain. This supersedes earlier descriptions of inline booking steps without changing the underlying workflow.

On 2026-10-29 Roshan refined What's New to a compact button in the top header available from every tab. The shared sticky header now holds the 44px-high link beside the tab strip, replacing the Home-only banner. Existing update history and ?view=change-log links remain compatible. This supersedes the immediately prior Home placement; no clinical history entry or operational fact is added.

On 2026-10-29 Roshan requested renaming Change Log to What's New and moving the link near the top. The existing full-width link now appears first on Home above the countdown/calendar; the view heading and footer use the same name. The ?view=change-log address and complete history remain compatible. This navigation-only update adds no clinician practice-history entry or operational guidance.

On 2026-10-29 Roshan requested appending this exact example to the existing Remimazolam colonoscopy-pain/MAC bullet: “A great example is patients with tightly angulated sigmoid colons and pain sensitivity, best served by monitored anesthesia care.” This is his supplied clinical example; the existing rationale and booking workflow remain in place.

On 2026-10-29 Roshan requested a three-step Remimazolam booking workflow: send him a staff message for case review with the indication; place the case request under MAC and offer MAC dates if the patient does not accept REMI dates; start booking comments with REMI so schedulers can sort the depot and book REMI cases expeditiously. The existing yellow HC sticky-note control now sits at the bottom of the card. Clinical selection criteria are preserved. These are published staff instructions; no patient-specific message or booking is performed.

On 2026-10-29 Roshan authorized publishing the supplied advanced-adenoma infographic in Choosing Wisely and adding Tom’s existing ERBE/Upper EMR deck under Procedures. The PNG is preserved byte-for-byte at 1382×356 with accessible definition text and enlargement; existing Choosing Wisely results remain. The adjacent >10 mm definition is aligned to ≥10 mm to match the supplied image and [USMSTF definition](https://pmc.ncbi.nlm.nih.gov/articles/PMC7393611/). No surveillance interval, age threshold or graduation rule is added or changed. Procedures reuses the July 2026 22-slide resource, existing static WebP frames, slide-1 cover and shared viewer; the calendar placement remains. No new rendering, source PowerPoint/PDF or slide content is published.

On 2026-10-29 Roshan requested a small colored box at the bottom of the ACLS workflow with three supplied external preparation links. These optional study aids open in new tabs and leave the four certification steps unchanged. The National CPR destination is labeled Study guide because the supplied page exposes web study content; a provider-manual PDF was not verified. Other labels describe the supplied practice-test pages. No external material is copied into the public build or endorsed as a substitute for assigned HeartCode course guidance.

On 2026-10-28 Roshan supplied the vendor’s clarification that each provider registers individually, Heart Start CPR assigns the online course, and the vendor can provide online-course progress updates after assignment. The four-step guide now states this sequence and adds status availability as an informational note within the online-course step. No progress tracking, provider-level records, status request, registration or extra completion gate is created.

On 2026-10-28 Roshan supplied a new group enrollment link and vendor context: distribute the link to the group; Heart Start CPR assigns the AHA ACLS HeartCode course as registrations arrive; the department coordinates manikin drop-off; office visits are an alternative in Livermore, San Ramon, Walnut Creek or newly opened Concord. The provided security wrapper was followed read-only to the exact Heart Start enrollment destination (class14815485), which the public guide links directly. This private DSA GI class lists On-Site, so the old mandatory Crow Canyon choice is retired. Roshan explicitly confirmed updating the displayed fee from $280 to $270. The listing date is not treated as a confirmed test appointment because its notes state date/location TBD; existing department time estimates are labeled accordingly. No group/vendor messages, registrations or bookings are performed.

On 2026-10-28 Roshan clarified the Crow Canyon registration address: a company representative will bring the manikin to our sites and the department will block time in each physician’s daily schedule for testing. This explanation appears directly below that address and in the final testing step. It describes the planned arrangement; no actual appointment or schedule block is created, and delivery does not imply an instructor supervises testing. Existing reimbursement, time and ED-leave guidance remains.

On 2026-10-28 Roshan requested the public Remimazolam booking clarification: file the case request under monitored anesthesia care and start booking comments with REMI so schedulers can sort open cases and offer available REMI dates. If the patient is unavailable, MAC may be offered as a backup. This is booking workflow guidance; existing clinical selection criteria are unchanged. The HC note reuses the existing yellow sticky-note interaction.

On 2026-10-28 Roshan supplied the Hours-to-Units Conversion Table and explicitly confirmed publishing 1–2 ED-leave units as department guidance for the online assessment plus manikin test. The table is reproduced as accessible HTML (8h=2.00 units; 4h=1.00; 3h=0.75; 2h=0.50), while the confirmed range is not presented as a derived rounding formula or formal payroll code. The weekend-entry advice remains optional. No payroll action or training appointment is performed, and the screenshot itself is excluded from public assets.

On 2026-10-28 Roshan explicitly confirmed publishing that the $280 ACLS fee is reimbursable under the $5,000 Annual Professional Allowance and supplied the MD People portal plus physician expense-report guide links. The current guide records his confirmed guidance; internal policy pages were not independently accessible and no additional eligibility or payment rules are inferred. His revised time estimates are 2–5 hours online and 30 minutes for the in-person manikin test, replacing the earlier approximately 20-minute estimate.

On 2026-10-28 Roshan requested a clickable Walnut Awards QR and correction of the lunch icon obscuring same-day text. The QR destination was decoded locally from the original poster, preserving its exact Microsoft Forms URL including origin=QRCode; both a positioned QR link and a visible nomination link open it in a new tab. Read-only verification returned HTTP 200 for the Microsoft Forms shell; no form response was submitted or form-field access inferred. The calendar reserves distinct icon/milestone rows.

On 2026-10-28 Roshan supplied the Thanksgiving Networking Lunch invitation and requested its event on the public November calendar. Publish the original poster and transcribed invitation for November 2, 2026, 12:30–1:30 PM, Oaks Conference Rooms, featuring The Walnut Awards and nominations via the poster QR code. No QR destination, nomination deadline, attendee or organizer is inferred. Preserve the original 946×729 composition without cropping and the existing same-day Pleasanton Room 2 milestone.

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
