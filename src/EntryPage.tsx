import React, { useEffect } from "react";
import "./EntryPage.css";
import { Github, Linkedin, Instagram, Globe } from "lucide-react"; 

interface EntryPageProps {
  onStart: () => void;
}

const EntryPage: React.FC<EntryPageProps> = ({ onStart }) => {
  // Enhanced sparkle effect
  useEffect(() => {
    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";
      
      // Random size and color
      const size = Math.random() * 6 + 4;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      
      // Random color from a curated palette
      const colors = ["#FFD700", "#4ECDC4", "#FF6B6B", "#7E57C2", "#FFFFFF"];
      sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.97) createSparkle(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="entry-body">
      {/* Enhanced floating background letters */}
      <div className="floating-letters letter-1">S</div>
      <div className="floating-letters letter-2">C</div>
      <div className="floating-letters letter-3">R</div>
      <div className="floating-letters letter-4">A</div>
      <div className="floating-letters letter-5">B</div>
      <div className="floating-letters letter-6">B</div>
      <div className="floating-letters letter-7">L</div>
      <div className="floating-letters letter-8">E</div>

      <div className="entry-container">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-letter">S</span>
            <span className="logo-letter">P</span>
          </div>
        </div>

        <h1 className="app-title">Scrabble Puzzle</h1>
        <p className="app-subtitle">
          Challenge your word skills and expand your vocabulary
        </p>

        {/* Enhanced Creator Info */}
        <div className="creator-info">
          <div className="creator-label">Created by</div>
          <div className="creator-name">Mohamed Ghoul</div>
          <div className="creator-title">Full-Stack JS Developer</div>
        </div>

        {/* Enhanced Social Links */}
        <div className="social-links">
          <a
            href="https://www.instagram.com/mohavvvvd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/mohamed-ghoul-224982287"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-link"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://github.com/mohavvvvd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-link"
          >
            <Github size={20} />
          </a>
          <a
            href="https://mohavvvvd.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            className="social-link"
          >
            <Globe size={20} />
          </a>
        </div>

        {/* Enhanced Start Button */}
        <button className="start-button" onClick={onStart}>
          <span className="button-icon">🎮</span>
          <span className="button-text">Start Playing</span>
        </button>

        {/* Copyright */}
        <div className="copyright">
          &copy; {new Date().getFullYear()} Mohamed Ghoul. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default EntryPage;