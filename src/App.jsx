import { useMemo, useState } from "react";
import {
  initialState,
  medicationGuidance,
  POLICY_VERSION,
  policySections,
  procedureOptions,
} from "./criteria.js";
import { evaluateCriteria } from "./engine.js";

const rail = [
  { id: "none", short: "Base", label: "No listed escalation" },
  { id: "optiflow", short: "O₂", label: "Optiflow" },
  { id: "mac", short: "M", label: "MAC" },
  { id: "macPom", short: "P", label: "MAC + POM" },
  { id: "or", short: "OR", label: "Operating room" },
];

const clinicalGroups = [
  {
    eyebrow: "Respiratory",
    title: "Airway & pulmonary",
    items: [
      ["severeOsa", "Severe OSA", "CPAP/BiPAP dependent"],
      ["chronicLung", "Symptomatic chronic lung disease", "Active respiratory symptoms"],
      ["severePulmonaryHypertension", "Severe pulmonary hypertension", "As documented clinically"],
    ],
  },
  {
    eyebrow: "Cardiac",
    title: "Heart & circulation",
    items: [
      ["valvular", "Symptomatic valvular disease", "Current symptoms"],
      ["stableAngina", "CAD with active stable angina", "Active but stable symptoms"],
      ["reversibleCad", "Reversible CAD or unstable angina", "Pleasanton exclusion criterion"],
      ["activeChfFlare", "Active or poorly controlled CHF", "Recent/frequent exacerbation"],
    ],
  },
  {
    eyebrow: "Sedation history",
    title: "Tolerance & lived experience",
    items: [
      ["excessivePainAnxiety", "Excessive pain or anxiety", "Anticipated sedation difficulty"],
      ["priorIntolerance", "Prior failed/intolerant moderate sedation", "Previous procedure history"],
      ["colonoscopyPain", "Significant colonoscopy pain with moderate sedation", "Remimazolam has no analgesia"],
      ["traumaHistory", "History of sexual or physical trauma", "Patient-centered anesthesia criterion"],
    ],
  },
  {
    eyebrow: "OR-specific",
    title: "Positioning & aspiration risk",
    items: [
      ["severeGastroparesis", "Severe gastroparesis", "Aspiration-risk criterion"],
      ["majorMobilityLimitation", "Major physical limitation", "Bedbound/quadriplegia; multi-person transfer"],
    ],
  },
];

const pleasantonItems = [
  ["ageOver75", "Age greater than 75"],
  ["highRiskIntervention", "High-risk intervention", "Banding, EMR, or large-polyp removal"],
  ["deepBrainStimulator", "Deep brain stimulator"],
  ["coagulopathy", "Coagulopathy/thrombocytopenia", "Potential perioperative blood products"],
  ["meld11OrMore", "Cirrhosis with MELD ≥11"],
];

function Segmented({ label, value, options, onChange, columns }) {
  return (
    <fieldset className="segmented-field">
      <legend>{label}</legend>
      <div className="segmented" style={{ "--segments": columns || options.length }}>
        {options.map((option) => (
          <label key={option.value} className={value === option.value ? "selected" : ""}>
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckCard({ checked, title, detail, onChange }) {
  return (
    <label className={`check-card ${checked ? "checked" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="check-mark" aria-hidden="true">{checked ? "✓" : ""}</span>
      <span>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
    </label>
  );
}

function OpioidOption({ value, selected, label, detail, onChange }) {
  return (
    <label className={`opioid-option ${selected ? "selected" : ""}`}>
      <input type="radio" name="Opioid use" value={value} checked={selected} onChange={() => onChange(value)} />
      <span className="opioid-select-dot" aria-hidden="true" />
      <span><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
    </label>
  );
}

function OpioidSelector({ value, onChange }) {
  const option = (optionValue, label, detail) => (
    <OpioidOption value={optionValue} selected={value === optionValue} label={label} detail={detail} onChange={onChange} />
  );

  return (
    <fieldset className="opioid-selector">
      <legend>Opioid use</legend>
      <div className="opioid-neutral">
        {option("none", "None listed", "No opioid-related escalation")}
      </div>
      <div className="opioid-spectrum">
        <section className="opioid-lane opioid-lane-moderate" aria-label="Moderate sedation lane">
          <div className="lane-heading">
            <span className="lane-icon" aria-hidden="true">✓</span>
            <div><p>Moderate sedation</p><h3>Short-acting, lower-dose</h3></div>
          </div>
          <p className="lane-copy">Generally appropriate for moderate sedation</p>
          {option("shortUnder4", "Norco / Percocet / Vicodin", "<4 tablets per day")}
        </section>

        <div className="spectrum-vs" aria-hidden="true">VS</div>

        <section className="opioid-lane opioid-lane-heavy" aria-label="MAC and Remimazolam lane">
          <div className="lane-heading">
            <span className="lane-icon" aria-hidden="true">R</span>
            <div><p>MAC + Remimazolam signal</p><h3>High-dose or long-acting</h3></div>
          </div>
          <p className="lane-copy">MAC criterion; may benefit from Remimazolam</p>
          <div className="heavy-option-grid">
            {option("msContin", "MS Contin")}
            {option("dilaudid", "Oral Dilaudid")}
            {option("fentanyl", "Fentanyl Patch")}
            {option("opioidBenzo", "Opiate AND Benzo")}
            {option("shortMore4", "Norco / Percocet / Vicodin", ">4 tablets per day")}
          </div>
        </section>
      </div>
      <div className="opioid-boundary">
        <span><strong>Policy boundary</strong><small>Exactly 4 tabs/day is not defined—review rather than infer.</small></span>
        {option("shortExactly4", "Exactly 4/day")}
      </div>
    </fieldset>
  );
}

function CriteriaItem({ item }) {
  if (typeof item === "string") return <li>{item}</li>;
  return (
    <li>
      {item.text}
      {item.contrast ? (
        <div className="criteria-contrast">
          {item.contrast.map((lane) => (
            <section className={`criteria-lane criteria-lane-${lane.tone}`} key={lane.label}>
              <p>{lane.label}</p>
              <strong>{lane.title}</strong>
              <ul>{lane.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </section>
          ))}
          <p className="criteria-boundary"><strong>Boundary:</strong> {item.boundary}</p>
        </div>
      ) : (
        <ul className="criteria-details">
          {item.details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
      )}
    </li>
  );
}

function OutcomeRail({ active }) {
  const activeIndex = rail.findIndex((item) => item.id === active);
  return (
    <div className="route-rail" aria-label={`Current route: ${rail[activeIndex]?.label}`}>
      {rail.map((item, index) => (
        <div className={`rail-stop ${index <= activeIndex ? "passed" : ""} ${item.id === active ? "active" : ""}`} key={item.id}>
          <span className="rail-node">{item.short}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ResultPanel({ result }) {
  const statusLabel = result.status === "incomplete"
    ? "Complete the three opening fields"
    : result.status === "review"
      ? "Anesthesia review flag"
      : result.status === "excluded"
        ? "Pleasanton exclusion"
        : "Routing result";

  return (
    <aside className={`result-panel outcome-${result.level}`} aria-live="polite">
      <div className="result-topline">
        <span className={`status-dot status-${result.status}`} />
        {statusLabel}
      </div>
      <p className="micro-label">Current highest route</p>
      <h2>{result.completedBasics ? result.label : "Awaiting basics"}</h2>
      <OutcomeRail active={result.level} />

      {!result.completedBasics && (
        <div className="empty-result">
          <span>01</span>
          <p>Select a procedure, location, and BMI to activate the routing rail.</p>
        </div>
      )}

      {result.completedBasics && (
        <div className="result-details">
          <ResultList title="Why" items={result.reasons.length ? result.reasons : ["No listed escalation criterion identified from the supplied answers"]} />
          <ResultList title="Instructions" items={result.advisories} />
          <ResultList title="Pleasanton exclusion" items={result.pleasantonExclusions} tone="danger" />
          <ResultList title="Needs individual review" items={result.reviewFlags} tone="warning" />
          <ResultList title="Remimazolam considerations" items={result.remimazolam} tone="remi" />
        </div>
      )}

      <div className="result-actions">
        <button className="text-button" onClick={() => window.print()} disabled={!result.completedBasics}>Print</button>
      </div>
      <p className="clinical-note">Decision support only. Confirm against current policy and clinical judgment. Do not enter PHI.</p>
    </aside>
  );
}

function ResultList({ title, items, tone = "default" }) {
  if (!items.length) return null;
  return (
    <section className={`result-list tone-${tone}`}>
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

function Navigator({ state, setState, result, onReset }) {
  const set = (key, value) => setState((current) => ({ ...current, [key]: value }));
  return (
    <main className="navigator-layout">
      <div className="questionnaire">
        <section className="intro-card reveal-1">
          <div>
            <p className="eyebrow">Clinical routing navigator</p>
            <h1>Find the safest procedural pathway.</h1>
            <p className="lede">Answer only what applies. The highest-acuity criterion leads; every trigger stays visible.</p>
          </div>
          <button className="reset-button" onClick={onReset}>Reset all</button>
        </section>

        <section className="question-section essentials reveal-2">
          <div className="section-number">01</div>
          <div className="section-body">
            <p className="eyebrow">Start here</p>
            <h2>Procedure coordinates</h2>
            <Segmented label="Procedure" value={state.procedure} options={procedureOptions} onChange={(value) => set("procedure", value)} />
            <Segmented
              label="Procedure location"
              value={state.site}
              options={[{ value: "pleasanton", label: "Pleasanton" }, { value: "other", label: "Other DSA GI site" }]}
              onChange={(value) => set("site", value)}
            />
            <label className="bmi-field">
              <span>BMI</span>
              <input type="number" min="1" max="120" step="0.1" inputMode="decimal" value={state.bmi} onChange={(event) => set("bmi", event.target.value)} placeholder="e.g. 46" />
              <small>Enter the measured value; boundary rules are applied exactly as written.</small>
            </label>
          </div>
        </section>

        <section className="question-section reveal-3">
          <div className="section-number">02</div>
          <div className="section-body">
            <p className="eyebrow">Respiratory support</p>
            <h2>Home oxygen</h2>
            <Segmented
              label="Current oxygen use"
              value={state.oxygen}
              columns={2}
              options={[
                { value: "none", label: "No home oxygen" },
                { value: "intermittentUnder2", label: "Intermittent, <2 L/min" },
                { value: "continuousUnder2", label: "Continuous, <2 L/min" },
                { value: "twoToUnder4", label: "2 to <4 L/min" },
                { value: "fourPlus", label: "≥4 L/min" },
              ]}
              onChange={(value) => set("oxygen", value)}
            />
          </div>
        </section>

        {clinicalGroups.slice(0, 2).map((group, groupIndex) => (
          <section className="question-section" key={group.title}>
            <div className="section-number">{String(groupIndex + 3).padStart(2, "0")}</div>
            <div className="section-body">
              <p className="eyebrow">{group.eyebrow}</p>
              <h2>{group.title}</h2>
              {group.title === "Heart & circulation" && (
                <Segmented
                  label="Congestive heart failure"
                  value={state.chf}
                  columns={3}
                  options={[{ value: "none", label: "None listed" }, { value: "under30", label: "EF <30%" }, { value: "thirtyPlus", label: "EF ≥30%" }]}
                  onChange={(value) => set("chf", value)}
                />
              )}
              <div className="check-grid">
                {group.items.map(([key, title, detail]) => <CheckCard key={key} checked={state[key]} title={title} detail={detail} onChange={(value) => set(key, value)} />)}
              </div>
            </div>
          </section>
        ))}

        <section className="question-section">
          <div className="section-number">05</div>
          <div className="section-body">
            <p className="eyebrow">Medication & substances</p>
            <h2>Sedation tolerance</h2>
            <OpioidSelector value={state.opioid} onChange={(value) => set("opioid", value)} />
            <Segmented
              label="Opioid antagonist"
              value={state.antagonist}
              columns={2}
              options={[
                { value: "none", label: "None" },
                { value: "contrave", label: "Contrave" },
                { value: "revia", label: "Naltrexone / Revia" },
                { value: "vivitrol", label: "Vivitrol" },
                { value: "buprenorphine", label: "Buprenorphine / Suboxone" },
              ]}
              onChange={(value) => set("antagonist", value)}
            />
            <div className="check-grid">
              <CheckCard checked={state.heavyAlcoholDrug} title="Heavy alcohol or drug use" detail="Very heavy use also triggers a remimazolam consideration" onChange={(value) => set("heavyAlcoholDrug", value)} />
              <CheckCard checked={state.heavyCannabis} title="Heavy cannabis use" detail="Listed as a MAC consideration" onChange={(value) => set("heavyCannabis", value)} />
            </div>
          </div>
        </section>

        {clinicalGroups.slice(2).map((group, index) => (
          <section className="question-section" key={group.title}>
            <div className="section-number">{String(index + 6).padStart(2, "0")}</div>
            <div className="section-body">
              <p className="eyebrow">{group.eyebrow}</p>
              <h2>{group.title}</h2>
              <div className="check-grid">
                {group.items.map(([key, title, detail]) => <CheckCard key={key} checked={state[key]} title={title} detail={detail} onChange={(value) => set(key, value)} />)}
              </div>
            </div>
          </section>
        ))}

        <section className="question-section">
          <div className="section-number">08</div>
          <div className="section-body">
            <p className="eyebrow">Renal & cognitive</p>
            <h2>Preparation needs</h2>
            <Segmented
              label="Renal replacement therapy"
              value={state.dialysis}
              columns={3}
              options={[{ value: "none", label: "None" }, { value: "hd", label: "Hemodialysis" }, { value: "pd", label: "Peritoneal dialysis" }]}
              onChange={(value) => set("dialysis", value)}
            />
            <Segmented
              label="Intellectual disability / dementia"
              value={state.cognitive}
              columns={3}
              options={[{ value: "none", label: "Not present" }, { value: "canIv", label: "Can tolerate pre-procedure IV" }, { value: "cannotIv", label: "Cannot tolerate pre-procedure IV" }]}
              onChange={(value) => set("cognitive", value)}
            />
          </div>
        </section>

        {state.site === "pleasanton" && (
          <section className="question-section pleasanton-section">
            <div className="section-number">09</div>
            <div className="section-body">
              <p className="eyebrow">Location gate</p>
              <h2>Pleasanton exclusions</h2>
              <div className="check-grid">
                {pleasantonItems.map(([key, title, detail]) => <CheckCard key={key} checked={state[key]} title={title} detail={detail} onChange={(value) => set(key, value)} />)}
              </div>
            </div>
          </section>
        )}
      </div>
      <ResultPanel result={result} />
    </main>
  );
}

function Library() {
  const [filter, setFilter] = useState("all");
  const sections = filter === "all" ? policySections : policySections.filter((section) => section.id === filter);
  return (
    <main className="library-page">
      <div className="page-heading">
        <p className="eyebrow">Full criteria matrix</p>
        <h1>Criteria matrix</h1>
        <p>Browse the August 2026 source criteria without running a patient scenario.</p>
      </div>
      <div className="filter-bar" aria-label="Filter criteria">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        {policySections.map((section) => <button key={section.id} className={filter === section.id ? "active" : ""} onClick={() => setFilter(section.id)}>{section.title}</button>)}
      </div>
      <div className="criteria-grid">
        {sections.map((section, index) => (
          <article className={`criteria-card tone-card-${section.tone}`} key={section.id} style={{ "--delay": `${index * 55}ms` }}>
            <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <ul>{section.items.map((item) => <CriteriaItem key={typeof item === "string" ? item : item.text} item={item} />)}</ul>
          </article>
        ))}
      </div>
    </main>
  );
}

function Medications() {
  return (
    <main className="medication-page">
      <div className="page-heading">
        <p className="eyebrow">POM medication guide</p>
        <h1>Naltrexone timing, at a glance.</h1>
        <p>Formulation matters. These instructions reproduce the supplied POM guidance.</p>
      </div>
      <div className="medication-timeline">
        {medicationGuidance.map((item, index) => (
          <article className="medication-card" key={item.brand}>
            <div className="med-number">0{index + 1}</div>
            <div>
              <p className="brand-pill">{item.brand}</p>
              <h2>{item.medication}</h2>
              <p>{item.risk}</p>
            </div>
            <strong>{item.instruction}</strong>
          </article>
        ))}
      </div>
      <div className="policy-callout">
        <span>!</span>
        <p>Buprenorphine/Suboxone is listed as a MAC criterion, but no medication-hold instruction was supplied. Obtain individualized guidance.</p>
      </div>
    </main>
  );
}

export default function App() {
  const [tab, setTab] = useState("navigator");
  const [state, setState] = useState(initialState);
  const result = useMemo(() => evaluateCriteria(state), [state]);
  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setTab("navigator")} aria-label="DSA GI Sedation Criteria home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>DSA GI</strong><small>Sedation Criteria</small></span>
        </button>
        <nav aria-label="Primary navigation">
          <button className={tab === "navigator" ? "active" : ""} onClick={() => setTab("navigator")}>Navigator</button>
          <button className={tab === "library" ? "active" : ""} onClick={() => setTab("library")}>Criteria matrix</button>
          <button className={tab === "medications" ? "active" : ""} onClick={() => setTab("medications")}>Medication guide</button>
        </nav>
        <div className="version-chip"><span>Policy</span>{POLICY_VERSION}</div>
      </header>

      {tab === "navigator" && <Navigator state={state} setState={setState} result={result} onReset={() => setState(initialState)} />}
      {tab === "library" && <Library />}
      {tab === "medications" && <Medications />}

      <footer>
        <div><strong>DSA GI · Trust Your Gut</strong><span>Sedation Criteria · Revised {POLICY_VERSION}</span></div>
        <p>The DSA Way · No PHI is collected, saved, or transmitted. Confirm all routes against current policy and clinical judgment.</p>
      </footer>
    </div>
  );
}
