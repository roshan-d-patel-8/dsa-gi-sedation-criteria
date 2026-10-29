---
tags:
  - ClaudeAI
---

Every published What's New change must link to the actual section changed. This is required standard work for this site.

1. Keep history in `content/practice-updates.json`. Each string in `changes` needs a same-index, nonempty array in `targets`. Include every affected destination when one change spans sections. Preserve published text, dates and entry IDs when adding or repairing links.
2. Reuse stable keys from `src/update-links.js`. Add a destination there only when needed, including its visible label, tab, exact selector and any Field Guide section or explicit calendar month. Keys form public `?section=...` URLs: keep existing keys working when content moves.
3. Link to the changed subsection, not just Home or a broad tab. Reveal enclosing foldouts; open the relevant HC note, medication reference or In Basket panel when that contains the changed text. Monthly resources must select their assigned month. Retired historical descriptions should link to the current owning section without rewriting history.
4. `npm test` and `npm run build` reject missing/unknown destinations. Run `tests/update_links_qa.py` with the webapp-testing server helper before release, locally and against the live site. Verify actual links/taps, hidden content, explicit months, direct reload/new-tab URLs, Back/Forward, focus and desktop/mobile layout. Do not waive destination checks for new updates.
5. UI-only releases do not create clinical practice-history entries. Update application version/changelog/README, commit explicit paths, publish, verify remote/workflows/live, and record Construct provenance under the existing workflow.

## Backlinks

- [[dsagi-construct]]
- [[DSA GI House]]
- [[Physician DEX]]
