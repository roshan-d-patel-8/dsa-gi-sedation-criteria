import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const registrationUrl = "https://cprvam.com/classes/acls/acls-online-skills/";
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
      <p className="acls-overview">Complete the adaptive online course, then take a brief skills test on a computerized manikin to achieve final official certification.</p>
      <ol className="acls-flow" aria-label="Four steps to ACLS certification">
        <li><span className="acls-step-number" aria-hidden="true">1</span><div><small>Register</small><h3>Sign up for ACLS training</h3><p>Register using the training site below. Request reimbursement individually through the MD People portal.</p><a href={registrationUrl} target="_blank" rel="noreferrer">Sign up for ACLS training <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          <ol className="acls-registration-substeps" aria-label="Registration substep"><li>
            <span aria-hidden="true">1a</span><div><h4>Choose this location</h4><p>On the registration site, select <strong>Crow Canyon</strong>.</p><address>3 Crow Canyon Court #205<br />San Ramon, CA 94583</address></div>
          </li></ol>
        </div></li>
        <li><span className="acls-step-number" aria-hidden="true">2</span><div><small>Online · 2–5 hours</small><h3>Pass the self-paced adaptive course / exam</h3><p>The time varies with the accuracy of your answers. Complete and pass the online component before proceeding.</p></div></li>
        <li><span className="acls-step-number" aria-hidden="true">3</span><div><small>Notify us</small><h3>Submit the readiness form</h3><p>After passing the online component, fill out this form to let us know you are eligible for the skills test.</p><a href={readinessUrl} target="_blank" rel="noreferrer">Notify us you’re ready to test <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div></li>
        <li><span className="acls-step-number" aria-hidden="true">4</span><div><small>At one of our sites · About 20 minutes</small><h3>Complete the computerized manikin test</h3><p>We will arrange a time for you to test at one of our sites. The computerized manikin is the actual final certification test, with no instructor or supervisor present.</p></div></li>
      </ol>
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
