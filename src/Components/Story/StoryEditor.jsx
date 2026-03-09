import React, { useRef, useEffect } from "react";
import { Save, CheckCircle, Loader } from "lucide-react";

const StoryEditor = ({
  bookTitle,
  chapterTitle,
  pageTitle,
  content,
  onChange,
  onSave,
  isSaving,
  autoSaved,
  wordCount,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [pageTitle]);

  return (
    <div className="story-editor">
      {/* Breadcrumb header */}
      <div className="story-editor-header">
        <div className="story-editor-breadcrumb">
          <span className="breadcrumb-book">{bookTitle}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-chapter">{chapterTitle}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-page">{pageTitle}</span>
        </div>
        <div className="story-editor-status">
          {isSaving ? (
            <span className="status-saving">
              <Loader size={14} className="spin" />
              Saving…
            </span>
          ) : autoSaved ? (
            <span className="status-saved">
              <CheckCircle size={14} />
              Saved
            </span>
          ) : null}
          <span className="word-count">{wordCount} words</span>
          <button
            className="story-save-btn"
            onClick={onSave}
            disabled={isSaving}
            title="Save Story"
          >
            <Save size={15} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Writing area */}
      <div className="story-editor-body">
        <textarea
          ref={textareaRef}
          className="story-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Begin writing your story…"
          spellCheck
          aria-label="Story content editor"
        />
      </div>
    </div>
  );
};

export default StoryEditor;
