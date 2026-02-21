import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function CalendarSidebar({ selectedDate, onSelectDate, entriesDates, isOpen, onToggle }) {
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
      {/* Mobile toggle */}
      <button className="calendar-mobile-toggle" onClick={onToggle} aria-label="Toggle calendar">
        <Calendar size={20} />
        <span>{MONTHS[viewMonth].slice(0, 3)} {viewYear}</span>
      </button>

      <motion.aside
        className={`calendar-sidebar ${isOpen ? "open" : ""}`}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
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

        {/* Sidebar overlay for mobile */}
        {isOpen && <div className="calendar-overlay" onClick={onToggle} />}
      </motion.aside>
    </>
  );
}

export default CalendarSidebar;
