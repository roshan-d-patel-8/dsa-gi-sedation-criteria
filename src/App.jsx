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
  { short: "Schedules", descriptor: "Call, vacation and meetings" },
  { short: "Communication", descriptor: "Approved channels" },
  { short: "People", descriptor: "Management staff and PAs", sensitive: true },
  { short: "Contacts", descriptor: "Phone and voicemail directory", sensitive: true },
  { short: "Services", descriptor: "Regional capabilities and referrals" },
  { short: "Clinic", descriptor: "Visits, referrals and follow-up" },
  { short: "Procedures", descriptor: "Appointment types and documentation" },
  { short: "Orders", descriptor: "E-consult and E2K" },
  { short: "OR workflow", descriptor: "Outpatient case booking" },
  { short: "Ergonomics", descriptor: "Early-career evaluation" },
  { short: "MA-MD", descriptor: "Partnership playbook" },
];

function sectionId(label) {
  return `orientation-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
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
        <div>
          <p className="eyebrow">DSA GI procedural sedation · Revised {POLICY_VERSION}</p>
          <h1>Sedation criteria, at a glance.</h1>
        </div>
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
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = normalizedQuery
    ? sections.filter((section) => `${section.sourceLabel} ${section.descriptor} ${section.text}`.toLowerCase().includes(normalizedQuery))
    : sections;

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <span><strong>Live</strong><small>search + quick jumps</small></span>
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

        <nav className="orientation-jumps" aria-label="Jump to orientation section">
          {sections.map((section, index) => (
            <button type="button" onClick={() => jumpTo(section.id)} key={section.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>{section.short}
            </button>
          ))}
        </nav>
      </section>

      <div className="orientation-results" aria-live="polite">
        <span>{normalizedQuery ? `${visibleSections.length} of ${sections.length} sections match “${query.trim()}”` : "All orientation sections"}</span>
        <small>Open any section to focus the guide.</small>
      </div>

      <div className="orientation-sections">
        {visibleSections.map((section, index) => (
          <details className={`orientation-card${section.sensitive ? " orientation-card-sensitive" : ""}`} id={section.id} open key={section.id}>
            <summary>
              <span className="orientation-number">{String(sections.indexOf(section) + 1).padStart(2, "0")}</span>
              <span><strong>{section.sourceLabel}</strong><small>{section.descriptor}</small></span>
              {section.sensitive && <b>Internal details</b>}
              <i aria-hidden="true" />
            </summary>
            <div className="orientation-content" dangerouslySetInnerHTML={{ __html: section.html }} />
          </details>
        ))}
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
