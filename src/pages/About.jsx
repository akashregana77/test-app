import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../Components/Navbar/Navbar";
import "./About.css";

function About() {
  const features = [
    {
      title: "Notes & To-Dos",
      summary: "Capture, prioritize, and revisit everything without clutter.",
      bullets: [
        "Pin essentials, group by boards, and search in milliseconds.",
        "Inline to‑dos with quick checkmarks keep momentum high.",
        "Edit effortlessly with a keyboard-first flow and graceful autosave.",
      ],
      badge: "Fluid editor",
      tone: "purple",
      lottie: "https://lottie.host/52bb78d4-8aac-4250-9bbb-c853a3e409ac/DEY3U2f8wC.lottie",
    },
    {
      title: "Diary with Depth",
      summary: "Reflect with calm, guided prompts, and cinematic playback.",
      bullets: [
        "3D page-flip reading mode makes memories feel tangible.",
        "Mood tags and streaks help you notice patterns over time.",
        "Private-by-default with optional vault locking.",
      ],
      badge: "3D reading",
      tone: "teal",
      lottie: "https://lottie.host/580ac815-0796-4a3c-bb3a-90c351feb8a6/14moPS62jG.lottie",
    },
    {
      title: "Story Studio",
      summary: "Draft scenes, storyboard arcs, and generate visuals instantly.",
      bullets: [
        "Scene cards with beats, pacing, and character voice notes.",
        "AI image bursts from your script keep imagination flowing.",
        "Distraction-free focus mode with ambient cues.",
      ],
      badge: "Auto visuals",
      tone: "purple",
      lottie: "https://lottie.host/57ff4b7b-492a-4036-83ca-d657fd9b3997/WaFU2Ftr82.lottie",
    },
  ];

  return (
    <div className="about-page">
      <Navbar />

      <header className="about-hero">
        <div className="about-hero__glow"></div>
        <p className="eyebrow">Built for thinkers, writers, doers</p>
        <h1>Everything you write deserves a beautiful home.</h1>
        <p className="lede">
          ShortCut keeps notes actionable, diaries immersive, and stories cinematic, so
          your ideas travel from spark to finished page without friction.
        </p>
        {/* <div className="hero-metrics">
          <div className="metric">
            <span className="metric__number">3</span>
            <span className="metric__label">dedicated canvases</span>
          </div>
          <div className="metric">
            <span className="metric__number">0.2s</span>
            <span className="metric__label">avg search time</span>
          </div>
          <div className="metric">
            <span className="metric__number">24/7</span>
            <span className="metric__label">secure sync</span>
          </div>
        </div> */}
      </header>

      <section className="about-sections">
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            className={`about-block ${index % 2 === 1 ? "about-block--flip" : ""}`}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.35 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
          >
            <motion.div
              className={`about-visual about-visual--${feature.tone}`}
              initial={{ opacity: 0, x: index % 2 === 1 ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1], delay: 0.12 + index * 0.08 }}
            >
              {feature.lottie ? (
                <div className="about-lottie" aria-hidden="true">
                  <DotLottieReact
                    src={feature.lottie}
                    loop
                    autoplay
                    speed={1}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ) : (
                <span className="about-icon" aria-hidden="true">
                  {feature.icon}
                </span>
              )}
              <span className="about-badge">{feature.badge}</span>
              <div className="about-orb" aria-hidden="true"></div>
              <div className="about-gridlines" aria-hidden="true"></div>
            </motion.div>

            <motion.div
              className="about-copy"
              initial={{ opacity: 0, x: index % 2 === 1 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1], delay: 0.16 + index * 0.08 }}
            >
              <p className="eyebrow">Crafted experience</p>
              <h2>{feature.title}</h2>
              <p className="summary">{feature.summary}</p>
              <ul>
                {feature.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}

export default About;
