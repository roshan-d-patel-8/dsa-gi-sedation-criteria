---
tags:
  - ClaudeAI
---

# DSA GI Resources

A compact, tabbed DSA GI clinical-operations reference. The first tab contains the August 2026 anesthesia procedure criteria; the second maps DSA GI MA–MD pod assignments; the third is a searchable, sub-tabbed New Physician Orientation field guide.

## Live site

[Open DSA GI Resources](https://roshan-d-patel-8.github.io/dsa-gi-sedation-criteria/)

## Purpose

The site converts dense operational material into scan-friendly references. The sedation tab preserves every criterion, preparation instruction, Pleasanton exclusion, remimazolam consideration, and POM medication hold. The coverage tab expands screenshot abbreviations into vault-verified provider names and pairs locally sourced physician portraits with each podlet. The orientation tab preserves the complete text of the supplied 2024 guide in 11 searchable sub-tabs, displaying one color-coded section at a time.

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

The application is static and has no clinical inputs, backend, database, analytics, cookies, or persistent storage. Physician portraits are optimized local assets; the site does not fetch external profile data. The orientation source contains internal operational details, including facility door codes, phone numbers, inbox names, schedules, and named staff. Its two HealthConnect screenshots were not imported because they show patient names.

## Publication

The source repository and GitHub Pages website are public by explicit authorization on 2026-08-16. The DSA GI MA-MD Podlets roster, workday details, assignments, and physician portraits were separately authorized for public deployment on 2026-08-17.

The complete orientation text—including facility door codes, internal contact details, inbox names, schedules, and operational workflows—was explicitly authorized for public deployment on 2026-08-26. The two HealthConnect screenshots remain excluded because they display patient names.

## Backlinks

- [[2026-06-16 DSA GI Sedation Driver Workflow]]
- [[Physician DEX]]
- [[DSAGI House]]
