import { useMemo, useState } from "react";
import { medicationGuidance, POLICY_VERSION, policySections } from "./criteria.js";
import { coverageSites } from "./podlets.js";
import orientationSource from "./orientation-source.html?raw";

const columnLayout = [
  ["optiflow", "or", "medications"],
  ["mac", "remimazolam"],
  ["mac-pom", "pleasanton"],
];

const tabs = [
  { id: "sedation", index: "01", label: "Procedure Sedation Criteria" },
  { id: "coverage", index: "02", label: "DSA GI MA-MD Podlets" },
  { id: "orientation", index: "03", label: "New Physician Orientation Materials" },
];

const orientationSectionNames = [
  "Schedules:",
  "Communication:",
  "Management Staff/PAs:",
  "Helpful Phone Numbers:",
  "Specialized GI Services:",
  "Clinic",
  "Procedures",
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
    const group = doc.createElement("section");
    group.className = `orientation-site-group site-group-${key}`;
    group.innerHTML = `
      <header>
        <span>${details.code}</span>
        <div><h3>${details.name}</h3><small>${sectionShort === "People" ? "Roles, leadership and access" : "Direct lines and operational contacts"}</small></div>
      </header>
    `;
    const list = doc.createElement("ul");
    list.className = "orientation-site-list";
    items.forEach((item) => list.append(item));
    group.append(list);
    groupGrid.append(group);
  });

  sourceList.replaceWith(groupGrid);
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

function MedicationCard() {
  return (
    <article className="criteria-card medication-guide-card" style={{ "--order": 7, "--delay": "270ms" }}>
      <span className="card-index">07</span>
      <p className="card-kicker">POM guidance</p>
      <h2>Medication holds</h2>
      <p className="medication-intro">Naltrexone timing depends on formulation.</p>
      <div className="medication-holds">
        {medicationGuidance.map((item) => (
          <section className="medication-hold" key={item.brand}>
            <div>
              <span>{item.brand}</span>
              <strong>{item.medication}</strong>
            </div>
            <b>{item.instruction}</b>
            <small>{item.risk}</small>
          </section>
        ))}
      </div>
      <p className="suboxone-note"><strong>Buprenorphine/Suboxone:</strong> MAC criterion; no medication-hold instruction was supplied. Obtain individualized guidance.</p>
    </article>
  );
}

function cardFor(id) {
  if (id === "medications") return <MedicationCard key={id} />;
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
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = normalizedQuery
    ? sections.filter((section) => `${section.sourceLabel} ${section.descriptor} ${section.text}`.toLowerCase().includes(normalizedQuery))
    : sections;
  const activeSection = visibleSections.find((section) => section.id === activeSectionId) || visibleSections[0];

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
      <header className="orientation-heading">
        <div>
          <p className="eyebrow">DSA GI ORIENTATION · Physician onboarding · Source material: GI Orientation 2024</p>
          <h1>Your field guide<br />to the first 90 days.</h1>
          <p className="orientation-lede">A searchable, section-by-section reference for schedules, clinical workflows, people and partnership practices.</p>
        </div>
        <div className="orientation-stats" aria-label="Orientation guide summary">
          <span><strong>{sections.length}</strong><small>reference sections</small></span>
          <span><strong>2024</strong><small>source edition</small></span>
          <span><strong>Live</strong><small>search + section tabs</small></span>
        </div>
      </header>

      <aside className="orientation-notice">
        <span aria-hidden="true">INTERNAL</span>
        <p><strong>Operational reference.</strong> This guide reproduces the supplied orientation text. Confirm time-sensitive names, schedules and workflows with current departmental sources.</p>
      </aside>

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
            <header className="orientation-card-header">
              <span className="orientation-number">{String(sections.indexOf(activeSection) + 1).padStart(2, "0")}</span>
              <span><strong>{activeSection.sourceLabel}</strong><small>{activeSection.descriptor}</small></span>
              {activeSection.sensitive && <b>Internal details</b>}
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
          className={`folder-tab ${activeTab === tab.id ? "active" : ""}`}
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
          <span>{tab.index}</span>
          <strong>{tab.label}</strong>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("sedation");
  const isSedation = activeTab === "sedation";
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <div className={`app-shell active-${activeTab}`}>
      <header className="site-header">
        <div className="brand" aria-label="DSA GI Clinical Operations">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>DSA GI</strong><small>Clinical Operations</small></span>
        </div>
        <FolderTabs activeTab={activeTab} onChange={setActiveTab} />
      </header>

      <div className="folder-sheet">
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
