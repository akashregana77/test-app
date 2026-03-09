import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* Inline SVG Calendar Icon — no external deps */
const CalendarIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="calendar-icon-svg"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);

function CalendarSidebar({ selectedDate, onSelectDate, entriesDates, isOpen, onToggle, streak }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0);

  const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const selectedKey = toKey(selectedDate);
  const todayKey = toKey(today);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, inMonth: false, date: new Date(viewYear, viewMonth - 1, prevMonthDays - i) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, inMonth: true, date: new Date(viewYear, viewMonth, d) });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, inMonth: false, date: new Date(viewYear, viewMonth + 1, d) });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const goMonth = (delta) => {
    setDirection(delta);
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const goToday = () => {
    setDirection(0);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    onSelectDate(today);
  };

  const monthVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <>
      {/* Mobile floating toggle — inline SVG calendar icon */}
      <button
        className={`calendar-mobile-toggle ${isOpen ? "toggle-active" : ""}`}
        onClick={onToggle}
        aria-label="Toggle calendar"
      >
        <CalendarIcon size={18} />
        <span>Calendar</span>
      </button>

      {/* Mobile backdrop overlay via AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="calendar-overlay"
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <aside
        className={`calendar-sidebar ${isOpen ? "open" : ""}`}
      >
        {/* Streak counter */}
        {streak > 0 && (
          <motion.div
            className="streak-counter"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="streak-flame">🔥</span>
            <span className="streak-text">
              <strong>{streak}</strong> day{streak !== 1 ? "s" : ""} streak
            </span>
          </motion.div>
        )}

        <div className="calendar-header">
          <button className="cal-nav-btn" onClick={() => goMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={`${viewYear}-${viewMonth}`}
              className="cal-month-label"
              custom={direction}
              variants={monthVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {MONTHS[viewMonth]} {viewYear}
            </motion.span>
          </AnimatePresence>

          <button className="cal-nav-btn" onClick={() => goMonth(1)} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendar-grid">
          {DAYS.map((d) => (
            <div key={d} className="cal-day-name">{d}</div>
          ))}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`grid-${viewYear}-${viewMonth}`}
              className="cal-dates-wrapper"
              custom={direction}
              variants={monthVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22 }}
            >
              {calendarDays.map((cell, i) => {
                const key = toKey(cell.date);
                const isToday = key === todayKey;
                const isSelected = key === selectedKey;
                const hasEntry = entriesDates.has(key);

                return (
                  <motion.button
                    key={i}
                    className={[
                      "cal-date",
                      !cell.inMonth && "out-month",
                      isToday && "today",
                      isSelected && "selected",
                      hasEntry && "has-entry",
                    ].filter(Boolean).join(" ")}
                    onClick={() => onSelectDate(cell.date)}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {cell.day}
                    {hasEntry && <span className="entry-dot" />}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="cal-today-btn" onClick={goToday}>
          Today
        </button>

        {/* Sidebar stats */}
        <div className="sidebar-stats">
          <span className="sidebar-stat-label">Total entries</span>
          <span className="sidebar-stat-value">{entriesDates.size}</span>
        </div>
      </aside>
    </>
  );
}

export default CalendarSidebar;
