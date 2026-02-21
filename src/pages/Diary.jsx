import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/Navbar/Navbar";
import CalendarSidebar from "../Components/Diary/CalendarSidebar";
import DiaryEditor from "../Components/Diary/DiaryEditor";
import SkeletonLoader from "../Components/Diary/SkeletonLoader";
import Toast from "../Components/Diary/Toast";
import ConfirmModal from "../Components/Diary/ConfirmModal";
import "./Diary.css";

const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Dummy seed entries
const SEED_ENTRIES = {
  [toKey(new Date())]: "Today was a productive day. I made progress on the journaling app and learned about framer-motion animations.",
  [toKey(new Date(Date.now() - 86400000))]: "Spent the afternoon reading about React patterns. The compound component pattern is really elegant.",
  [toKey(new Date(Date.now() - 86400000 * 3))]: "Had a great brainstorming session. Several new feature ideas for the app. Need to prioritize them tomorrow.",
  [toKey(new Date(Date.now() - 86400000 * 7))]: "Reflecting on this week — shipped two features and fixed a tricky CSS grid issue. Feeling accomplished.",
};

function Diary() {
  const [entries, setEntries] = useState(SEED_ENTRIES);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toastIdRef = useRef(0);
  const autoSaveTimerRef = useRef(null);

  const currentKey = toKey(selectedDate);
  const currentContent = entries[currentKey] || "";

  // Simulated loading on mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Set of date keys that have entries
  const entriesDates = new Set(Object.keys(entries).filter((k) => entries[k].trim()));

  // Toast helper
  const addToast = useCallback((message, type = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Content change with auto-save simulation
  const handleChange = useCallback(
    (value) => {
      setEntries((prev) => ({ ...prev, [currentKey]: value }));

      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        // Auto-save simulation — already in state
      }, 1500);
    },
    [currentKey]
  );

  // Save action
  const handleSave = useCallback(() => {
    if (!currentContent.trim()) {
      addToast("Nothing to save — write something first.", "warning");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast("Entry saved successfully!", "success");
    }, 900);
  }, [currentContent, addToast]);

  // Clear action
  const handleClear = useCallback(() => {
    setEntries((prev) => ({ ...prev, [currentKey]: "" }));
    addToast("Editor cleared.", "info");
  }, [currentKey, addToast]);

  // Delete actions
  const handleDeleteRequest = useCallback(() => {
    if (!currentContent.trim()) {
      addToast("No entry to delete.", "warning");
      return;
    }
    setDeleteModal(true);
  }, [currentContent, addToast]);

  const handleDeleteConfirm = useCallback(() => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[currentKey];
      return next;
    });
    setDeleteModal(false);
    addToast("Entry deleted.", "success");
  }, [currentKey, addToast]);

  // Date selection
  const handleSelectDate = useCallback((date) => {
    setSelectedDate(date);
    setSidebarOpen(false);
  }, []);

  return (
    <motion.div
      className="diary-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="diary-layout">
        <CalendarSidebar
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          entriesDates={entriesDates}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />

        <main className="diary-main">
          <AnimatePresence mode="wait">
            {loading ? (
              <SkeletonLoader key="skeleton" />
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentContent || true ? (
                  <DiaryEditor
                    selectedDate={selectedDate}
                    content={currentContent}
                    onChange={handleChange}
                    onSave={handleSave}
                    onClear={handleClear}
                    onDelete={handleDeleteRequest}
                    isSaving={isSaving}
                  />
                ) : null}

                {!currentContent && (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="empty-icon">📝</div>
                    <p className="empty-title">No entry yet</p>
                    <p className="empty-sub">Start writing to capture this day.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      <ConfirmModal
        open={deleteModal}
        title="Delete Entry"
        message="Are you sure you want to delete this diary entry? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(false)}
      />
    </motion.div>
  );
}

export default Diary;
