import React, { useMemo, useState } from "react";
import "./Notes.css";
import Navbar from "../Components/Navbar/Navbar";
import SearchBar from "../Components/SeachBar/SearchBar";
import Notecard from "../Components/NoteCard/Notecard";

function Notes() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState([
    { id: 1, title: "Grocery List", content: "Milk, Eggs, Bread, Butter", pinned: false },
    { id: 2, title: "Meeting Notes", content: "Discuss project timeline and deliverables.", pinned: true },
    { id: 3, title: "Ideas", content: "Start a blog about tech trends.", pinned: false },
    { id: 4, title: "Books to Read", content: "1984 by George Orwell, Sapiens by Yuval Noah Harari.", pinned: false },
    { id: 5, title: "Travel Plans", content: "Visit Japan in spring for cherry blossoms.", pinned: false },
    { id: 6, title: "Workout Routine", content: "Monday: Cardio, Wednesday: Strength Training, Friday: Yoga.Monday: Cardio, Wednesday: Strength Training, Friday: Yoga.Monday: Cardio, Wednesday: Strength Training, Friday: Yoga.Monday: Cardio, Wednesday: Strength Training, Friday: Yoga.", pinned: false },
  ]);

  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    return sorted.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [notes, query]);

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleEdit = (id) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const title = window.prompt("Edit title", target.title) ?? target.title;
    const content = window.prompt("Edit description", target.content) ?? target.content;
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, content } : n)));
  };

  const handlePin = (id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  return (
    <div>
      <Navbar />
      <div className="main">
        <div className="top-bar">
          <div className="title-block">
            <p>Notes</p>
            <span className="muted">Organize, pin, and refine quickly.</span>
          </div>
          <div className="top-actions">
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              handleSearch={() => {
                console.log("search", query);
              }}
            />
          </div>
        </div>

        <div className="note-grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Notecard
                key={note.id}
                title={note.title}
                content={note.content}
                pinned={note.pinned}
                onDelete={() => handleDelete(note.id)}
                onEdit={() => handleEdit(note.id)}
                onPin={() => handlePin(note.id)}
              />
            ))
          ) : (
            <p className="muted">No notes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
