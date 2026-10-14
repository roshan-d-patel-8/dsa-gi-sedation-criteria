import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function StickyNote({ note }) {
  return <details className="meeting-sticky-note"
    onPointerEnter={(event) => { if (event.pointerType === "mouse") event.currentTarget.open = true; }}
    onPointerLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false; }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}
    onKeyDown={(event) => { if (event.key === "Escape" && event.currentTarget.open) { event.preventDefault(); event.stopPropagation(); event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); } }}>
    <summary><span aria-hidden="true">N</span><strong>{note.label}</strong></summary>
    <div>{note.items && <ul>{note.items.map((item, index) => <li key={index}><strong>{item.label}:</strong> {item.text}</li>)}</ul>}
      {note.paragraphs?.map((text) => <p key={text}>{text}</p>)}
    </div>
  </details>;
}

export function MeetingNotesCard({ notes, onOpen }) {
  return <article className="meeting-announcement">
    <button type="button" className="meeting-notes-card" onClick={onOpen} aria-label={`Read ${notes.title}`}>
      <span className="meeting-notes-card-date" aria-hidden="true">OCT<strong>14</strong></span>
      <span><small>Department meeting · Notes</small><strong>{notes.title}</strong><b>Read full notes →</b></span>
    </button>
    <div className="meeting-highlights" aria-label="Meeting highlights">
      {notes.preview?.map((section, sectionIndex) => <section key={section.title}>
        <h4>{section.title}</h4><ul>{section.items.map((segments, index) => <li key={index}>{segments.map((segment, i) => typeof segment === "string" ? segment : <a href={segment.href} target="_blank" rel="noreferrer" key={i}>{segment.label}</a>)}</li>)}</ul>
        {sectionIndex === 0 && <StickyNote note={notes.sections[0].items[0].note} />}
        {sectionIndex === 3 && <StickyNote note={notes.sections[3].items[1].note} />}
      </section>)}
      <button type="button" className="meeting-full-notes" onClick={onOpen}>Read complete meeting notes →</button>
    </div>
  </article>;
}

export function MeetingNotesDialog({ notes, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!notes) return undefined;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current.showModal();
    return () => { dialogRef.current?.close(); document.body.style.overflow = previousOverflow; trigger?.focus({ preventScroll: true }); };
  }, [notes]);
  if (!notes) return null;
  return createPortal(<dialog className="meeting-notes-dialog" ref={dialogRef} aria-labelledby="meeting-notes-title"
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <header><div><time dateTime={notes.date}>Department meeting · October 14, 2026</time><h2 id="meeting-notes-title">{notes.title}</h2></div><button type="button" autoFocus onClick={onClose} aria-label="Close department meeting notes">×</button></header>
    <div className="meeting-notes-body">{notes.sections.map((section) => <section key={section.title}>
      <h3>{section.title}</h3><ul>{section.items.map((item, index) => <li key={index}>
        <p>{item.segments.map((segment, i) => typeof segment === "string" ? segment : <a href={segment.href} target="_blank" rel="noreferrer" key={i}>{segment.label}</a>)}</p>
        {item.note && <StickyNote note={item.note} />}
      </li>)}</ul>
    </section>)}</div>
  </dialog>, document.body);
}
