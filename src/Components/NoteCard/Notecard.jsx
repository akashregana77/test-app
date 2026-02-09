import React, { useRef } from "react";
import "./Notecard.css";

function Notecard({ title, content, pinned, onEdit, onDelete, onPin }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--glow-x', `${x}%`);
    el.style.setProperty('--glow-y', `${y}%`);
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.removeProperty('--glow-x');
    el.style.removeProperty('--glow-y');
  };

  return (
    <div
      ref={cardRef}
      className="note-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="note-head">
        <div>
          <p className="eyebrow">{pinned ? "Pinned" : "Note"}</p>
          <h3>{title}</h3>
        </div>
        <div className="card-actions">
          <button className="icon ghost" onClick={onPin} title={pinned ? "Unpin" : "Pin to top"}>
            {pinned ? "★" : "☆"}
          </button>
          <button className="icon ghost" onClick={onEdit} title="Edit note">✎</button>
          <button className="icon danger" onClick={onDelete} title="Delete note">✕</button>
        </div>
      </div>
      <p className="note-body">{content}</p>
    </div>
  )
}

export default Notecard;
