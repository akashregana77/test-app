import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Trash2, Eraser, Loader2 } from "lucide-react";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function DiaryEditor({ selectedDate, content, onChange, onSave, onClear, onDelete, isSaving }) {
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

  // Word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

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
        </div>
      </div>

      {/* Textarea */}
      <div className={`editor-textarea-wrap ${focused ? "focused" : ""}`}>
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

      {/* Auto-save indicator */}
      <AnimatePresence>
        {content && !isSaving && (
          <motion.div
            className="autosave-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="autosave-dot" />
            Auto-saved
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default DiaryEditor;
