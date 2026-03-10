import React, { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PanelLeftOpen,
  PanelLeftClose,
  BookPlus,
  FolderPlus,
  FilePlus,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import StorySidebar from "../Components/Story/StorySidebar";
import StoryEditor from "../Components/Story/StoryEditor";
import seedData from "../data/storyData.json";
import "./Story.css";

/* ── ID generator ──────────────────────── */
let nextId = 100;
const uid = () => ++nextId;

/* ── Hydrate JSON ids so they don't collide ── */
const hydrateIds = (data) =>
  data.map((book) => ({
    ...book,
    id: uid(),
    chapters: book.chapters.map((ch) => ({
      ...ch,
      id: uid(),
      pages: ch.pages.map((p) => ({ ...p, id: uid() })),
    })),
  }));

const INITIAL_BOOKS = hydrateIds(seedData);

function Story() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [activeBookId, setActiveBookId] = useState(INITIAL_BOOKS[0].id);
  const [activeChapterId, setActiveChapterId] = useState(
    INITIAL_BOOKS[0].chapters[0].id
  );
  const [activePageId, setActivePageId] = useState(
    INITIAL_BOOKS[0].chapters[0].pages[0].id
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const autoSaveRef = useRef(null);

  /*  namePrompt drives the animated input overlay.
      shape: { type: "book"|"chapter", bookId?: number } or null  */
  const [namePrompt, setNamePrompt] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const nameInputRef = useRef(null);

  /* confirmDelete drives the delete-confirmation modal.
     shape: { type: "book"|"chapter"|"page", bookId, chapterId?, pageId?, label } or null */
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* Auto-focus the input whenever prompt opens */
  useEffect(() => {
    if (namePrompt && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [namePrompt]);

  /* ── Derived active data ──────────────── */
  const activeBook = books.find((b) => b.id === activeBookId) || books[0];
  const activeChapter =
    activeBook?.chapters.find((c) => c.id === activeChapterId) ||
    activeBook?.chapters[0];
  const activePage =
    activeChapter?.pages.find((p) => p.id === activePageId) ||
    activeChapter?.pages[0];

  const content = activePage?.content || "";
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  /* ── Select page ──────────────────────── */
  const handleSelectPage = useCallback(
    (bookId, chapterId, pageId) => {
      setActiveBookId(bookId);
      setActiveChapterId(chapterId);
      setActivePageId(pageId);
      setSidebarOpen(false);
      setAutoSaved(false);
    },
    []
  );

  /* ── Content change + auto-save ───────── */
  const handleContentChange = useCallback(
    (value) => {
      setBooks((prev) =>
        prev.map((book) =>
          book.id !== activeBookId
            ? book
            : {
                ...book,
                chapters: book.chapters.map((ch) =>
                  ch.id !== activeChapterId
                    ? ch
                    : {
                        ...ch,
                        pages: ch.pages.map((p) =>
                          p.id !== activePageId
                            ? p
                            : { ...p, content: value }
                        ),
                      }
                ),
              }
        )
      );

      setAutoSaved(false);
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        setAutoSaved(true);
      }, 1500);
    },
    [activeBookId, activeChapterId, activePageId]
  );

  /* ── Manual save ──────────────────────── */
  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setAutoSaved(true);
    }, 600);
  }, []);

  /* ── Add Book ─────────────────────────── */
  const handleAddBook = useCallback(() => {
    setNameValue("");
    setNamePrompt({ type: "book" });
  }, []);

  /* Called when user confirms the book name */
  const confirmAddBook = useCallback(
    (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const bookId = uid();
      const chapterId = uid();
      const pageId = uid();
      const newBook = {
        id: bookId,
        title: trimmed,
        chapters: [
          {
            id: chapterId,
            title: "Chapter 1",
            pages: [{ id: pageId, title: "Page 1", content: "" }],
          },
        ],
      };
      setBooks((prev) => [...prev, newBook]);
      setActiveBookId(bookId);
      setActiveChapterId(chapterId);
      setActivePageId(pageId);
      setNamePrompt(null);
      setNameValue("");
    },
    []
  );

  /* ── Add Chapter ──────────────────────── */
  const handleAddChapter = useCallback((bookId) => {
    setNameValue("");
    setNamePrompt({ type: "chapter", bookId });
  }, []);

  /* Called when user confirms the chapter name */
  const confirmAddChapter = useCallback(
    (name, bookId) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const chapterId = uid();
      const pageId = uid();
      setBooks((prev) =>
        prev.map((book) => {
          if (book.id !== bookId) return book;
          const chapterNum = book.chapters.length + 1;
          return {
            ...book,
            chapters: [
              ...book.chapters,
              {
                id: chapterId,
                title: `Chapter ${chapterNum} — ${trimmed}`,
                pages: [{ id: pageId, title: "Page 1", content: "" }],
              },
            ],
          };
        })
      );
      setActiveBookId(bookId);
      setActiveChapterId(chapterId);
      setActivePageId(pageId);
      setNamePrompt(null);
      setNameValue("");
    },
    []
  );

  /* ── Add Page ─────────────────────────── */
  const handleAddPage = useCallback((bookId, chapterId) => {
    const pageId = uid();
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== bookId) return book;
        return {
          ...book,
          chapters: book.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            const pageNum = ch.pages.length + 1;
            return {
              ...ch,
              pages: [
                ...ch.pages,
                { id: pageId, title: `Page ${pageNum}`, content: "" },
              ],
            };
          }),
        };
      })
    );
    setActiveBookId(bookId);
    setActiveChapterId(chapterId);
    setActivePageId(pageId);
  }, []);

  /* ── Rename Book ───────────────────────── */
  const handleRenameBook = useCallback((bookId, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, title: trimmed } : book
      )
    );
  }, []);

  /* ── Rename Chapter ───────────────────── */
  const handleRenameChapter = useCallback((bookId, chapterId, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setBooks((prev) =>
      prev.map((book) =>
        book.id !== bookId
          ? book
          : {
              ...book,
              chapters: book.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, title: trimmed } : ch
              ),
            }
      )
    );
  }, []);

  /* ── Delete Page ──────────────────────── */
  const handleDeletePage = useCallback(
    (bookId, chapterId, pageId) => {
      setBooks((prev) => {
        const book = prev.find((b) => b.id === bookId);
        const chapter = book?.chapters.find((c) => c.id === chapterId);
        if (!chapter) return prev;

        // Last page → replace with a fresh blank page instead of removing
        if (chapter.pages.length <= 1) {
          const freshPageId = uid();
          setActivePageId(freshPageId);
          return prev.map((b) =>
            b.id !== bookId
              ? b
              : {
                  ...b,
                  chapters: b.chapters.map((ch) =>
                    ch.id !== chapterId
                      ? ch
                      : { ...ch, pages: [{ id: freshPageId, title: "Page 1", content: "" }] }
                  ),
                }
          );
        }

        // Normal case — remove the page
        const newPages = chapter.pages.filter((p) => p.id !== pageId);
        if (pageId === activePageId) {
          setActivePageId(newPages[0]?.id);
        }
        return prev.map((b) =>
          b.id !== bookId
            ? b
            : {
                ...b,
                chapters: b.chapters.map((ch) =>
                  ch.id !== chapterId ? ch : { ...ch, pages: newPages }
                ),
              }
        );
      });
    },
    [activePageId]
  );

  /* ── Request delete (shows confirmation modal) ── */
  const requestDeleteBook = useCallback(
    (bookId) => {
      const book = books.find((b) => b.id === bookId);
      if (!book) return;
      setConfirmDelete({ type: "book", bookId, label: book.title });
    },
    [books]
  );

  const requestDeleteChapter = useCallback(
    (bookId, chapterId) => {
      const book = books.find((b) => b.id === bookId);
      const chapter = book?.chapters.find((c) => c.id === chapterId);
      if (!chapter) return;
      setConfirmDelete({ type: "chapter", bookId, chapterId, label: chapter.title });
    },
    [books]
  );

  const requestDeletePage = useCallback(
    (bookId, chapterId, pageId) => {
      const book = books.find((b) => b.id === bookId);
      const chapter = book?.chapters.find((c) => c.id === chapterId);
      const page = chapter?.pages.find((p) => p.id === pageId);
      if (!page) return;
      setConfirmDelete({ type: "page", bookId, chapterId, pageId, label: page.title });
    },
    [books]
  );

  /* ── Confirm deletion ─────────────────── */
  const executeDelete = useCallback(() => {
    if (!confirmDelete) return;
    const { type, bookId, chapterId, pageId } = confirmDelete;

    if (type === "book") {
      setBooks((prev) => {
        const newBooks = prev.filter((b) => b.id !== bookId);
        if (bookId === activeBookId) {
          if (newBooks.length > 0) {
            const fallback = newBooks[0];
            setActiveBookId(fallback.id);
            setActiveChapterId(fallback.chapters[0]?.id);
            setActivePageId(fallback.chapters[0]?.pages[0]?.id);
          } else {
            setActiveBookId(null);
            setActiveChapterId(null);
            setActivePageId(null);
          }
        }
        return newBooks;
      });
    } else if (type === "chapter") {
      setBooks((prev) => {
        const book = prev.find((b) => b.id === bookId);
        if (!book) return prev;

        // Last chapter → replace with a fresh default chapter
        if (book.chapters.length <= 1) {
          const freshChId = uid();
          const freshPgId = uid();
          setActiveChapterId(freshChId);
          setActivePageId(freshPgId);
          return prev.map((b) =>
            b.id !== bookId
              ? b
              : {
                  ...b,
                  chapters: [
                    { id: freshChId, title: "Chapter 1", pages: [{ id: freshPgId, title: "Page 1", content: "" }] },
                  ],
                }
          );
        }

        const newChapters = book.chapters.filter((c) => c.id !== chapterId);
        if (chapterId === activeChapterId && newChapters.length > 0) {
          setActiveChapterId(newChapters[0].id);
          setActivePageId(newChapters[0].pages[0]?.id);
        }
        return prev.map((b) =>
          b.id === bookId ? { ...b, chapters: newChapters } : b
        );
      });
    } else if (type === "page") {
      handleDeletePage(bookId, chapterId, pageId);
    }

    setConfirmDelete(null);
  }, [confirmDelete, activeBookId, activeChapterId, handleDeletePage]);

  /* ── Close sidebar / dismiss prompt on Escape ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (confirmDelete) {
          setConfirmDelete(null);
        } else if (namePrompt) {
          setNamePrompt(null);
          setNameValue("");
        } else {
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [namePrompt]);

  return (
    <div className="story-page">
      <Navbar />

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="story-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="story-confirm-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="story-confirm-icon">
                <AlertTriangle size={28} />
              </div>
              <h3 className="story-confirm-title">
                Delete{" "}
                {confirmDelete.type === "book"
                  ? "Book"
                  : confirmDelete.type === "chapter"
                  ? "Chapter"
                  : "Page"}
                ?
              </h3>
              <p className="story-confirm-message">
                Are you sure you want to delete{" "}
                <strong>&ldquo;{confirmDelete.label}&rdquo;</strong>
                {confirmDelete.type === "book"
                  ? " and all its chapters and pages"
                  : confirmDelete.type === "chapter"
                  ? " and all its pages"
                  : ""}
                ? This action cannot be undone.
              </p>
              <div className="story-confirm-actions">
                <button
                  className="story-confirm-cancel"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="story-confirm-delete"
                  onClick={executeDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Animated name prompt overlay ── */}
      <AnimatePresence>
        {namePrompt && (
          <motion.div
            className="name-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => { setNamePrompt(null); setNameValue(""); }}
          >
            <motion.div
              className="name-prompt-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="name-prompt-header">
                <span className="name-prompt-icon">
                  {namePrompt.type === "book" ? (
                    <BookPlus size={20} />
                  ) : (
                    <FolderPlus size={20} />
                  )}
                </span>
                <h3>
                  {namePrompt.type === "book"
                    ? "Create New Book"
                    : "Add New Chapter"}
                </h3>
                <button
                  className="name-prompt-close"
                  onClick={() => { setNamePrompt(null); setNameValue(""); }}
                  aria-label="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="name-prompt-hint">
                {namePrompt.type === "book"
                  ? "Enter a name for your new book"
                  : "Enter a title for this chapter"}
              </p>
              <form
                className="name-prompt-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (namePrompt.type === "book") {
                    confirmAddBook(nameValue);
                  } else {
                    confirmAddChapter(nameValue, namePrompt.bookId);
                  }
                }}
              >
                <input
                  ref={nameInputRef}
                  type="text"
                  className="name-prompt-input"
                  placeholder={
                    namePrompt.type === "book"
                      ? "e.g. The Lost Kingdom"
                      : "e.g. The Journey Begins"
                  }
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  maxLength={80}
                  autoFocus
                />
                <div className="name-prompt-actions">
                  <button
                    type="button"
                    className="name-prompt-cancel"
                    onClick={() => { setNamePrompt(null); setNameValue(""); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="name-prompt-confirm"
                    disabled={!nameValue.trim()}
                  >
                    <Check size={15} />
                    <span>Create</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <button
        className={`story-mobile-toggle ${sidebarOpen ? "toggle-active" : ""}`}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
        <span className="toggle-label">
          {sidebarOpen ? "Close" : "Stories"}
        </span>
      </button>

      <div className="story-layout">
        {/* Sidebar overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="story-sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`story-sidebar ${sidebarOpen ? "story-sidebar--open" : ""}`}
        >
          <StorySidebar
            books={books}
            activePageId={activePageId}
            onSelectPage={handleSelectPage}
            onAddBook={handleAddBook}
            onAddChapter={handleAddChapter}
            onAddPage={handleAddPage}
            onDeletePage={requestDeletePage}
            onDeleteBook={requestDeleteBook}
            onDeleteChapter={requestDeleteChapter}
            onRenameBook={handleRenameBook}
            onRenameChapter={handleRenameChapter}
          />
        </aside>

        {/* Main workspace */}
        <main className="story-workspace">
          {activePage ? (
            <StoryEditor
              bookTitle={activeBook?.title || ""}
              chapterTitle={activeChapter?.title || ""}
              pageTitle={activePage?.title || ""}
              content={content}
              onChange={handleContentChange}
              onSave={handleSave}
              isSaving={isSaving}
              autoSaved={autoSaved}
              wordCount={wordCount}
            />
          ) : (
            <div className="story-empty-state">
              <BookPlus size={48} strokeWidth={1} />
              <h2>No page selected</h2>
              <p>Choose a page from the sidebar or create a new one to begin writing.</p>
            </div>
          )}

          {/* Quick action bar */}
          <div className="story-quick-actions">
            <button onClick={handleAddBook} title="New Book">
              <BookPlus size={20} />
              <span>Book</span>
            </button>
            <button
              onClick={() => handleAddChapter(activeBookId)}
              title="New Chapter"
            >
              <FolderPlus size={20} />
              <span>Chapter</span>
            </button>
            <button
              onClick={() =>
                handleAddPage(activeBookId, activeChapterId)
              }
              title="New Page"
            >
              <FilePlus size={20} />
              <span>Page</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Story;
