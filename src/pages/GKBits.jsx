import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/Navbar/Navbar";
import CalendarSidebar from "../Components/Diary/CalendarSidebar";
import Toast from "../Components/Diary/Toast";
import ConfirmModal from "../Components/Diary/ConfirmModal";
import GKExplorer from "../Components/GKBits/GKExplorer";
import SEED_GK from "../data/gkData.json";
import "./GKBits.css";

const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

let _uid = 100;
const uid = () => `gk-${++_uid}`;

function GKBits() {
  const [data, setData] = useState(SEED_GK);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null); // { type, catId, bitId }
  const toastIdRef = useRef(0);

  const currentKey = toKey(selectedDate);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Dates that have entries
  const entriesDates = useMemo(() => {
    const s = new Set();
    Object.keys(data).forEach((k) => {
      const cats = data[k]?.categories;
      if (cats && cats.length > 0) s.add(k);
    });
    return s;
  }, [data]);

  // Streak
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    if (!entriesDates.has(toKey(d))) d.setDate(d.getDate() - 1);
    while (entriesDates.has(toKey(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [entriesDates]);

  // Current day's categories
  const currentCategories = useMemo(
    () => data[currentKey]?.categories || [],
    [data, currentKey]
  );

  // Toast helper
  const addToast = useCallback((message, type = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Date selection
  const handleSelectDate = useCallback((date) => {
    setSelectedDate(date);
    setSidebarOpen(false);
  }, []);

  // --- CRUD Helpers ---

  const updateCategories = useCallback(
    (updater) => {
      setData((prev) => {
        const day = prev[currentKey] || { categories: [] };
        return {
          ...prev,
          [currentKey]: {
            ...day,
            categories: updater(day.categories || []),
          },
        };
      });
    },
    [currentKey]
  );

  // Add category
  const handleAddCategory = useCallback(
    (name) => {
      updateCategories((cats) => [
        ...cats,
        { id: uid(), name, icon: "folder", bits: [] },
      ]);
      addToast(`Category "${name}" added.`, "success");
    },
    [updateCategories, addToast]
  );

  // Delete category (with confirm)
  const handleDeleteCategoryRequest = useCallback((catId) => {
    setDeleteModal({ type: "category", catId });
  }, []);

  const handleDeleteCategoryConfirm = useCallback(() => {
    if (!deleteModal) return;
    updateCategories((cats) => cats.filter((c) => c.id !== deleteModal.catId));
    addToast("Category deleted.", "success");
    setDeleteModal(null);
  }, [deleteModal, updateCategories, addToast]);

  // Add bit
  const handleAddBit = useCallback(
    (catId, text) => {
      updateCategories((cats) =>
        cats.map((c) =>
          c.id === catId
            ? { ...c, bits: [...c.bits, { id: uid(), text }] }
            : c
        )
      );
      addToast("GK bit added.", "success");
    },
    [updateCategories, addToast]
  );

  // Edit bit
  const handleEditBit = useCallback(
    (catId, bitId, text) => {
      updateCategories((cats) =>
        cats.map((c) =>
          c.id === catId
            ? {
                ...c,
                bits: c.bits.map((b) => (b.id === bitId ? { ...b, text } : b)),
              }
            : c
        )
      );
      addToast("GK bit updated.", "info");
    },
    [updateCategories, addToast]
  );

  // Delete bit
  const handleDeleteBit = useCallback(
    (catId, bitId) => {
      updateCategories((cats) =>
        cats.map((c) =>
          c.id === catId
            ? { ...c, bits: c.bits.filter((b) => b.id !== bitId) }
            : c
        )
      );
      addToast("GK bit removed.", "success");
    },
    [updateCategories, addToast]
  );

  return (
    <motion.div
      className="gk-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="gk-layout">
        <CalendarSidebar
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          entriesDates={entriesDates}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          streak={streak}
        />

        <main className="gk-main">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="gk-skeleton"
                className="gk-skeleton-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="skel gk-skel-title" />
                <div className="skel gk-skel-subtitle" />
                <div className="skel gk-skel-block" />
                <div className="skel gk-skel-block short" />
                <div className="skel gk-skel-block" />
              </motion.div>
            ) : (
              <motion.div
                key="gk-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GKExplorer
                  selectedDate={selectedDate}
                  categories={currentCategories}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategoryRequest}
                  onAddBit={handleAddBit}
                  onEditBit={handleEditBit}
                  onDeleteBit={handleDeleteBit}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      <ConfirmModal
        open={!!deleteModal}
        title="Delete Category"
        message="Are you sure you want to delete this category and all its GK bits? This cannot be undone."
        onConfirm={handleDeleteCategoryConfirm}
        onCancel={() => setDeleteModal(null)}
      />
    </motion.div>
  );
}

export default GKBits;
