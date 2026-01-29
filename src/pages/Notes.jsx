import React, { useState } from 'react'
import "./Notes.css"
import Navbar from "../Components/Navbar/Navbar";
import SearchBar from '../Components/SeachBar/SearchBar';
function Notes() {
  const [query, setQuery] = useState("");

  return (
    <div>
        <Navbar />
        <div className='main'>
            <div className='top-bar'>
                <p>Notes</p>
                <SearchBar
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  handleSearch={() => {
                    console.log("search", query);
                  }}
                />
            </div>

        </div>
    </div>
  )
}

export default Notes
