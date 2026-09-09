import { useMemo, useState } from "react";
import { POLICY_VERSION, policySections } from "./criteria.js";
import { coverageSites } from "./podlets.js";
import { birthdayEvents } from "./birthdays.js";
import orientationSource from "./orientation-source.html?raw";

const columnLayout = [
  ["optiflow", "or"],
  ["mac", "remimazolam"],
  ["mac-pom", "pleasanton"],
];

const tabs = [
  { id: "home", label: "Home", icon: true },
  { id: "sedation", index: "01", label: "Procedure Sedation Criteria" },
  { id: "coverage", index: "02", label: "DSA GI MA-MD Podlets" },
  { id: "orientation", index: "03", label: "New Physician Orientation Materials" },
];

const countdowns = [
  { label: "Tom Haddad — last on-site day", date: "2026-09-17", displayDate: "Thu · Sep 17, 2026" },
  { label: "Aysha Aslam — first day", date: "2026-09-28", displayDate: "Mon · Sep 28, 2026" },
  { label: "Dublin — closure / last booking day", date: "2026-10-02", displayDate: "Fri · Oct 2, 2026", tone: "gold" },
  { label: "NorCal in-person TPIP — Oakland", date: "2026-10-17", displayDate: "Sat · Oct 17, 2026" },
  { label: "Pleasanton soft launch — Room 1", date: "2026-10-19", displayDate: "Mon · Oct 19, 2026", tone: "gold" },
  { label: "Pleasanton — Room 2 opens", date: "2026-11-02", displayDate: "Mon · Nov 2, 2026", tone: "gold" },
  { label: "E2K — GI go-live", date: "2026-11-18", displayDate: "Wed · Nov 18, 2026 · confirmed", tone: "way" },
];

const socialEvents = [
  {
    label: "Tom's Farewell Happy Hour",
    date: "2026-09-10",
    displayDate: "Thu · Sep 10, 2026",
    venue: "Barebottle Brewing Co. · Walnut Creek Taproom & Kitchen",
    image: "toms-farewell-happy-hour-2026-09-10.png",
  },
];

function pacificToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
}

function daysUntil(date) {
  const [year, month, day] = date.split("-").map(Number);
  return Math.ceil((Date.UTC(year, month - 1, day) - pacificToday()) / 86_400_000);
}

function HomeIcon() {
  return (
    <svg className="home-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.75 10.5 12 3.75l8.25 6.75v8.25a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-4.5v6h-4.5a1.5 1.5 0 0 1-1.5-1.5V10.5Z" />
    </svg>
  );
}

function BirthdayCupcakeIcon() {
  return (
    <svg className="birthday-cupcake-icon" viewBox="0 0 44 44" aria-hidden="true">
      <path className="birthday-flame" d="M22 2.8c3.1 3.2 3.2 6.1.2 8.6-3.4-2.2-3.5-5.3-.2-8.6Z" />
      <path className="birthday-candle" d="M19.7 10.5h4.7v10.2h-4.7z" />
      <path className="birthday-frosting" d="M10.2 25.1c0-3.2 2.5-5.7 5.6-5.7.7-3 3.3-5.2 6.5-5.2 3.3 0 6.1 2.5 6.6 5.8 2.8.4 4.9 2.8 4.9 5.7 0 1.4-.5 2.7-1.3 3.7H11.7c-.9-1.1-1.5-2.6-1.5-4.3Z" />
      <path className="birthday-wrapper" d="m13.4 28.4 2.3 12.1h13l2.2-12.1H13.4Z" />
      <path className="birthday-wrapper-line" d="m18 29.6.8 9.4m7.2-9.4-.8 9.4" />
      <circle className="birthday-sprinkle sprinkle-one" cx="17.2" cy="23.3" r="1.2" />
      <circle className="birthday-sprinkle sprinkle-two" cx="23" cy="19.7" r="1.2" />
      <circle className="birthday-sprinkle sprinkle-three" cx="28.2" cy="24" r="1.2" />
    </svg>
  );
}

function CocktailIcon() {
  return (
    <svg className="cocktail-icon" viewBox="0 0 44 44" aria-hidden="true">
      <path className="cocktail-glass" d="M7.5 8.2h29L23.8 23.8v10.5h7.1v3.2H13.2v-3.2h7.1V23.8L7.5 8.2Z" />
      <path className="cocktail-drink" d="M12.3 12.2h19.4l-4.4 5.4H16.7l-4.4-5.4Z" />
      <path className="cocktail-straw" d="m27.7 18.1 6.6-11.3" />
      <circle className="cocktail-garnish" cx="32.9" cy="9.1" r="3.8" />
    </svg>
  );
}

const calendarMonths = [8, 9, 10, 11];
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar2026() {
  const [monthPosition, setMonthPosition] = useState(0);
  const monthIndex = calendarMonths[monthPosition];
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(2026, monthIndex, 1)));
  const leadingDays = new Date(Date.UTC(2026, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(2026, monthIndex + 1, 0)).getUTCDate();
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const monthEvents = countdowns.filter(({ date }) => Number(date.slice(5, 7)) - 1 === monthIndex);
  const monthBirthdays = birthdayEvents.filter(({ date }) => Number(date.slice(5, 7)) - 1 === monthIndex);
  const monthSocialEvents = socialEvents.filter(({ date }) => Number(date.slice(5, 7)) - 1 === monthIndex);

  function moveMonth(direction) {
    setMonthPosition((position) => Math.min(calendarMonths.length - 1, Math.max(0, position + direction)));
  }

  function handleCalendarKeyDown(event) {
    if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") moveMonth(-1);
    if (event.key === "ArrowRight") moveMonth(1);
    if (event.key === "Home") setMonthPosition(0);
    if (event.key === "End") setMonthPosition(calendarMonths.length - 1);
  }

  return (
    <section className="year-calendar" aria-labelledby="calendar-title" tabIndex="0" onKeyDown={handleCalendarKeyDown}>
      <h2 id="calendar-title" className="sr-only">2026 calendar</h2>
      <header className="calendar-header">
        <div className="calendar-controls" aria-label="Calendar month controls">
          <button type="button" onClick={() => moveMonth(-1)} disabled={monthPosition === 0} aria-label="Previous month">←</button>
          <strong aria-live="polite">{monthLabel}</strong>
          <button type="button" onClick={() => moveMonth(1)} disabled={monthPosition === calendarMonths.length - 1} aria-label="Next month">→</button>
        </div>
      </header>

      <div className="calendar-grid" role="grid" aria-label={monthLabel}>
        {weekdayLabels.map((weekday) => <span className="calendar-weekday" role="columnheader" key={weekday}>{weekday}</span>)}
        {Array.from({ length: cellCount }, (_, index) => {
          const day = index - leadingDays + 1;
          if (day < 1 || day > daysInMonth) return <span className="calendar-day calendar-day-empty" aria-hidden="true" key={`empty-${index}`} />;
          const date = `2026-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const events = monthEvents.filter((item) => item.date === date);
          const birthdays = monthBirthdays.filter((item) => item.date === date);
          const socials = monthSocialEvents.filter((item) => item.date === date);
          const dayDetails = [
            ...events.map((event) => event.label),
            ...socials.map((event) => event.label),
            ...birthdays.map((birthday) => `${birthday.name} birthday`),
          ];
          return (
            <div className={`calendar-day${events.length ? " has-event" : ""}${socials.length ? " has-social-event" : ""}${birthdays.length ? " has-birthday" : ""}`} role="gridcell" aria-label={`${monthLabel} ${day}${dayDetails.length ? `: ${dayDetails.join(", ")}` : ""}`} key={date}>
              <time dateTime={date}>{day}</time>
              {birthdays.length > 0 && (
                <span className="calendar-birthday-cluster">
                  {birthdays.map((birthday, birthdayIndex) => {
                    const tooltipId = `birthday-${date}-${birthdayIndex}`;
                    return (
                      <span
                        className="birthday-marker"
                        tabIndex="0"
                        aria-label={`Happy Birthday, ${birthday.name}!`}
                        aria-describedby={tooltipId}
                        key={birthday.name}
                      >
                        <BirthdayCupcakeIcon />
                        <span className="birthday-tooltip" id={tooltipId} role="tooltip">
                          <img src={`${import.meta.env.BASE_URL}portraits/${birthday.photo}`} alt="" loading="lazy" />
                          <span>
                            <small>Celebrate a colleague</small>
                            <strong>Happy Birthday, {birthday.name}!</strong>
                          </span>
                        </span>
                      </span>
                    );
                  })}
                </span>
              )}
              {socials.length > 0 && (
                <span className="calendar-social-cluster">
                  {socials.map((event, eventIndex) => {
                    const tooltipId = `social-event-${date}-${eventIndex}`;
                    return (
                      <span
                        className="calendar-social-marker"
                        tabIndex="0"
                        aria-label={`${event.label}, ${event.displayDate}, ${event.venue}`}
                        aria-describedby={tooltipId}
                        key={event.label}
                      >
                        <CocktailIcon />
                        <span className="calendar-social-tooltip" id={tooltipId} role="tooltip">
                          <img src={`${import.meta.env.BASE_URL}${event.image}`} alt="" loading="lazy" />
                          <span>
                            <small>Raise a glass for Tom</small>
                            <strong>{event.label}</strong>
                            <time dateTime={event.date}>{event.displayDate}</time>
                            <em>{event.venue}</em>
                          </span>
                        </span>
                      </span>
                    );
                  })}
                </span>
              )}
              {events.map((event, eventIndex) => {
                const tooltipId = `calendar-event-${date}-${eventIndex}`;
                return (
                  <span
                    className={`calendar-event-marker tone-${event.tone || "blue"}`}
                    tabIndex="0"
                    aria-label={`${event.label}, ${event.displayDate.replace(" · confirmed", "")}`}
                    aria-describedby={tooltipId}
                    key={event.label}
                  >
                    <span className="calendar-event-label">{event.label}</span>
                    <span className="calendar-event-tooltip" id={tooltipId} role="tooltip">
                      <strong>{event.label}</strong>
                      <small>{event.displayDate.replace(" · confirmed", "")}</small>
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main className="home-page" id="home-panel" role="tabpanel" aria-labelledby="home-tab">
      <section className="countdown-section" aria-labelledby="countdown-title">
        <div className="countdown-heading">
          <h1 id="countdown-title">Countdowns!</h1>
          <p>Days remaining update automatically at midnight Pacific.</p>
        </div>
        <div className="countdown-strip">
          {countdowns.map((item, index) => {
            const days = daysUntil(item.date);
            return (
              <article className={`countdown-card tone-${item.tone || "blue"}`} style={{ "--delay": `${index * 55}ms` }} key={item.label}>
                <span className="countdown-sequence">{String(index + 1).padStart(2, "0")}</span>
                <div className="countdown-number">
                  <strong>{Math.max(days, 0)}</strong>
                  <span>{days === 1 ? "day" : "days"}</span>
                </div>
                <h3>{item.label}</h3>
                <time dateTime={item.date}>{item.displayDate}</time>
              </article>
            );
          })}
        </div>
      </section>
      <Calendar2026 />
    </main>
  );
}

const orientationSectionNames = [
  "Schedules:",
  "Communication:",
  "Management Staff/PAs:",
  "Helpful Phone Numbers:",
  "Specialized GI Services:",
  "Clinic",
  "Procedures",
  "Choosing Wisely",
  "E-consult and E2K Orders",
  "Outpatient OR case booking workflow",
  "Procedure Ergonomics",
  "MA-MD Partnership",
];

const orientationSectionMeta = [
  { short: "Schedules", descriptor: "Call, vacation and meetings", tone: "blue" },
  { short: "Communication", descriptor: "Approved channels", tone: "aqua" },
  { short: "People", descriptor: "Management staff and PAs", sensitive: true, tone: "pink" },
  { short: "Contacts", descriptor: "Phone and voicemail directory", sensitive: true, tone: "coral" },
  { short: "Services", descriptor: "Regional capabilities and referrals", tone: "teal" },
  { short: "Clinic", descriptor: "Visits, referrals and follow-up", tone: "blue" },
  { short: "Procedures", descriptor: "Appointment types and documentation", tone: "gold" },
  { short: "Choosing Wisely", descriptor: "CRC surveillance graduation", tone: "sage" },
  { short: "Orders", descriptor: "E-consult and E2K", tone: "aqua" },
  { short: "OR workflow", descriptor: "Outpatient case booking", tone: "coral" },
  { short: "Ergonomics", descriptor: "Early-career evaluation", tone: "teal" },
  { short: "MA-MD", descriptor: "Partnership playbook", tone: "pink" },
];

function sectionId(label) {
  return `orientation-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

const siteGroupDetails = {
  wcr: { code: "WCR", name: "Walnut Creek" },
  drv: { code: "DRV", name: "Deer Valley" },
  dublin: { code: "DUB", name: "Dublin" },
  departmentwide: { code: "DSA", name: "Departmentwide & regional" },
};

const skillsDayVideo = {
  title: "DSA GI Skills Day 2025",
  embedUrl: "https://www.youtube-nocookie.com/embed/WYdP1js9NPk?rel=0",
  watchUrl: "https://youtu.be/WYdP1js9NPk",
};

function createSkillsDayFoldout(doc) {
  const skillsDay = doc.createElement("details");
  skillsDay.className = "orientation-site-group orientation-skills-day";
  skillsDay.innerHTML = `
    <summary>
      <span>PLAY</span>
      <div><h3>Skills Day</h3><small>Watch the team training session</small></div>
      <i aria-hidden="true"></i>
    </summary>
    <div class="skills-day-body">
      <div class="skills-day-video">
        <iframe
          src="${skillsDayVideo.embedUrl}"
          title="${skillsDayVideo.title}"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <div class="skills-day-caption">
        <div><span>Training library</span><strong>${skillsDayVideo.title}</strong></div>
        <a href="${skillsDayVideo.watchUrl}" target="_blank" rel="noreferrer">Open on YouTube</a>
      </div>
    </div>
  `;
  return skillsDay;
}

function emphasizeLeadingLabel(paragraph, doc) {
  const firstContentNode = Array.from(paragraph.childNodes).find((node) => node.textContent.trim());
  if (firstContentNode?.nodeType === Node.ELEMENT_NODE && firstContentNode.matches("strong, b")) return;

  const match = paragraph.textContent.match(/^\s*([^:\n]{1,90}):(?=\s|$)/);
  if (!match) return;

  const range = doc.createRange();
  range.setStart(paragraph, 0);
  let remaining = match[0].length;
  const walker = doc.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
  let textNode = walker.nextNode();

  while (textNode) {
    if (remaining <= textNode.data.length) {
      range.setEnd(textNode, remaining);
      const label = doc.createElement("strong");
      label.className = "orientation-inline-label";
      label.append(range.extractContents());
      range.insertNode(label);
      return;
    }
    remaining -= textNode.data.length;
    textNode = walker.nextNode();
  }
}

function normalizeListItemLines(container, doc) {
  container.querySelectorAll("li > p:first-child").forEach((paragraph) => {
    const line = doc.createElement("span");
    line.className = "orientation-list-line";
    while (paragraph.firstChild) line.append(paragraph.firstChild);
    paragraph.replaceWith(line);
  });
}

function siteBucket(text) {
  const normalized = text.toUpperCase();
  if (normalized.includes("DUBLIN") || /\bDUB\b/.test(normalized)) return "dublin";
  if (normalized.includes("WALNUT CREEK") || /\bWCR\b/.test(normalized)) return "wcr";
  if (normalized.includes("DEER VALLEY") || /\bDRV\b/.test(normalized)) return "drv";
  return "departmentwide";
}

function groupDirectoryBySite(container, doc, sectionShort) {
  if (!["People", "Contacts"].includes(sectionShort)) return;
  const sourceList = Array.from(container.children).find((node) => node.matches("ul"));
  if (!sourceList) return;

  const buckets = new Map();
  Array.from(sourceList.children).forEach((item) => {
    const bucket = siteBucket(item.textContent);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(item);
  });

  const groupGrid = doc.createElement("div");
  groupGrid.className = "orientation-group-grid";
  ["wcr", "drv", "dublin", "departmentwide"].forEach((key) => {
    const items = buckets.get(key);
    if (!items?.length) return;

    const details = siteGroupDetails[key];
    const group = doc.createElement(sectionShort === "People" ? "details" : "section");
    group.className = `orientation-site-group site-group-${key}`;
    const headingTag = sectionShort === "People" ? "summary" : "header";
    group.innerHTML = `
      <${headingTag}>
        <span>${details.code}</span>
        <div><h3>${details.name}</h3><small>${sectionShort === "People" ? "Roles, leadership and access" : "Direct lines and operational contacts"}</small></div>
        ${sectionShort === "People" ? '<i aria-hidden="true"></i>' : ""}
      </${headingTag}>
    `;
    const list = doc.createElement("ul");
    list.className = "orientation-site-list";
    items.forEach((item) => list.append(item));
    group.append(list);
    groupGrid.append(group);
  });

  sourceList.replaceWith(groupGrid);
}

function createProcedureFoldout(doc, { code, title, description, className, nodes }) {
  const foldout = doc.createElement("details");
  foldout.className = `orientation-site-group orientation-procedure-group ${className}`;
  foldout.innerHTML = `
    <summary>
      <span>${code}</span>
      <div><h3>${title}</h3><small>${description}</small></div>
      <i aria-hidden="true"></i>
    </summary>
  `;
  const body = doc.createElement("div");
  body.className = "orientation-procedure-body";
  nodes.forEach((node) => {
    if (node.matches("ol, ul")) node.classList.add("orientation-list-grid");
    if (node.matches("p")) {
      node.classList.add(node.querySelector("em") ? "orientation-callout" : "orientation-prose-block");
    }
    body.append(node);
  });
  foldout.append(body);
  return foldout;
}

function groupProcedures(container, doc, sectionShort) {
  if (sectionShort !== "Procedures") return;
  const nodes = Array.from(container.children);
  const firstListIndex = nodes.findIndex((node) => node.matches("ol, ul"));
  const documentationIndex = nodes.findIndex((node) => node.textContent.trim() === "Procedure documentation");
  if (firstListIndex < 0 || documentationIndex < 0) return;

  const groupGrid = doc.createElement("div");
  groupGrid.className = "orientation-procedure-grid";
  groupGrid.append(
    createProcedureFoldout(doc, {
      code: "TYPE",
      title: "Appointment types",
      description: "Procedure codes and scheduling categories",
      className: "procedure-group-types",
      nodes: nodes.slice(0, firstListIndex + 1),
    }),
    createProcedureFoldout(doc, {
      code: "FLOW",
      title: "Sedation & flex-sig routing",
      description: "Location, preparation and special-case guidance",
      className: "procedure-group-routing",
      nodes: nodes.slice(firstListIndex + 1, documentationIndex),
    }),
    createProcedureFoldout(doc, {
      code: "DOC",
      title: "Procedure documentation",
      description: "Assessment, SmartSets, pathology and follow-up",
      className: "procedure-group-documentation",
      nodes: nodes.slice(documentationIndex + 1),
    }),
    createSkillsDayFoldout(doc),
  );
  container.replaceChildren(groupGrid);
}

function parseOrientationSource(source) {
  const doc = new DOMParser().parseFromString(source, "text/html");
  doc.querySelectorAll("img").forEach((image) => image.closest("p")?.remove());
  const children = Array.from(doc.body.children);
  const headingIndexes = orientationSectionNames.map((name) =>
    children.findIndex((node) => node.textContent.trim() === name),
  );

  return headingIndexes.map((start, index) => {
    const end = headingIndexes[index + 1] ?? children.length;
    const contentNodes = children.slice(start + 1, end).filter((node) => !/^_{8,}$/.test(node.textContent.trim()));
    const container = doc.createElement("div");
    contentNodes.forEach((node) => container.append(node.cloneNode(true)));
    const meta = orientationSectionMeta[index];
    container.querySelectorAll("p").forEach((paragraph) => emphasizeLeadingLabel(paragraph, doc));
    normalizeListItemLines(container, doc);
    groupDirectoryBySite(container, doc, meta.short);
    groupProcedures(container, doc, meta.short);
    Array.from(container.children).forEach((node) => {
      if (node.matches("ol, ul")) node.classList.add("orientation-list-grid");
      if (node.matches("blockquote")) node.classList.add("orientation-callout");
      if (node.matches("p")) {
        const onlyStrong = node.children.length === 1 && node.firstElementChild?.tagName === "STRONG";
        node.classList.add(onlyStrong ? "orientation-subheading" : "orientation-prose-block");
        if (node.querySelector("em")) node.classList.add("orientation-callout");
      }
    });

    return {
      ...meta,
      id: sectionId(meta.short),
      sourceLabel: orientationSectionNames[index].replace(/:$/, ""),
      html: container.innerHTML,
      text: container.textContent.toLowerCase(),
    };
  });
}

function CriteriaItem({ item }) {
  if (typeof item === "string") return <li>{item}</li>;
  return (
    <li>
      {item.text}
      <div className="criteria-contrast">
        {item.contrast.map((lane) => (
          <section className={`criteria-lane criteria-lane-${lane.tone}`} key={lane.label}>
            <p>{lane.label}</p>
            <strong>{lane.title}</strong>
            <ul>{lane.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          </section>
        ))}
      </div>
    </li>
  );
}

function CriteriaCard({ section, index }) {
  return (
    <article
      className={`criteria-card tone-card-${section.tone}`}
      style={{ "--order": index, "--delay": `${(index - 1) * 45}ms` }}
    >
      <span className="card-index">{String(index).padStart(2, "0")}</span>
      <h2>{section.title}</h2>
      <ul>{section.items.map((item) => <CriteriaItem key={typeof item === "string" ? item : item.text} item={item} />)}</ul>
    </article>
  );
}

function cardFor(id) {
  const section = policySections.find((candidate) => candidate.id === id);
  const index = policySections.findIndex((candidate) => candidate.id === id) + 1;
  return <CriteriaCard section={section} index={index} key={id} />;
}

function CriteriaMatrix() {
  return (
    <main className="reference-page" id="sedation-panel" role="tabpanel" aria-labelledby="sedation-tab">
      <header className="reference-heading">
        <div className="reference-meta-row">
          <p className="eyebrow">DSA GI procedural sedation · Revised {POLICY_VERSION}</p>
          <p className="reference-review-date">next review date February 2027</p>
        </div>
        <h1>Sedation criteria, at a glance.</h1>
      </header>

      <div className="criteria-columns">
        {columnLayout.map((column, columnIndex) => (
          <div className="criteria-column" key={columnIndex}>
            {column.map(cardFor)}
          </div>
        ))}
      </div>
    </main>
  );
}

function Avatar({ provider, compact = false }) {
  const initials = provider.initials || provider.name.split(/[\s.-]+/).map((part) => part[0]).join("").slice(0, 2);
  if (!provider.photo) {
    return <span className={`provider-avatar provider-initials ${compact ? "avatar-compact" : ""}`} aria-hidden="true">{initials}</span>;
  }
  return (
    <span className={`provider-avatar ${compact ? "avatar-compact" : ""}`}>
      <img src={`${import.meta.env.BASE_URL}portraits/${provider.photo}`} alt="" loading="lazy" />
    </span>
  );
}

function Provider({ provider }) {
  return (
    <li className={provider.transition ? "provider-row provider-transition" : "provider-row"}>
      <Avatar provider={provider} />
      <span className="provider-identity">
        <strong>{provider.name}</strong>
        {provider.role && <small>{provider.role}</small>}
      </span>
      {provider.tag && <span className="provider-tag">{provider.tag}</span>}
      {provider.transition && (
        <span className="transition-target">
          <span aria-hidden="true">→</span>
          <Avatar provider={provider.transition} compact />
          <span><strong>{provider.transition.name}</strong><small>{provider.transition.tag}</small></span>
        </span>
      )}
    </li>
  );
}

function maCoverageDetails(item, coverageOnly) {
  if (!item) return "";

  return [item.label || (coverageOnly ? "Coverage" : "Assigned days"), item.days, item.note]
    .filter(Boolean)
    .join(" · ");
}

function PodCard({ pod, siteCode }) {
  const maAssignments = [
    ...pod.mas.map((name) => ({
      name,
      coverageOnly: false,
      schedule: pod.schedule.find((item) => item.name === name),
    })),
    ...pod.schedule
      .filter((item) => !pod.mas.includes(item.name))
      .map((item) => ({ name: item.name, coverageOnly: true, schedule: item })),
  ];

  return (
    <article className="pod-card" style={{ "--pod-delay": `${pod.number * 55}ms` }}>
      <header className="pod-header">
        <span>{siteCode}</span>
        <strong>Pod {String(pod.number).padStart(2, "0")}</strong>
      </header>

      <section className="ma-assignment">
        <p>MA responsible</p>
        <div className="ma-roster">
          {maAssignments.map((ma) => {
            const details = maCoverageDetails(ma.schedule, ma.coverageOnly);
            const tooltipId = `${siteCode}-pod-${pod.number}-${ma.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-coverage`;

            return (
              <span
                className={`ma-chip${ma.coverageOnly ? " ma-chip-coverage" : ""}${details ? " has-tooltip" : ""}`}
                tabIndex={details ? 0 : undefined}
                aria-describedby={details ? tooltipId : undefined}
                key={ma.name}
              >
                <strong>{ma.name}</strong>
                {details && <span className="ma-tooltip" role="tooltip" id={tooltipId}>{details}</span>}
              </span>
            );
          })}
        </div>
      </section>

      <section className="provider-panel">
        <div className="pod-section-label"><span>Physician panel</span><b>{pod.providers.length}</b></div>
        <ul>{pod.providers.map((provider) => <Provider provider={provider} key={provider.name} />)}</ul>
      </section>
    </article>
  );
}

function SitePodlets({ site }) {
  return (
    <section className={`site-podlets site-${site.id}`}>
      <header className="site-ribbon">
        <span className="site-code">{site.code}</span>
        <div><h2>{site.name}</h2><p>{site.descriptor}</p></div>
        <strong>{site.pods.length} active pods</strong>
      </header>

      <div className="pod-grid">
        {site.pods.map((pod) => <PodCard pod={pod} siteCode={site.code} key={pod.number} />)}
      </div>

      <aside className="site-support" aria-label={`${site.name} support coverage`}>
        {site.support.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.people.join(" · ")}</strong>
            {item.note && <small>{item.note}</small>}
          </div>
        ))}
      </aside>
    </section>
  );
}

function CoveragePodlets() {
  return (
    <main className="coverage-page" id="coverage-panel" role="tabpanel" aria-labelledby="coverage-tab">
      <header className="coverage-heading">
        <div>
          <p className="eyebrow">DSA GI clinical operations · MA–MD alignment · 2026 assignments</p>
          <h1>DSA GI<br />MA-MD Podlets</h1>
        </div>
        <div className="coverage-key" aria-label="Coverage key">
          <span><i className="key-ma" />MA ownership</span>
          <span><i className="key-md" />Physician panel</span>
          <span><i className="key-new" />New / transition</span>
        </div>
      </header>

      <div className="site-stack">
        {coverageSites.map((site) => <SitePodlets site={site} key={site.id} />)}
      </div>
    </main>
  );
}

function OrientationMaterials() {
  const sections = useMemo(() => parseOrientationSource(orientationSource), []);
  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id);
  const [showChoosingWiselyInfographic, setShowChoosingWiselyInfographic] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = normalizedQuery
    ? sections.filter((section) => `${section.sourceLabel} ${section.descriptor} ${section.text}`.toLowerCase().includes(normalizedQuery))
    : sections;
  const activeSection = visibleSections.find((section) => section.id === activeSectionId) || visibleSections[0];
  const isChoosingWisely = activeSection?.short === "Choosing Wisely";
  const choosingWiselyInfographic = `${import.meta.env.BASE_URL}choosing-wisely-graduation-jan-jul-2026.jpg`;

  function handleSectionKeyDown(event, currentIndex) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + visibleSections.length) % visibleSections.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % visibleSections.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = visibleSections.length - 1;
    const nextSection = visibleSections[nextIndex];
    setActiveSectionId(nextSection.id);
    requestAnimationFrame(() => document.getElementById(`${nextSection.id}-tab`)?.focus());
  }

  return (
    <main className="orientation-page" id="orientation-panel" role="tabpanel" aria-labelledby="orientation-tab">
      <h1 className="sr-only">New Physician Orientation Materials</h1>

      <section className="orientation-tools" aria-label="Orientation guide tools">
        <label className="orientation-search">
          <span>Search the field guide</span>
          <div>
            <i aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try ‘vacation’, ‘Hep C’, ‘QuikAction’…"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">Clear</button>}
          </div>
        </label>

        <nav className="orientation-subtabs" role="tablist" aria-label="Orientation sections">
          {visibleSections.map((section, index) => (
            <button
              className={`orientation-subtab tone-${section.tone}${activeSection?.id === section.id ? " active" : ""}`}
              id={`${section.id}-tab`}
              type="button"
              role="tab"
              aria-selected={activeSection?.id === section.id}
              aria-controls={`${section.id}-panel`}
              tabIndex={activeSection?.id === section.id ? 0 : -1}
              onClick={() => setActiveSectionId(section.id)}
              onKeyDown={(event) => handleSectionKeyDown(event, index)}
              key={section.id}
            >
              <span>{String(sections.indexOf(section) + 1).padStart(2, "0")}</span>
              <strong>{section.short}</strong>
              <small>{section.descriptor}</small>
            </button>
          ))}
        </nav>
      </section>

      <div className="orientation-results" aria-live="polite">
        <span>{normalizedQuery ? `${visibleSections.length} of ${sections.length} section tabs match “${query.trim()}”` : "Choose a section tab to change the field below"}</span>
        {activeSection && <small>Viewing {activeSection.sourceLabel}</small>}
      </div>

      <div className="orientation-sections">
        {activeSection && (
          <section
            className={`orientation-card tone-${activeSection.tone}${activeSection.sensitive ? " orientation-card-sensitive" : ""}`}
            id={`${activeSection.id}-panel`}
            role="tabpanel"
            aria-labelledby={`${activeSection.id}-tab`}
            key={activeSection.id}
          >
            <header className={`orientation-card-header${isChoosingWisely ? " has-infographic" : ""}`}>
              <span className="orientation-number">{String(sections.indexOf(activeSection) + 1).padStart(2, "0")}</span>
              <span><strong>{activeSection.sourceLabel}</strong><small>{activeSection.descriptor}</small></span>
              {activeSection.sensitive && <b>Internal details</b>}
              {isChoosingWisely && (
                <button
                  className="cw-infographic-launch"
                  type="button"
                  aria-haspopup="dialog"
                  aria-label="Expand Choosing Wisely graduation infographic"
                  onClick={() => setShowChoosingWiselyInfographic(true)}
                >
                  <img src={choosingWiselyInfographic} alt="" loading="lazy" />
                  <span aria-hidden="true">Expand</span>
                </button>
              )}
            </header>
            <div className="orientation-content" dangerouslySetInnerHTML={{ __html: activeSection.html }} />
          </section>
        )}
        {visibleSections.length === 0 && (
          <div className="orientation-empty">
            <span aria-hidden="true">0</span>
            <h2>No matching section</h2>
            <p>Try a shorter term or search for a person, service, smartphrase or workflow.</p>
            <button type="button" onClick={() => setQuery("")}>Show the full guide</button>
          </div>
        )}
      </div>

      {showChoosingWiselyInfographic && (
        <div
          className="cw-infographic-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowChoosingWiselyInfographic(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setShowChoosingWiselyInfographic(false);
          }}
        >
          <figure
            className="cw-infographic-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cw-infographic-title"
          >
            <button
              className="cw-infographic-close"
              type="button"
              aria-label="Close Choosing Wisely infographic"
              autoFocus
              onClick={() => setShowChoosingWiselyInfographic(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
            <img
              src={choosingWiselyInfographic}
              alt="Choosing Wisely year-to-date infographic: 203 patients graduated from surveillance colonoscopy from January through July 2026, freeing 40 procedure units."
            />
            <figcaption id="cw-infographic-title">Choosing Wisely · Graduation from Surveillance Colonoscopy · January–July 2026</figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

function FolderTabs({ activeTab, onChange }) {
  function handleKeyDown(event, currentIndex) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    onChange(tabs[nextIndex].id);
    requestAnimationFrame(() => document.getElementById(`${tabs[nextIndex].id}-tab`)?.focus());
  }

  return (
    <nav className="folder-tabs" role="tablist" aria-label="DSA GI reference sections">
      {tabs.map((tab, index) => (
        <button
          className={`folder-tab${tab.icon ? " folder-tab-home" : ""} ${activeTab === tab.id ? "active" : ""}`}
          id={`${tab.id}-tab`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          key={tab.id}
        >
          {tab.icon ? <HomeIcon /> : <span>{tab.index}</span>}
          <strong className={tab.icon ? "sr-only" : undefined}>{tab.label}</strong>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const isSedation = activeTab === "sedation";
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <div className={`app-shell active-${activeTab}`}>
      <header className="site-header">
        <div className="brand" aria-label="DSA GI Resources">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}dsa-gi-logo.png`} alt="DSA GI logo" />
          <span><strong>DSA GI</strong><small>Resources</small></span>
        </div>
        <FolderTabs activeTab={activeTab} onChange={setActiveTab} />
      </header>

      <div className="folder-sheet">
        {activeTab === "home" && <HomePage />}
        {activeTab === "sedation" && <CriteriaMatrix />}
        {activeTab === "coverage" && <CoveragePodlets />}
        {activeTab === "orientation" && <OrientationMaterials />}
      </div>

      <footer>
        <div><strong>DSA GI · Trust Your Gut</strong><span>{isSedation ? `Sedation Criteria · Revised ${POLICY_VERSION}` : activeTabLabel}</span></div>
        <p>The DSA Way · Physician-led, team-owned clinical operations.</p>
      </footer>
    </div>
  );
}
