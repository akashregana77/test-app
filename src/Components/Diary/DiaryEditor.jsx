import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Trash2, Eraser, Loader2 } from "lucide-react";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "😔", label: "Sad" },
  { emoji: "🔥", label: "Energized" },
];

function DiaryEditor({ selectedDate, content, onChange, onSave, onClear, onDelete, isSaving, mood, onMoodChange, showSaveSuccess, isTyping }) {
  const textareaRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const today = new Date();
  const isToday =
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate();

  const dateString = `${WEEKDAYS[selectedDate.getDay()]}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.max(ta.scrollHeight, 240) + "px";
    }
  }, [content]);

  // Word count, char count, reading time
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Keyboard shortcut (Ctrl/Cmd + S)
  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      onSave();
    }
  }, [onSave]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.section
      className="diary-editor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {/* Date header */}
      <div className="editor-header">
        <AnimatePresence mode="wait">
          <motion.div
            key={dateString}
            className="editor-date-block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="editor-date">{dateString}</h2>
            {isToday && (
              <motion.span
                className="today-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                Today
              </motion.span>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="editor-meta">
          <span>{wordCount} words</span>
          <span className="meta-dot">·</span>
          <span>{charCount} chars</span>
          <span className="meta-dot">·</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Mood picker */}
      <div className="mood-picker">
        <span className="mood-label">How are you feeling?</span>
        <div className="mood-options">
          {MOODS.map((m) => (
            <motion.button
              key={m.emoji}
              className={`mood-btn ${mood === m.emoji ? "mood-active" : ""}`}
              onClick={() => onMoodChange(mood === m.emoji ? "" : m.emoji)}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              title={m.label}
            >
              <span className="mood-emoji">{m.emoji}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className={`editor-textarea-wrap ${focused ? "focused" : ""} ${isTyping ? "typing" : ""}`}>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          placeholder="Write your thoughts for today..."
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck
        />
        {/* Keyboard shortcut hint */}
        <AnimatePresence>
          {focused && !content && (
            <motion.div
              className="shortcut-hint"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <kbd>{navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}</kbd>
              <span>+</span>
              <kbd>S</kbd>
              <span className="shortcut-hint-text">to save</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="editor-actions">
        <motion.button
          className="editor-btn save-btn"
          onClick={onSave}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04, y: -1 }}
          disabled={isSaving}
        >
          {isSaving ? (
            <motion.span
              className="btn-loader"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            >
              <Loader2 size={16} />
            </motion.span>
          ) : (
            <Save size={16} />
          )}
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </motion.button>

        <motion.button
          className="editor-btn clear-btn"
          onClick={onClear}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04, y: -1 }}
          disabled={!content}
        >
          <Eraser size={16} />
          <span>Clear</span>
        </motion.button>

        <motion.button
          className="editor-btn delete-btn"
          onClick={onDelete}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04, y: -1 }}
          disabled={!content}
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </motion.button>
      </div>

      {/* Save success floating checkmark */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            className="save-success-overlay"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="save-check-svg">
              <motion.circle
                cx="24" cy="24" r="22"
                stroke="var(--accent)"
                strokeWidth="2"
                fill="rgba(249, 115, 22, 0.08)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <motion.path
                d="M14 24l7 7 13-13"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-save indicator — typing-aware */}
      <AnimatePresence>
        {content && !isSaving && (
          <motion.div
            className={`autosave-indicator ${isTyping ? "typing-active" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className={`autosave-dot ${isTyping ? "dot-typing" : ""}`} />
            {isTyping ? "Typing..." : "Auto-saved"}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default DiaryEditor;
