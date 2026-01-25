import React from 'react'
import "./Index.css"
import Navbar from "./Navbar";
function Index() {
  const features = [
    { title: "Notes", description: "Capture quick thoughts, ideas, and reminders. Organize with pins and search." },
    { title: "Diary", description: "Reflect on your day with personal journal entries. One moment at a time." },
    { title: "Story Writing", description: "Let your creativity flow. Write long-form stories and narratives." },
  ];

  return (
    <div className="index-page">
      <Navbar />

      <div className="main-section">
        <div className="main-first">
          <h1>Write Freely. Remember</h1>
          <h1>Everything.</h1>
          <h5>One shortcut for all your thoughts. Notes for quick ideas, diary for daily</h5>
          <h5>reflections, and stories for your creative journey.</h5>
          <div className="main-first-btns">
            <button>Start Writing</button>
            <button>Learn More</button>
          </div>
        </div>

        <div className="main-second">
          <h1>choose your canvas</h1>
          <div className="cards">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <hr />
        <div className="footer">
          <p>© 2026 ShortCut. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Index