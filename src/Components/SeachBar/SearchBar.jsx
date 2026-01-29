import React from 'react'
import "./SearchBar.css"

const SearchBar = ({ value, onChange, handleSearch }) => {
  return (
    <div className="search" role="search">
      <div className="search__field">

        <input
          className="search__input"
          type="text"
          placeholder="Search notes"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && handleSearch) handleSearch();
          }}
        />
      </div>

      {handleSearch && (
        <button
          type="button"
          className="search__button"
          onClick={handleSearch}
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar
