import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const registrationUrl = "https://cprvam.com/classes/acls/acls-online-skills/";
const reimbursementUrl = "https://tpmghcm.kp.org/nphrprd/signon.html";
const expenseGuideUrl = "https://sp-cloud.kp.org/sites/TPMGPhysicianPayroll/SitePages/How-to-Create-an-Expense-Report-for-Physicians.aspx";
const readinessUrl = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=xHuKPzfjpUeg_A1RLA4F8Zj47EYlwklOq4uH6MhZSndUMVVaR0VRODBXTVpKVkNUOUpLTzY1TEFSSy4u";

function HeartIcon() {
  return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 28 4.2 16.7C-3 9.8 7.1-.6 14.2 6.3L16 8l1.8-1.7C24.9-.6 35 9.8 27.8 16.7Z" /><path d="m5 15 6 0 3-5 4 12 3-7h6" fill="none" stroke="#b52335" strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function AclsDialog({ onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(<dialog id="acls-workflow-dialog" ref={dialogRef} className="acls-dialog"
    aria-labelledby="acls-title" aria-describedby="acls-audience"
    onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const targets = Array.from(event.currentTarget.querySelectorAll("button, a[href]"));
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="acls-dialog-header">
      <div><small>DSA Gastroenterology · Certification guide</small><h2 id="acls-title">ACLS certification workflow</h2></div>
      <button type="button" autoFocus onClick={onClose} aria-label="Close ACLS certification workflow">×</button>
    </header>
    <div className="acls-dialog-body">
      <p className="acls-audience" id="acls-audience"><strong>Highly recommended for Pleasanton physicians.</strong> All physicians in our group may opt in if interested in becoming ACLS certified.</p>
      <p className="acls-overview">Plan for 2–5 hours for the online assessment and 30 minutes for the in-person computerized manikin test to complete ACLS certification.</p>
      <ol className="acls-flow" aria-label="Four steps to ACLS certification">
        <li><span className="acls-step-number" aria-hidden="true">1</span><div><small>Register</small><h3>Sign up for ACLS training</h3><p>Register using the training site below. The ACLS fee is $280; submit an individual reimbursement request as described in step 1b.</p><a href={registrationUrl} target="_blank" rel="noreferrer">Sign up for ACLS training <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          <ol className="acls-registration-substeps" aria-label="Registration substeps"><li>
            <span aria-hidden="true">1a</span><div><h4>Choose this location</h4><p>On the registration site, select <strong>Crow Canyon</strong>.</p><address>3 Crow Canyon Court #205<br />San Ramon, CA 94583</address></div>
          </li><li>
            <span aria-hidden="true">1b</span><div><h4>Request reimbursement</h4>
              <p>The <strong>$280 ACLS fee is reimbursable under the $5,000 Annual Professional Allowance</strong>. Submit your reimbursement request individually through the MD People portal.</p>
              <a href={reimbursementUrl} target="_blank" rel="noreferrer">Open MD People reimbursement portal <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
              <a href={expenseGuideUrl} target="_blank" rel="noreferrer">How to create an expense report for physicians <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </li></ol>
        </div></li>
        <li><span className="acls-step-number" aria-hidden="true">2</span><div><small>Online · 2–5 hours</small><h3>Pass the self-paced adaptive course / exam</h3><p>The time varies with the accuracy of your answers. Complete and pass the online component before proceeding.</p></div></li>
        <li><span className="acls-step-number" aria-hidden="true">3</span><div><small>Notify us</small><h3>Submit the readiness form</h3><p>After passing the online component, fill out this form to let us know you are eligible for the skills test.</p><a href={readinessUrl} target="_blank" rel="noreferrer">Notify us you’re ready to test <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div></li>
        <li><span className="acls-step-number" aria-hidden="true">4</span><div><small>At one of our sites · 30 minutes</small><h3>Complete the computerized manikin test</h3><p>We will arrange a time for you to test at one of our sites. The computerized manikin is the actual final certification test, with no instructor or supervisor present.</p></div></li>
      </ol>
      <section className="acls-leave-guide" aria-labelledby="acls-leave-title">
        <small>Department guidance</small>
        <h3 id="acls-leave-title">ED leave for ACLS training</h3>
        <p>It is reasonable and expected to charge <strong>1–2 units of ED leave</strong> for the time required to complete both the online assessment and the in-person manikin test.</p>
        <table className="acls-unit-table">
          <caption>Hours-to-Units Conversion Table</caption>
          <thead><tr><th scope="col">Hours</th><th scope="col">Units</th></tr></thead>
          <tbody>
            <tr><th scope="row">8 Hours</th><td>2.00 Units</td></tr>
            <tr><th scope="row">4 Hours</th><td>1.00 Unit</td></tr>
            <tr><th scope="row">3 Hours</th><td>0.75 Units</td></tr>
            <tr><th scope="row">2 Hours</th><td>0.50 Units</td></tr>
          </tbody>
        </table>
        <p className="acls-timesheet-suggestion"><strong>Timesheet suggestion:</strong> Consider adding the ED-leave entry on a weekend day so it does not overlap with weekday timesheet entries and cause confusion.</p>
      </section>
      <p className="acls-finish"><HeartIcon /><strong>Pass the skills test → Complete ACLS certification</strong></p>
    </div>
  </dialog>, document.body);
}

export function AclsAnnouncement() {
  const [open, setOpen] = useState(false);
  return <section className="acls-announcement" aria-label="October 29 department meeting announcements">
    <time dateTime="2026-10-29">October 29 · Department meeting</time>
    <button type="button" className="acls-workflow-button" aria-haspopup="dialog" aria-expanded={open}
      aria-controls="acls-workflow-dialog" onClick={() => setOpen(true)}>
      <HeartIcon /><span><strong>ACLS</strong><span>Certification workflow</span></span><b aria-hidden="true">→</b>
    </button>
    {open && <AclsDialog onClose={() => setOpen(false)} />}
  </section>;
}
