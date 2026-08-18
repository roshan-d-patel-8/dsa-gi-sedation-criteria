import { useState } from "react";
import { medicationGuidance, POLICY_VERSION, policySections } from "./criteria.js";
import { coverageSites } from "./podlets.js";

const columnLayout = [
  ["optiflow", "or", "medications"],
  ["mac", "remimazolam"],
  ["mac-pom", "pleasanton"],
];

const tabs = [
  { id: "sedation", index: "01", label: "Procedure Sedation Criteria" },
  { id: "coverage", index: "02", label: "DSA GI MA-MD Podlets" },
];

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

function PodCard({ pod, siteCode }) {
  return (
    <article className="pod-card" style={{ "--pod-delay": `${pod.number * 55}ms` }}>
      <header className="pod-header">
        <span>{siteCode}</span>
        <strong>Pod {String(pod.number).padStart(2, "0")}</strong>
      </header>

      <section className="ma-assignment">
        <p>MA responsible</p>
        <div className="ma-roster">
          {pod.mas.map((ma) => <strong key={ma}>{ma}</strong>)}
        </div>
        {pod.maNote && <small>{pod.maNote}</small>}
      </section>

      <section className="provider-panel">
        <div className="pod-section-label"><span>Physician panel</span><b>{pod.providers.length}</b></div>
        <ul>{pod.providers.map((provider) => <Provider provider={provider} key={provider.name} />)}</ul>
      </section>

      <section className="pod-schedule">
        <p>Coverage rhythm</p>
        {pod.schedule.map((item) => (
          <div key={`${item.name}-${item.days}`}>
            <span><strong>{item.name}</strong>{item.label && <small>{item.label}</small>}</span>
            <b>{item.days}</b>
            {item.note && <em>{item.note}</em>}
          </div>
        ))}
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

function FolderTabs({ activeTab, onChange }) {
  return (
    <nav className="folder-tabs" role="tablist" aria-label="DSA GI reference sections">
      {tabs.map((tab) => (
        <button
          className={`folder-tab ${activeTab === tab.id ? "active" : ""}`}
          id={`${tab.id}-tab`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
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
        {isSedation ? <CriteriaMatrix /> : <CoveragePodlets />}
      </div>

      <footer>
        <div><strong>DSA GI · Trust Your Gut</strong><span>{isSedation ? `Sedation Criteria · Revised ${POLICY_VERSION}` : "DSA GI MA-MD Podlets"}</span></div>
        <p>The DSA Way · Physician-led, team-owned clinical operations.</p>
      </footer>
    </div>
  );
}
