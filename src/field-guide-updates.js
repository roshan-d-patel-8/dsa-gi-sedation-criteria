const DAY_MS = 86_400_000;

// Published reference updates only. A section stops glowing 30 Pacific dates later.
export function recentFieldGuideUpdates(entries, today) {
  const updates = {};
  for (const entry of entries) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date || "")) continue;
    const timestamp = Date.parse(`${entry.date}T00:00:00Z`);
    if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== entry.date) continue;
    const age = (today - timestamp) / DAY_MS;
    if (age < 0 || age >= 30) continue;
    for (const section of entry.fieldGuideSections || []) {
      if (!updates[section] || entry.date > updates[section]) updates[section] = entry.date;
    }
  }
  return updates;
}

export function fieldGuideUpdateLabel(date) {
  return `Updated ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))}`;
}
