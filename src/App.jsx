import React from 'react'
import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/index.jsx';
import About from './pages/About.jsx';
import Notes from './pages/Notes.jsx';
import CursorTail from './CursorTail.jsx';
function App() {
  return (
    <div>
      <BrowserRouter>
        <CursorTail />
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/about' element={<About />} />
          <Route path='/notes' element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
