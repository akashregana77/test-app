import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  Folder,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";

const StorySidebar = ({
  books,
  activePageId,
  onSelectPage,
  onAddBook,
  onAddChapter,
  onAddPage,
  onDeletePage,
  onDeleteBook,
  onDeleteChapter,
  onRenameBook,
  onRenameChapter,
}) => {
  const [expanded, setExpanded] = useState({});

  /* editing: { type: "book"|"chapter", bookId, chapterId? } or null */
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef(null);

  /* Focus + select all when inline edit opens */
  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editing]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: prev[id] === undefined ? false : !prev[id] }));
  };

  const startEditBook = (book) => {
    setEditing({ type: "book", bookId: book.id });
    setEditValue(book.title);
  };

  const startEditChapter = (bookId, chapter) => {
    setEditing({ type: "chapter", bookId, chapterId: chapter.id });
    setEditValue(chapter.title);
  };

  const commitEdit = () => {
    if (!editing) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      if (editing.type === "book") {
        onRenameBook(editing.bookId, trimmed);
      } else {
        onRenameChapter(editing.bookId, editing.chapterId, trimmed);
      }
    }
    setEditing(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div className="story-sidebar-inner">
      {/* Header */}
      <div className="story-sidebar-header">
        <BookOpen size={18} className="story-sidebar-header-icon" />
        <span>Explorer</span>
        <button
          className="story-sidebar-add-btn"
          onClick={onAddBook}
          title="New Book"
          aria-label="Add new book"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Tree */}
      <nav className="story-tree" aria-label="Story navigation">
        {books.map((book) => {
          const bookExpanded = expanded[book.id] !== false;
          return (
            <div className="story-tree-book" key={book.id}>
              <button
                className="story-tree-item story-tree-book-btn"
                onClick={() => toggleExpand(book.id)}
                aria-expanded={bookExpanded}
              >
                <span className="story-tree-toggle">
                  {bookExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </span>
                <BookOpen size={15} className="story-tree-icon book-icon" />

                {/* Inline edit or label */}
                {editing?.type === "book" && editing.bookId === book.id ? (
                  <span
                    className="story-inline-edit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      ref={editInputRef}
                      className="story-inline-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={commitEdit}
                      maxLength={80}
                    />
                  </span>
                ) : (
                  <span
                    className="story-tree-label"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      startEditBook(book);
                    }}
                    title="Double-click to rename"
                  >
                    {book.title}
                  </span>
                )}
                <span
                  className="story-tree-action"
                  role="button"
                  tabIndex={0}
                  title="Add Chapter"
                  aria-label={`Add chapter to ${book.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChapter(book.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      onAddChapter(book.id);
                    }
                  }}
                >
                  <Plus size={16} />
                </span>
                <span
                  className="story-tree-action danger"
                  role="button"
                  tabIndex={0}
                  title="Delete Book"
                  aria-label={`Delete ${book.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBook(book.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      onDeleteBook(book.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {bookExpanded && (
                  <motion.div
                    className="story-tree-children"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {book.chapters.map((chapter) => {
                      const chKey = `${book.id}-${chapter.id}`;
                      const chExpanded = expanded[chKey] !== false;
                      return (
                        <div className="story-tree-chapter" key={chapter.id}>
                          <button
                            className="story-tree-item story-tree-chapter-btn"
                            onClick={() => toggleExpand(chKey)}
                            aria-expanded={chExpanded}
                          >
                            <span className="story-tree-toggle">
                              {chExpanded ? (
                                <ChevronDown size={13} />
                              ) : (
                                <ChevronRight size={13} />
                              )}
                            </span>
                            {chExpanded ? (
                              <FolderOpen
                                size={14}
                                className="story-tree-icon chapter-icon"
                              />
                            ) : (
                              <Folder
                                size={14}
                                className="story-tree-icon chapter-icon"
                              />
                            )}

                            {/* Inline edit or label */}
                            {editing?.type === "chapter" &&
                            editing.bookId === book.id &&
                            editing.chapterId === chapter.id ? (
                              <span
                                className="story-inline-edit"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  ref={editInputRef}
                                  className="story-inline-input"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={handleEditKeyDown}
                                  onBlur={commitEdit}
                                  maxLength={80}
                                />
                              </span>
                            ) : (
                              <span
                                className="story-tree-label"
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  startEditChapter(book.id, chapter);
                                }}
                                title="Double-click to rename"
                              >
                                {chapter.title}
                              </span>
                            )}
                            <span
                              className="story-tree-action"
                              role="button"
                              tabIndex={0}
                              title="Add Page"
                              aria-label={`Add page to ${chapter.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddPage(book.id, chapter.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                  onAddPage(book.id, chapter.id);
                                }
                              }}
                            >
                              <Plus size={15} />
                            </span>
                            <span
                              className="story-tree-action danger"
                              role="button"
                              tabIndex={0}
                              title="Delete Chapter"
                              aria-label={`Delete ${chapter.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChapter(book.id, chapter.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                  onDeleteChapter(book.id, chapter.id);
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {chExpanded && (
                              <motion.div
                                className="story-tree-children"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.18,
                                  ease: "easeInOut",
                                }}
                              >
                                {chapter.pages.map((page) => {
                                  const isActive =
                                    activePageId === page.id;
                                  return (
                                    <button
                                      key={page.id}
                                      className={`story-tree-item story-tree-page-btn${
                                        isActive ? " active" : ""
                                      }`}
                                      onClick={() =>
                                        onSelectPage(
                                          book.id,
                                          chapter.id,
                                          page.id
                                        )
                                      }
                                    >
                                      <FileText
                                        size={13}
                                        className="story-tree-icon page-icon"
                                      />
                                      <span className="story-tree-label">
                                        {page.title}
                                      </span>
                                      <span
                                        className="story-tree-action danger"
                                        role="button"
                                        tabIndex={0}
                                        title="Delete Page"
                                        aria-label={`Delete ${page.title}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeletePage(
                                            book.id,
                                            chapter.id,
                                            page.id
                                          );
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.stopPropagation();
                                            onDeletePage(
                                              book.id,
                                              chapter.id,
                                              page.id
                                            );
                                          }
                                        }}
                                      >
                                        <Trash2 size={12} />
                                      </span>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default StorySidebar;
