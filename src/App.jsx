import { medicationGuidance, POLICY_VERSION, policySections } from "./criteria.js";

const columnLayout = [
  ["optiflow", "or", "medications"],
  ["mac", "remimazolam"],
  ["mac-pom", "pleasanton"],
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
    <main className="reference-page">
      <header className="reference-heading">
        <div>
          <p className="eyebrow">DSA GI procedural sedation · Revised {POLICY_VERSION}</p>
          <h1>Sedation criteria, at a glance.</h1>
        </div>
        <p>One-page clinical reference. The highest-acuity applicable criterion leads; confirm all decisions against current policy and clinical judgment.</p>
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

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand" aria-label="DSA GI Sedation Criteria">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>DSA GI</strong><small>Sedation Criteria</small></span>
        </div>
        <div className="header-context"><span>Criteria matrix</span><strong>Policy · {POLICY_VERSION}</strong></div>
      </header>

      <CriteriaMatrix />

      <footer>
        <div><strong>DSA GI · Trust Your Gut</strong><span>Sedation Criteria · Revised {POLICY_VERSION}</span></div>
        <p>The DSA Way · Decision support only. Confirm against current policy and clinical judgment.</p>
      </footer>
    </div>
  );
}
