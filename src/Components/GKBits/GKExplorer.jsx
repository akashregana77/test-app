import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  FolderOpen,
  Folder,
  FileText,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";

const ICON_MAP = {
  trophy: "🏆",
  landmark: "🏛️",
  atom: "⚛️",
  cpu: "💻",
  "trending-up": "📈",
  leaf: "🌿",
  globe: "🌍",
};

/* ------------------------------------------------------------------ */
/*  Single GK Bit item                                                */
/* ------------------------------------------------------------------ */
function GKBitItem({ bit, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(bit.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const save = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onEdit(bit.id, trimmed);
    }
    setEditing(false);
  };

  const cancel = () => {
    setText(bit.text);
    setEditing(false);
  };

  return (
    <motion.div
      className="gk-bit-item"
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22 }}
    >
      <FileText size={14} className="gk-bit-icon" />

      {editing ? (
        <div className="gk-bit-edit-row">
          <input
            ref={inputRef}
            className="gk-bit-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
          />
          <button className="gk-bit-action-btn save" onClick={save} aria-label="Save">
            <Check size={14} />
          </button>
          <button className="gk-bit-action-btn cancel" onClick={cancel} aria-label="Cancel">
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <span className="gk-bit-text">{bit.text}</span>
          <div className="gk-bit-actions">
            <button
              className="gk-bit-action-btn"
              onClick={() => setEditing(true)}
              aria-label="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              className="gk-bit-action-btn delete"
              onClick={() => onDelete(bit.id)}
              aria-label="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category (folder)                                                 */
/* ------------------------------------------------------------------ */
function GKCategory({ category, onAddBit, onEditBit, onDeleteBit, onDeleteCategory }) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const addRef = useRef(null);

  useEffect(() => {
    if (adding && addRef.current) addRef.current.focus();
  }, [adding]);

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (trimmed) {
      onAddBit(category.id, trimmed);
      setNewText("");
    }
    setAdding(false);
  };

  const emoji = ICON_MAP[category.icon] || "📁";

  return (
    <motion.div
      className="gk-category"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, height: 0 }}
      transition={{ duration: 0.28 }}
    >
      {/* Category header */}
      <div className="gk-cat-header" onClick={() => setOpen((v) => !v)}>
        <motion.div
          className="gk-cat-chevron"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} />
        </motion.div>

        {open ? <FolderOpen size={18} className="gk-cat-folder-icon" /> : <Folder size={18} className="gk-cat-folder-icon" />}

        <span className="gk-cat-emoji">{emoji}</span>
        <span className="gk-cat-name">{category.name}</span>
        <span className="gk-cat-count">{category.bits.length}</span>

        <div className="gk-cat-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="gk-cat-action-btn"
            onClick={() => setAdding(true)}
            aria-label="Add GK Bit"
            title="Add GK Bit"
          >
            <Plus size={15} />
          </button>
          <button
            className="gk-cat-action-btn delete"
            onClick={() => onDeleteCategory(category.id)}
            aria-label="Delete category"
            title="Delete category"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Category content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="gk-cat-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <AnimatePresence>
              {category.bits.map((bit) => (
                <GKBitItem
                  key={bit.id}
                  bit={bit}
                  onEdit={(id, text) => onEditBit(category.id, id, text)}
                  onDelete={(id) => onDeleteBit(category.id, id)}
                />
              ))}
            </AnimatePresence>

            {/* Inline add field */}
            <AnimatePresence>
              {adding && (
                <motion.div
                  className="gk-bit-add-row"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus size={14} className="gk-bit-icon add-icon" />
                  <input
                    ref={addRef}
                    className="gk-bit-input"
                    placeholder="Type a GK bit..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd();
                      if (e.key === "Escape") { setAdding(false); setNewText(""); }
                    }}
                  />
                  <button className="gk-bit-action-btn save" onClick={handleAdd} aria-label="Add">
                    <Check size={14} />
                  </button>
                  <button className="gk-bit-action-btn cancel" onClick={() => { setAdding(false); setNewText(""); }} aria-label="Cancel">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!adding && category.bits.length === 0 && (
              <div className="gk-empty-cat">No entries yet</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main GK Explorer                                                  */
/* ------------------------------------------------------------------ */
function GKExplorer({
  selectedDate,
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddBit,
  onEditBit,
  onDeleteBit,
}) {
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const catInputRef = useRef(null);

  useEffect(() => {
    if (addingCat && catInputRef.current) catInputRef.current.focus();
  }, [addingCat]);

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (trimmed) {
      onAddCategory(trimmed);
      setNewCatName("");
    }
    setAddingCat(false);
  };

  const dateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="gk-explorer">
      {/* Header */}
      <div className="gk-explorer-header">
        <div className="gk-date-block">
          <h2 className="gk-date-title">{dateStr}</h2>
          {isToday && (
            <motion.span
              className="today-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              Today
            </motion.span>
          )}
        </div>
        <h1 className="gk-page-title">Daily GK Bits</h1>
        <div className="gk-header-meta">
          <span>{categories.length} categor{categories.length !== 1 ? "ies" : "y"}</span>
          <span className="meta-dot">·</span>
          <span>{categories.reduce((s, c) => s + c.bits.length, 0)} entries</span>
        </div>
      </div>

      {/* Add category button */}
      <div className="gk-add-category-bar">
        {addingCat ? (
          <motion.div
            className="gk-add-cat-row"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              ref={catInputRef}
              className="gk-cat-input"
              placeholder="Category name (e.g. Sports, Politics)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
                if (e.key === "Escape") { setAddingCat(false); setNewCatName(""); }
              }}
            />
            <button className="gk-bit-action-btn save" onClick={handleAddCategory}>
              <Check size={15} />
            </button>
            <button className="gk-bit-action-btn cancel" onClick={() => { setAddingCat(false); setNewCatName(""); }}>
              <X size={15} />
            </button>
          </motion.div>
        ) : (
          <button className="gk-add-cat-btn" onClick={() => setAddingCat(true)}>
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Categories (folders) */}
      <div className="gk-categories-list">
        <AnimatePresence>
          {categories.map((cat) => (
            <GKCategory
              key={cat.id}
              category={cat}
              onAddBit={onAddBit}
              onEditBit={onEditBit}
              onDeleteBit={onDeleteBit}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </AnimatePresence>

        {categories.length === 0 && (
          <motion.div
            className="gk-empty-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="gk-empty-icon">📚</div>
            <p className="gk-empty-title">No GK entries yet</p>
            <p className="gk-empty-sub">Add a category to start logging knowledge bits for this day.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default GKExplorer;
