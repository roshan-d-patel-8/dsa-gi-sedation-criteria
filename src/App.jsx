import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const zoomLevels = [90, 100, 110, 125, 140];
const zoomStorageKey = "dsa-gi-page-zoom";

function escapeSearchPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightSearchText(text, query) {
  if (!query) return text;

  const matcher = new RegExp(`(${escapeSearchPattern(query)})`, "gi");
  return String(text).split(matcher).map((part, index) => (
    part.toLowerCase() === query.toLowerCase()
      ? <mark className="search-highlight search-highlight-inline" key={`${part}-${index}`}>{part}</mark>
      : part
  ));
}

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

const monthlyAnnouncements = {
  8: [
    {
      label: "Pharmacy Authorization form for Desktop Medicine",
      kind: "Reminder",
      date: "2026-09-14",
      displayDate: "Due Sep 14",
      month: "SEP",
      day: "14",
      tone: "deadline",
    },
    {
      label: "NCAL GI 2-hour TPIP makeup",
      kind: "Save the date",
      date: "2026-11-05T18:00:00-08:00",
      displayDate: "Nov 5 · 6–8 PM",
      month: "NOV",
      day: "05",
      tone: "save-date",
    },
  ],
};

const monthlyDepartmentResources = {
  8: [
    {
      id: "four-habits",
      title: "The Four Habits",
      description: "A user’s guide for difficult conversations.",
      assetPath: "department-meeting-resources/2026-09/the-four-habits",
      slideTitles: [
        "The Four Habits — A user’s guide for difficult conversations",
        "Let’s name them",
        "The Four Habits overview",
        "Invest in the beginning",
        "Elicit the patient perspective",
        "Invest in the end",
        "Empathy",
        "Sample empathic statements",
        "Feelings vocabulary",
        "Empathy batting practice",
        "Difficult conversations",
        "Difficult conversations framework",
        "Pause and reset",
        "The difficult-conversation holy trinity",
        "Align",
        "Pivot",
        "Feeling weird is normal",
        "Thank you",
        "Thank you",
      ],
    },
  ],
};

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

function ZoomIcon() {
  return (
    <svg className="zoom-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.25" />
      <path d="m15.2 15.2 4.6 4.6M10.5 7.6v5.8M7.6 10.5h5.8" />
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

function PresentationViewer({ resource, onClose }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const touchStartX = useRef(null);

  const totalSlides = resource?.slideTitles.length || 0;
  const slideNumber = String(slideIndex + 1).padStart(2, "0");
  const slideSrc = resource
    ? `${import.meta.env.BASE_URL}${resource.assetPath}/slide-${slideNumber}.webp`
    : "";

  function goToSlide(nextIndex) {
    setSlideIndex(Math.max(0, Math.min(totalSlides - 1, nextIndex)));
  }

  async function closeViewer() {
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
    if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    onClose();
  }

  async function toggleFullscreen() {
    if (fallbackFullscreen) {
      setFallbackFullscreen(false);
      return;
    }

    const activeFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
    if (activeFullscreen) {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      return;
    }

    const requestFullscreen = dialogRef.current?.requestFullscreen || dialogRef.current?.webkitRequestFullscreen;
    if (!requestFullscreen) {
      setFallbackFullscreen((active) => !active);
      return;
    }

    try {
      await requestFullscreen.call(dialogRef.current);
    } catch {
      setFallbackFullscreen((active) => !active);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeViewer();
      return;
    }
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      goToSlide(slideIndex + 1);
      return;
    }
    if (["ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      goToSlide(slideIndex - 1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      goToSlide(totalSlides - 1);
      return;
    }
    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(dialogRef.current.querySelectorAll("button:not(:disabled)"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  useEffect(() => {
    if (!resource) return undefined;
    const priorFocus = document.activeElement;
    setSlideIndex(0);
    setFallbackFullscreen(false);
    document.body.classList.add("presentation-open");
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.classList.remove("presentation-open");
      if (priorFocus instanceof HTMLElement) priorFocus.focus();
    };
  }, [resource]);

  useEffect(() => {
    function updateFullscreenState() {
      setNativeFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    }
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState);
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenState);
    };
  }, []);

  useEffect(() => {
    if (!resource) return undefined;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resource, slideIndex, totalSlides, fallbackFullscreen]);

  useEffect(() => {
    if (!resource) return;
    [slideIndex - 1, slideIndex + 1]
      .filter((index) => index >= 0 && index < totalSlides)
      .forEach((index) => {
        const image = new Image();
        image.src = `${import.meta.env.BASE_URL}${resource.assetPath}/slide-${String(index + 1).padStart(2, "0")}.webp`;
      });
  }, [resource, slideIndex, totalSlides]);

  if (!resource) return null;

  const isFullscreen = nativeFullscreen || fallbackFullscreen;
  const currentTitle = resource.slideTitles[slideIndex];

  return createPortal(
    <div
      className="presentation-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && closeViewer()}
    >
      <section
        className={`presentation-dialog${fallbackFullscreen ? " is-fallback-fullscreen" : ""}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="presentation-title"
        aria-describedby="presentation-instructions"
      >
        <header className="presentation-header">
          <div>
            <small>Department meeting resource</small>
            <h2 id="presentation-title">{resource.title}</h2>
          </div>
          <div className="presentation-header-actions">
            <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}>
              <span aria-hidden="true">{isFullscreen ? "↙" : "⛶"}</span>
              <strong>{isFullscreen ? "Exit full screen" : "Full screen"}</strong>
            </button>
            <button className="presentation-close" type="button" onClick={closeViewer} ref={closeButtonRef} aria-label={`Close ${resource.title} presentation`}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        <div
          className="presentation-stage"
          onTouchStart={(event) => { touchStartX.current = event.changedTouches[0].clientX; }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(distance) > 45) goToSlide(slideIndex + (distance < 0 ? 1 : -1));
            touchStartX.current = null;
          }}
        >
          <button
            className="presentation-arrow presentation-arrow-previous"
            type="button"
            onClick={() => goToSlide(slideIndex - 1)}
            disabled={slideIndex === 0}
            aria-label="Previous slide"
          >
            <span aria-hidden="true">←</span>
          </button>

          <figure className="presentation-slide">
            <button
              className="presentation-slide-advance"
              type="button"
              onClick={() => goToSlide(slideIndex + 1)}
              disabled={slideIndex === totalSlides - 1}
              aria-label={slideIndex === totalSlides - 1 ? "Final slide" : `Advance to slide ${slideIndex + 2}`}
            >
              <img src={slideSrc} alt={`${currentTitle}. Slide ${slideIndex + 1} of ${totalSlides}.`} draggable="false" />
            </button>
            <figcaption aria-live="polite">
              <span>Slide {slideIndex + 1} of {totalSlides}</span>
              <strong>{currentTitle}</strong>
            </figcaption>
          </figure>

          <button
            className="presentation-arrow presentation-arrow-next"
            type="button"
            onClick={() => goToSlide(slideIndex + 1)}
            disabled={slideIndex === totalSlides - 1}
            aria-label="Next slide"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <footer className="presentation-footer">
          <div
            className="presentation-progress"
            role="progressbar"
            aria-label="Presentation progress"
            aria-valuemin="1"
            aria-valuemax={totalSlides}
            aria-valuenow={slideIndex + 1}
          >
            <span style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }} />
          </div>
          <p id="presentation-instructions">Click the slide or use ← → to advance · F for full screen · Esc to close</p>
        </footer>
      </section>
    </div>,
    document.body,
  );
}

const calendarMonths = Array.from({ length: 12 }, (_, index) => index);
const defaultCalendarPosition = 8;
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function BirthdayDialog({ birthday, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!birthday) return undefined;
    const pageSurface = document.querySelector(".page-zoom-surface");
    document.body.classList.add("birthday-dialog-open");
    pageSurface?.setAttribute("inert", "");
    closeButtonRef.current?.focus({ preventScroll: true });

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("birthday-dialog-open");
      pageSurface?.removeAttribute("inert");
    };
  }, [birthday, onClose]);

  if (!birthday) return null;

  return createPortal(
    <div
      className="birthday-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        id="birthday-celebration-dialog"
        className="birthday-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Birthday celebration for ${birthday.name}`}
      >
        <button
          className="birthday-dialog-close"
          type="button"
          aria-label="Close birthday card"
          onClick={onClose}
          ref={closeButtonRef}
        >
          ×
        </button>
        <span className="birthday-dialog-portrait">
          <img src={`${import.meta.env.BASE_URL}portraits/${birthday.photo}`} alt="" />
          <BirthdayCupcakeIcon />
        </span>
        <span className="birthday-dialog-copy">
          <small>Celebrate a colleague · {birthday.displayDate}</small>
          <strong>Happy Birthday,<br />{birthday.name}!</strong>
          <span>Wishing you a wonderful day.</span>
        </span>
      </section>
    </div>,
    document.body,
  );
}

function Calendar2026() {
  const [monthPosition, setMonthPosition] = useState(defaultCalendarPosition);
  const [activeResource, setActiveResource] = useState(null);
  const [activeBirthday, setActiveBirthday] = useState(null);
  const birthdayTriggerRef = useRef(null);
  const monthIndex = calendarMonths[monthPosition];
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(2026, monthIndex, 1)));
  const leadingDays = new Date(Date.UTC(2026, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(2026, monthIndex + 1, 0)).getUTCDate();
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const monthEvents = countdowns.filter(({ date }) => Number(date.slice(5, 7)) - 1 === monthIndex);
  const monthBirthdays = birthdayEvents.filter(({ date }) => Number(date.slice(5, 7)) - 1 === monthIndex);
  const monthSocialEvents = socialEvents.filter(({ date }) => Number(date.slice(5, 7)) - 1 === monthIndex);
  const announcements = monthlyAnnouncements[monthIndex] || [];
  const departmentResources = monthlyDepartmentResources[monthIndex] || [];

  function moveMonth(direction) {
    setActiveBirthday(null);
    setMonthPosition((position) => Math.min(calendarMonths.length - 1, Math.max(0, position + direction)));
  }

  function openBirthday(birthday, trigger) {
    birthdayTriggerRef.current = trigger;
    setActiveBirthday(birthday);
  }

  function closeBirthday() {
    setActiveBirthday(null);
    requestAnimationFrame(() => birthdayTriggerRef.current?.focus({ preventScroll: true }));
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
      <h2 id="calendar-title" className="sr-only">2026 calendar with monthly announcements and department meeting resources</h2>
      <div className="calendar-main">
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
                      <button
                        className="birthday-marker"
                        type="button"
                        aria-label={`Happy Birthday, ${birthday.name}!`}
                        aria-describedby={tooltipId}
                        aria-haspopup="dialog"
                        aria-expanded={activeBirthday?.name === birthday.name && activeBirthday?.date === birthday.date}
                        aria-controls="birthday-celebration-dialog"
                        onClick={(event) => openBirthday(birthday, event.currentTarget)}
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
                      </button>
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
      </div>

      <aside className="calendar-announcements" aria-label={`Announcements and department meeting resources for ${monthLabel}`}>
        <header className="calendar-announcements-header">
          <span>Bulletin</span>
          <h2>Announcements</h2>
          <small>{announcements.length ? `${announcements.length} items` : "All clear"}</small>
        </header>
        {announcements.length > 0 ? (
          <div className="announcement-list">
            {announcements.map((announcement) => (
              <article className={`announcement-card tone-${announcement.tone}`} key={announcement.label}>
                <time className="announcement-date" dateTime={announcement.date}>
                  <span>{announcement.month}</span>
                  <strong>{announcement.day}</strong>
                </time>
                <div>
                  <small>{announcement.kind}</small>
                  <h3>{announcement.label}</h3>
                  <time dateTime={announcement.date}>{announcement.displayDate}</time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="announcements-empty">No announcements for this month.</p>
        )}

        <section className="department-resources" aria-labelledby={`department-resources-${monthIndex}`}>
          <header className="department-resources-header">
            <span>Reference library</span>
            <h3 id={`department-resources-${monthIndex}`}>Department meeting resources</h3>
            <small>{monthLabel}</small>
          </header>
          {departmentResources.length > 0 ? (
            <div className="department-resource-list">
              {departmentResources.map((resource) => (
                <button
                  className="department-resource-card"
                  type="button"
                  onClick={() => setActiveResource(resource)}
                  aria-label={`Open ${resource.title} presentation, ${resource.slideTitles.length} slides`}
                  key={resource.id}
                >
                  <span className="department-resource-cover">
                    <img src={`${import.meta.env.BASE_URL}${resource.assetPath}/slide-01.webp`} alt="" />
                    <i aria-hidden="true">View deck</i>
                  </span>
                  <span className="department-resource-copy">
                    <small>Presentation · {resource.slideTitles.length} slides</small>
                    <strong>{resource.title}</strong>
                    <span>{resource.description}</span>
                  </span>
                  <b aria-hidden="true">Open →</b>
                </button>
              ))}
            </div>
          ) : (
            <p className="department-resources-empty">No department meeting resources for this month.</p>
          )}
        </section>
      </aside>

      <PresentationViewer resource={activeResource} onClose={() => setActiveResource(null)} />
      <BirthdayDialog birthday={activeBirthday} onClose={closeBirthday} />
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

const communicationPools = [
  { pool: "P WCR GI APPT", purpose: "Urgent procedure scheduling requests" },
  { pool: "P WCR GI MA", purpose: "Walnut Creek MA inbox" },
  { pool: "P DRV GI MA", purpose: "Deer Valley MA inbox" },
  { pool: "P WCR GI ADV", purpose: "Walnut Creek GI Advice RN" },
  { pool: "P NCAL IBD PHARM", purpose: "Regional IBD pharmacy referrals" },
  { pool: "P NCAL REG THERAPY PLAN", purpose: "Biologic infusion-order renewals" },
  { pool: "P WCR INF RN", purpose: "Walnut Creek infusion RN inbox", referenceOnly: true },
  { pool: "P DRV ONC RN", purpose: "Deer Valley infusion/oncology RN inbox", referenceOnly: true },
  { pool: "P DUB INF RN", purpose: "Dublin infusion RN inbox", referenceOnly: true },
];

const communicationEmailDetails = {
  "dsagimdtimeoffrequests@kp.org": {
    label: "Physician schedule & time-off requests",
    purpose: "Centralized requests outside the annual vacation draft",
  },
  "dsagimds@kp.org": {
    label: "DSA GI MDs group email",
    purpose: "Departmentwide physician group email",
  },
};

const skillsDayVideo = {
  title: "DSA GI Skills Day 2025",
  embedUrl: "https://www.youtube-nocookie.com/embed/WYdP1js9NPk?rel=0",
  watchUrl: "https://youtu.be/WYdP1js9NPk",
  duration: "50:33",
  chapters: [
    { time: "0:05", seconds: 5, title: "Variceal banding" },
    { time: "8:57", seconds: 537, title: "Balloon dilation" },
    { time: "15:30", seconds: 930, title: "Savary dilation" },
    { time: "26:37", seconds: 1597, title: "Swimmer's Position for Colonoscopy" },
    { time: "27:15", seconds: 1635, title: "Clipping" },
    { time: "31:02", seconds: 1862, title: "Endoloop" },
    { time: "33:13", seconds: 1993, title: "ERBE Principles" },
    { time: "35:22", seconds: 2122, title: "Spyglass (cholangioscopy)" },
    { time: "46:56", seconds: 2816, title: "Trapezoid basket" },
  ],
};

function createSkillsDayFoldout(doc) {
  const skillsDay = doc.createElement("details");
  skillsDay.className = "orientation-site-group orientation-skills-day";
  const chapterLinks = skillsDayVideo.chapters.map((chapter) => `
    <li class="skills-day-chapter">
      <a
        href="${skillsDayVideo.watchUrl}?t=${chapter.seconds}s"
        target="_blank"
        rel="noreferrer"
        data-skills-day-start="${chapter.seconds}"
        data-skills-day-title="${chapter.title}"
        aria-controls="skills-day-player"
      >
        <span>${chapter.time}</span>
        <strong>${chapter.title}</strong>
        <i aria-hidden="true">\u25b6</i>
      </a>
    </li>
  `).join("");
  skillsDay.innerHTML = `
    <summary>
      <span>PLAY</span>
      <div><h3>Skills Day</h3><small>Watch the team training session</small></div>
      <i aria-hidden="true"></i>
    </summary>
    <div class="skills-day-body">
      <div class="skills-day-media">
        <div class="skills-day-video">
          <iframe
            id="skills-day-player"
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
      <nav class="skills-day-chapters" aria-label="Skills Day video chapters">
        <header>
          <div><span>Chapter index</span><strong>Jump straight to a skill</strong></div>
          <small>${skillsDayVideo.chapters.length} chapters · ${skillsDayVideo.duration}</small>
        </header>
        <ol>${chapterLinks}</ol>
        <p class="skills-day-now-playing" aria-live="polite">Select a chapter to play it here.</p>
      </nav>
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
  const supplementalNodes = sectionShort === "Contacts"
    ? Array.from(container.children).filter((node) => node !== sourceList)
    : [];

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
    const group = doc.createElement("details");
    group.className = `orientation-site-group site-group-${key}`;
    group.innerHTML = `
      <summary>
        <span>${details.code}</span>
        <div><h3>${details.name}</h3><small>${sectionShort === "People" ? "Roles, leadership and access" : "Direct lines and operational contacts"}</small></div>
        <i aria-hidden="true"></i>
      </summary>
    `;
    const list = doc.createElement("ul");
    list.className = "orientation-site-list";
    items.forEach((item) => list.append(item));
    group.append(list);
    groupGrid.append(group);
  });

  if (sectionShort === "Contacts" && supplementalNodes.length) {
    container.replaceChildren(
      createTopicFoldout(doc, {
        code: "LINK",
        title: "Directory Access",
        description: "KPATHS access requirements",
        className: "topic-contact-directory",
        nodes: supplementalNodes,
      }),
      groupGrid,
    );
  } else {
    sourceList.replaceWith(groupGrid);
  }
}

function createCommunicationFoldout(doc, { code, title, description, className }) {
  const foldout = doc.createElement("details");
  foldout.className = `orientation-site-group orientation-communication-group ${className}`;
  foldout.innerHTML = `
    <summary>
      <span>${code}</span>
      <div><h3>${title}</h3><small>${description}</small></div>
      <i aria-hidden="true"></i>
    </summary>
  `;
  return foldout;
}

function groupCommunicationContent(container, doc, sectionShort) {
  if (sectionShort !== "Communication") return;

  const addresses = Array.from(doc.querySelectorAll('a[href^="mailto:"]'))
    .map((link) => link.getAttribute("href").replace(/^mailto:/i, "").trim())
    .filter((address, index, all) => address && all.indexOf(address) === index);
  const emailRows = addresses.map((address) => {
    const details = communicationEmailDetails[address] ?? {
      label: address,
      purpose: "Email address listed in the Field Guide",
    };
    return `
      <tr>
        <td><strong>${details.label}</strong><a href="mailto:${address}">${address}</a></td>
        <td>${details.purpose}</td>
        <td>
          <button type="button" class="pool-copy-button email-copy-button" data-copy-value="${address}" aria-label="Copy ${address} to clipboard">
            <span aria-hidden="true"></span><strong class="copy-button-label">Copy</strong>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  const emailDirectory = createCommunicationFoldout(doc, {
    code: "MAIL",
    title: "Email Directory",
    description: "Every mailbox listed in the Field Guide",
    className: "orientation-email-directory",
  });
  const emailBody = doc.createElement("div");
  emailBody.className = "communication-accordion-body email-directory-body";
  emailBody.innerHTML = `
    <p class="communication-privacy-note"><strong>Outlook:</strong> Put <code>(PHI)</code> in the subject line whenever patient information is included.</p>
    <table>
      <thead><tr><th scope="col">Email</th><th scope="col">Use</th><th scope="col"><span class="sr-only">Copy address</span></th></tr></thead>
      <tbody>${emailRows}</tbody>
    </table>
    <p class="copy-status sr-only" aria-live="polite"></p>
  `;
  emailDirectory.append(emailBody);

  const secureChannels = createCommunicationFoldout(doc, {
    code: "CHAT",
    title: "Secure Channels",
    description: "Approved clinical communication options",
    className: "orientation-secure-channels",
  });
  const channelBody = doc.createElement("div");
  channelBody.className = "communication-accordion-body secure-channels-body";
  Array.from(container.children)
    .filter((node) => !node.querySelector('a[href^="mailto:"]') && !/^Outlook:/i.test(node.textContent.trim()))
    .forEach((node) => channelBody.append(node));
  channelBody.querySelectorAll("ol, ul").forEach((list) => list.classList.add("orientation-list-grid"));
  secureChannels.append(channelBody);

  container.replaceChildren(emailDirectory, secureChannels);
}

function addPoolParty(container, doc, sectionShort) {
  if (sectionShort !== "Communication") return;

  const rows = communicationPools.map(({ pool, purpose, referenceOnly }) => `
    <tr${referenceOnly ? ' class="pool-reference-only"' : ""}>
      <td><code>${pool}</code></td>
      <td>${purpose}${referenceOnly ? '<small>Reference only</small>' : ""}</td>
      <td>
        <button type="button" class="pool-copy-button" data-copy-value="${pool}" aria-label="Copy ${pool} to clipboard">
          <span aria-hidden="true"></span><strong class="copy-button-label">Copy</strong>
        </button>
      </td>
    </tr>
  `).join("");

  const poolParty = doc.createElement("details");
  poolParty.className = "orientation-site-group orientation-pool-party";
  poolParty.innerHTML = `
    <summary>
      <span>POOL</span>
      <div><h3>Pool Party</h3><small>Copy-ready Health Connect destinations</small></div>
      <i aria-hidden="true"></i>
    </summary>
    <div class="pool-party-body">
      <table>
        <thead><tr><th scope="col">Pool</th><th scope="col">Purpose</th><th scope="col"><span class="sr-only">Copy address</span></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <aside><strong>Infusion note</strong> The three infusion RN destinations are retained for reference; the Field Guide says routine infusion requests no longer need to be routed to them.</aside>
      <p class="copy-status sr-only" aria-live="polite"></p>
    </div>
  `;
  container.append(poolParty);
}

function decorateTopicBody(body) {
  Array.from(body.children).forEach((node) => {
    if (node.matches("ol, ul")) node.classList.add("orientation-list-grid");
    if (node.matches("blockquote")) node.classList.add("orientation-callout");
    if (!node.matches("p")) return;
    const onlyStrong = node.children.length === 1 && node.firstElementChild?.tagName === "STRONG";
    node.classList.add(onlyStrong ? "orientation-subheading" : "orientation-prose-block");
    if (node.querySelector("em")) node.classList.add("orientation-callout");
  });
}

function createTopicFoldout(doc, { code, title, description, className = "", nodes = [], bodyClass = "" }) {
  const foldout = doc.createElement("details");
  foldout.className = `orientation-site-group orientation-topic-group ${className}`.trim();
  foldout.innerHTML = `
    <summary>
      <span>${code}</span>
      <div><h3>${title}</h3><small>${description}</small></div>
      <i aria-hidden="true"></i>
    </summary>
  `;
  const body = doc.createElement("div");
  body.className = `orientation-topic-body ${bodyClass}`.trim();
  nodes.forEach((node) => body.append(node));
  decorateTopicBody(body);
  foldout.append(body);
  return foldout;
}

function listWithItems(doc, sourceList, items) {
  const list = doc.createElement(sourceList.tagName.toLowerCase());
  Array.from(sourceList.attributes).forEach((attribute) => list.setAttribute(attribute.name, attribute.value));
  items.forEach((item) => list.append(item));
  return list;
}

function nestedListFromItem(item) {
  return item.querySelector(":scope > ol, :scope > ul");
}

function groupSchedules(container, doc, sectionShort) {
  if (sectionShort !== "Schedules") return;
  const sourceList = container.querySelector(":scope > ol, :scope > ul");
  const items = sourceList ? Array.from(sourceList.children) : [];
  if (items.length < 4) return;
  container.replaceChildren(
    createTopicFoldout(doc, {
      code: "CALL",
      title: "Call Schedule",
      description: "Weekday, weekend, ERCP and backup coverage",
      className: "topic-schedule-call",
      nodes: [nestedListFromItem(items[0]) || listWithItems(doc, sourceList, items.slice(0, 1))],
    }),
    createTopicFoldout(doc, {
      code: "PTO",
      title: "Scheduling & Time Off",
      description: "Lightning Bolt, vacation draft and request mailbox",
      className: "topic-schedule-timeoff",
      nodes: [listWithItems(doc, sourceList, items.slice(1, 3))],
    }),
    createTopicFoldout(doc, {
      code: "MEET",
      title: "Department Meetings",
      description: "Recurring GI physician meeting cadence",
      className: "topic-schedule-meetings",
      nodes: [nestedListFromItem(items[3]) || listWithItems(doc, sourceList, items.slice(3))],
    }),
  );
}

function findNodeIndex(nodes, pattern) {
  return nodes.findIndex((node) => pattern.test(node.textContent.trim()));
}

function groupStandardSections(container, doc, sectionShort) {
  const nodes = Array.from(container.children);
  if (!nodes.length) return;

  if (sectionShort === "Services") {
    const specialists = findNodeIndex(nodes, /^GI Subspecialists within our Department:/i);
    if (specialists < 0) return;
    container.replaceChildren(
      createTopicFoldout(doc, {
        code: "MAP",
        title: "Regional Services & Referrals",
        description: "Procedure locations, referral routes and conferences",
        className: "topic-services-regional",
        nodes: nodes.slice(0, specialists),
      }),
      createTopicFoldout(doc, {
        code: "WHO",
        title: "DSA GI Subspecialists",
        description: "Department experts by clinical focus",
        className: "topic-services-specialists",
        nodes: nodes.slice(specialists + 1),
      }),
    );
    return;
  }

  if (sectionShort === "Clinic") {
    const secondOpinions = findNodeIndex(nodes, /opinions:$/i);
    const physicianAssistants = findNodeIndex(nodes, /^Physician Assistants \(PAs\):/i);
    if (secondOpinions < 0 || physicianAssistants < 0) return;
    container.replaceChildren(
      createTopicFoldout(doc, {
        code: "VISIT",
        title: "Appointments & Access",
        description: "Visit types, direct booking and follow-up",
        className: "topic-clinic-appointments",
        nodes: nodes.slice(0, secondOpinions),
      }),
      createTopicFoldout(doc, {
        code: "2ND",
        title: "Second Opinions",
        description: "Department and regional review pathways",
        className: "topic-clinic-opinions",
        nodes: nodes.slice(secondOpinions + 1, physicianAssistants),
      }),
      createTopicFoldout(doc, {
        code: "PA",
        title: "Physician Assistants",
        description: "Team members, hours and responsibilities",
        className: "topic-clinic-pas",
        nodes: nodes.slice(physicianAssistants + 1),
      }),
    );
    return;
  }

  if (sectionShort === "Orders") {
    container.replaceChildren(createTopicFoldout(doc, {
      code: "E2K",
      title: "Orders & E-consults",
      description: "Radiology, diagnostics, labs and infusion orders",
      className: "topic-orders",
      nodes,
    }));
    return;
  }

  if (sectionShort === "OR workflow") {
    container.replaceChildren(createTopicFoldout(doc, {
      code: "OR",
      title: "Case Booking Workflow",
      description: "From case request through patient confirmation",
      className: "topic-or-workflow",
      nodes,
    }));
    return;
  }

  if (sectionShort === "Ergonomics") {
    container.replaceChildren(createTopicFoldout(doc, {
      code: "ERGO",
      title: "Ergonomic Evaluation",
      description: "Early-career assessment and follow-up",
      className: "topic-ergonomics",
      nodes,
    }));
    return;
  }

  if (sectionShort === "MA-MD") {
    const support = findNodeIndex(nodes, /^What can MA’s help me with\?/i);
    const conversions = findNodeIndex(nodes, /^Appt conversion rules:/i);
    const messaging = findNodeIndex(nodes, /^Ask MA’s to call patients/i);
    const expectations = findNodeIndex(nodes, /^MA Expectations for virtual clinic/i);
    if ([support, conversions, messaging, expectations].some((index) => index < 0)) return;
    container.replaceChildren(
      createTopicFoldout(doc, {
        code: "TEAM",
        title: "Program & MA Teams",
        description: "Purpose, project lead and site staffing",
        className: "topic-ma-team",
        nodes: nodes.slice(0, support),
      }),
      createTopicFoldout(doc, {
        code: "HELP",
        title: "How MAs Can Help",
        description: "Rooming, inbox work and administrative support",
        className: "topic-ma-support",
        nodes: nodes.slice(support, conversions),
      }),
      createTopicFoldout(doc, {
        code: "BOOK",
        title: "Conversions & Booking",
        description: "Appointment conversions, timing and urgent access",
        className: "topic-ma-booking",
        nodes: nodes.slice(conversions, messaging),
      }),
      createTopicFoldout(doc, {
        code: "NOTE",
        title: "Messages & Result Notes",
        description: "Patient outreach, pathology and QuikActions",
        className: "topic-ma-results",
        nodes: nodes.slice(messaging, expectations),
      }),
      createTopicFoldout(doc, {
        code: "VIRT",
        title: "Virtual Clinic Expectations",
        description: "Check-ins, escalation and performance support",
        className: "topic-ma-virtual",
        nodes: nodes.slice(expectations),
      }),
    );
  }
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
    groupCommunicationContent(container, doc, meta.short);
    addPoolParty(container, doc, meta.short);
    groupProcedures(container, doc, meta.short);
    groupSchedules(container, doc, meta.short);
    groupStandardSections(container, doc, meta.short);
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
  const [visibleMatchCount, setVisibleMatchCount] = useState(0);
  const orientationContentRef = useRef(null);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = normalizedQuery
    ? sections.filter((section) => `${section.sourceLabel} ${section.descriptor} ${section.text}`.toLowerCase().includes(normalizedQuery))
    : sections;
  const activeSection = visibleSections.find((section) => section.id === activeSectionId) || visibleSections[0];
  const activeSectionMarkup = useMemo(() => ({ __html: activeSection?.html || "" }), [activeSection?.html]);
  const isChoosingWisely = activeSection?.short === "Choosing Wisely";
  const choosingWiselyInfographic = `${import.meta.env.BASE_URL}choosing-wisely-graduation-jan-jul-2026.jpg`;

  useEffect(() => {
    const content = orientationContentRef.current;
    if (!content || !activeSection) {
      setVisibleMatchCount(0);
      return;
    }

    content.innerHTML = activeSection.html;
    if (!normalizedQuery) {
      setVisibleMatchCount(0);
      return;
    }

    const documentView = content.ownerDocument.defaultView;
    const textWalker = content.ownerDocument.createTreeWalker(
      content,
      documentView.NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || !node.nodeValue.toLowerCase().includes(normalizedQuery)) {
            return documentView.NodeFilter.FILTER_REJECT;
          }
          if (parent.closest("script, style, iframe, button, input, textarea, option, mark.search-highlight, .sr-only")) {
            return documentView.NodeFilter.FILTER_REJECT;
          }
          return documentView.NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    const matchingTextNodes = [];
    while (textWalker.nextNode()) matchingTextNodes.push(textWalker.currentNode);

    const matcher = new RegExp(escapeSearchPattern(normalizedQuery), "gi");
    let nextMatchCount = 0;
    matchingTextNodes.forEach((textNode) => {
      const fragment = content.ownerDocument.createDocumentFragment();
      const text = textNode.nodeValue;
      let previousIndex = 0;

      text.replace(matcher, (match, matchIndex) => {
        fragment.append(text.slice(previousIndex, matchIndex));
        const mark = content.ownerDocument.createElement("mark");
        mark.className = "search-highlight";
        mark.textContent = match;
        fragment.append(mark);
        previousIndex = matchIndex + match.length;
        nextMatchCount += 1;
        return match;
      });
      fragment.append(text.slice(previousIndex));
      textNode.replaceWith(fragment);
    });

    content.querySelectorAll("mark.search-highlight").forEach((mark) => {
      let parentAccordion = mark.closest("details");
      while (parentAccordion && content.contains(parentAccordion)) {
        parentAccordion.open = true;
        parentAccordion = parentAccordion.parentElement?.closest("details");
      }
    });
    const firstContentMatch = content.querySelector("mark.search-highlight");
    if (firstContentMatch) {
      requestAnimationFrame(() => {
        if (firstContentMatch.isConnected) firstContentMatch.scrollIntoView({ block: "center", inline: "nearest" });
      });
    }
    setVisibleMatchCount(nextMatchCount);
  }, [activeSection, normalizedQuery]);

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

  async function copyCommunicationValue(button) {
    const value = button.dataset.copyValue;
    const label = button.querySelector(".copy-button-label");
    const status = button.closest("details")?.querySelector(".copy-status");

    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      label.textContent = "Copied";
      if (status) status.textContent = `Copied ${value} to the clipboard.`;
      window.setTimeout(() => {
        if (!button.isConnected) return;
        button.classList.remove("is-copied");
        label.textContent = "Copy";
      }, 1800);
    } catch {
      label.textContent = "Try again";
      if (status) status.textContent = `${value} could not be copied. Select it and copy it manually.`;
    }
  }

  function handleOrientationContentClick(event) {
    const copyButton = event.target.closest("[data-copy-value]");
    if (copyButton) {
      event.preventDefault();
      void copyCommunicationValue(copyButton);
      return;
    }

    const chapterLink = event.target.closest("[data-skills-day-start]");
    if (!chapterLink || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const content = event.currentTarget;
    const player = content.querySelector("#skills-day-player");
    const nowPlaying = content.querySelector(".skills-day-now-playing");
    if (!player || !nowPlaying) return;

    const seconds = chapterLink.dataset.skillsDayStart;
    const chapterTitle = chapterLink.dataset.skillsDayTitle;
    player.src = `${skillsDayVideo.embedUrl}&start=${seconds}&autoplay=1`;
    player.title = `${skillsDayVideo.title} — ${chapterTitle}`;
    content.querySelectorAll("[data-skills-day-start]").forEach((link) => link.removeAttribute("aria-current"));
    chapterLink.setAttribute("aria-current", "true");
    nowPlaying.textContent = `Now playing: ${chapterTitle} (${chapterLink.querySelector("span").textContent})`;
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
              <strong>{highlightSearchText(section.short, normalizedQuery)}</strong>
              <small>{highlightSearchText(section.descriptor, normalizedQuery)}</small>
            </button>
          ))}
        </nav>
      </section>

      <div className="orientation-results" aria-live="polite">
        <span>{normalizedQuery ? `${visibleSections.length} of ${sections.length} section tabs match “${query.trim()}” · ${visibleMatchCount} highlighted ${visibleMatchCount === 1 ? "match" : "matches"} in this section` : "Choose a section tab to change the field below"}</span>
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
              <span><strong>{highlightSearchText(activeSection.sourceLabel, normalizedQuery)}</strong><small>{highlightSearchText(activeSection.descriptor, normalizedQuery)}</small></span>
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
            <div
              className="orientation-content"
              ref={orientationContentRef}
              onClick={handleOrientationContentClick}
              dangerouslySetInnerHTML={activeSectionMarkup}
            />
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

function ZoomControl({ zoom, onZoomChange }) {
  const [open, setOpen] = useState(false);
  const currentIndex = zoomLevels.indexOf(zoom);

  useEffect(() => {
    if (!open) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className={`zoom-control${open ? " is-open" : ""}`}>
      <button
        className="zoom-trigger"
        type="button"
        aria-label={`Zoom page, currently ${zoom}%`}
        aria-expanded={open}
        aria-controls="zoom-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <ZoomIcon />
        <span>{zoom}%</span>
      </button>
      {open && (
        <div className="zoom-panel" id="zoom-panel" role="group" aria-label="Page zoom controls">
          <header><strong>Page zoom</strong><span>{zoom}%</span></header>
          <div>
            <button
              type="button"
              aria-label="Zoom out"
              disabled={currentIndex === 0}
              onClick={() => onZoomChange(zoomLevels[currentIndex - 1])}
            >−</button>
            <output aria-live="polite">{zoom}%</output>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={currentIndex === zoomLevels.length - 1}
              onClick={() => onZoomChange(zoomLevels[currentIndex + 1])}
            >+</button>
          </div>
          <button className="zoom-reset" type="button" disabled={zoom === 100} onClick={() => onZoomChange(100)}>Reset to 100%</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [zoom, setZoom] = useState(() => {
    const storedZoom = Number(window.localStorage.getItem(zoomStorageKey));
    return zoomLevels.includes(storedZoom) ? storedZoom : 100;
  });
  const isSedation = activeTab === "sedation";
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  useEffect(() => {
    window.localStorage.setItem(zoomStorageKey, String(zoom));
  }, [zoom]);

  return (
    <div className={`app-shell active-${activeTab}`}>
      <header className="site-header">
        <div className="brand" aria-label="DSA GI Resources">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}dsa-gi-logo.png`} alt="DSA GI logo" />
          <span><strong>DSA GI</strong><small>Resources</small></span>
        </div>
        <FolderTabs activeTab={activeTab} onChange={setActiveTab} />
        <ZoomControl zoom={zoom} onZoomChange={setZoom} />
      </header>

      <div
        className="page-zoom-surface"
        data-zoom={zoom}
        style={{ "--page-zoom": zoom / 100, "--page-zoom-width": `${10000 / zoom}%` }}
      >
        <div className="folder-sheet">
          {activeTab === "home" && <HomePage />}
          {activeTab === "sedation" && <CriteriaMatrix />}
          {activeTab === "coverage" && <CoveragePodlets />}
          {activeTab === "orientation" && <OrientationMaterials />}
        </div>

        <footer className="site-footer">
          <div><strong>DSA GI · Trust Your Gut</strong><span>{isSedation ? `Sedation Criteria · Revised ${POLICY_VERSION}` : activeTabLabel}</span></div>
          <p>The DSA Way · Physician-led, team-owned clinical operations.</p>
        </footer>
      </div>
    </div>
  );
}
