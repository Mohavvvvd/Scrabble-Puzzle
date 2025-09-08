import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import { Github, Linkedin, Instagram, Globe, RefreshCw, Trophy, HelpCircle } from "lucide-react";

// Scrabble letter points
const LETTER_POINTS: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const NUM_WORDS = 5;

interface SelectedLetter {
  letter: string;
  index: number;
}

interface ScrabbleTileProps {
  letter: string;
  isPlaced: boolean;
  isShaking: boolean;
  onClick: () => void;
  positionKey: string;
}

interface LetterButtonProps {
  letter: string;
  index: number;
  isSelected: boolean;
  onClick: (letter: string, index: number) => void;
}

// Scrabble Tile - Modified to show point values on empty tiles
const ScrabbleTile: React.FC<ScrabbleTileProps> = ({
  letter, isPlaced, isShaking, onClick, positionKey
}) => (
  <div
    data-position={positionKey}
    onClick={onClick}
    className={`scrabble-tile ${isPlaced ? "filled" : "empty"} ${isShaking ? "shake" : ""}`}
  >
    {isPlaced ? (
      <>
        <span className="tile-letter">{letter}</span>
        <span className="tile-points">{LETTER_POINTS[letter] || 0}</span>
      </>
    ) : (
      // Show point value on empty tiles
      <span className="hidden-points">{LETTER_POINTS[letter] || 0}</span>
    )}
  </div>
);

// Letter Button
const LetterButton: React.FC<LetterButtonProps> = ({
  letter, index, isSelected, onClick
}) => (
  <button
    onClick={() => onClick(letter, index)}
    className={`letter-button ${isSelected ? "selected" : ""}`}
  >
    <span className="button-letter">{letter}</span>
    <span className="button-points">{LETTER_POINTS[letter] || 0}</span>
  </button>
);

const Game: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [placedLetters, setPlacedLetters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<SelectedLetter | null>(null);
  const [shakePosition, setShakePosition] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showInstructions, setShowInstructions] = useState(false);
  const [score, setScore] = useState(0);
  const gameContentRef = useRef<HTMLDivElement>(null);

  // Sparkle background like EntryPage
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

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch words
  const fetchWords = async () => {
    setLoading(true);
    setPlacedLetters({});
    setSelectedLetter(null);
    setScore(0);
    try {
      const res = await fetch(`https://random-word-api.vercel.app/api?words=${NUM_WORDS}`);
      const data = await res.json();
      const upperWords = data.map((w: string) => 
        w.toUpperCase()
      );
      setWords(upperWords);

      const allLetters = upperWords.flatMap((w:string) => w.split(''));
      const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);
      setAvailableLetters(shuffledLetters);
    } catch (err) {
      console.error(err);
      // Fallback words if API fails
      const fallbackWords = ["REACT", "TYPESCRIPT", "SCRABBLE", "PUZZLE", "DESIGN"];
      setWords(fallbackWords);
      
      const allLetters = fallbackWords.flatMap(w => w.split(''));
      const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);
      setAvailableLetters(shuffledLetters);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWords(); }, []);

  // Letter select
  const handleLetterSelect = (letter: string, index: number) => {
    setSelectedLetter({ letter, index });
    if (isMobile && gameContentRef.current) {
      gameContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Place letter
  const handlePositionClick = (wordIndex: number, letterIndex: number) => {
    if (!selectedLetter) return;
    const targetLetter = words[wordIndex][letterIndex];
    const positionKey = `${wordIndex}-${letterIndex}`;

    if (placedLetters[positionKey]) return;

    if (selectedLetter.letter === targetLetter) {
      setPlacedLetters(prev => ({ ...prev, [positionKey]: selectedLetter.letter }));
      setAvailableLetters(prev => prev.filter((_, i) => i !== selectedLetter.index));
      setSelectedLetter(null);
      setScore(prev => prev + (LETTER_POINTS[selectedLetter.letter] || 0));

      const element = document.querySelector(`[data-position="${positionKey}"]`);
      if (element) {
        element.classList.add("success-pulse");
        setTimeout(() => element.classList.remove("success-pulse"), 600);
      }
    } else {
      setShakePosition(positionKey);
      setTimeout(() => setShakePosition(null), 500);
    }
  };

  const completedWords = words.filter((word, wordIndex) =>
    word.split('').every((_, letterIndex) => placedLetters[`${wordIndex}-${letterIndex}`])
  );
  const isGameComplete = completedWords.length === words.length && words.length > 0;

  const resetGame = () => fetchWords();

  if (loading) return (
    <div className="game-container">
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading words...</p>
      </div>
    </div>
  );

  return (
    <div className="game-container">
      {/* Background letters */}
      <div className="floating-letters-bg">
        {['S','C','R','A','B','B','L','E'].map((l,i) => <div key={i} className={`floating-letter letter-${i+1}`}>{l}</div>)}
      </div>

      {/* Palestinian Flag that appears when words are completed */}
      {completedWords.length > 0 && (
        <div className="palestinian-flag">
          <div className="flag-black"></div>
          <div className="flag-white"></div>
          <div className="flag-green"></div>
          <div className="flag-triangle"></div>
        </div>
      )}

      <div className="game-header">
        <div className="header-left">
  <h1 className="game-title">Scrabble Puzzle</h1>
  <div className="score-display">
    <Trophy size={20} className="trophy-icon" />
    <span className="score-text">
      <span className="points">{score} pts</span>
      <span className="divider"> | </span>
      <span className="words-completed">{completedWords.length}/{NUM_WORDS}</span>
    </span>
  </div>
</div>
        
        <div className="header-right">
          <button 
            className="help-button"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <HelpCircle size={20} />
          </button>
          <div className="social-icons">
            <a href="https://github.com/mohavvvvd" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/mohamed-ghoul-224982287" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} />
            </a>
            <a href="https://instagram.com/mohavvvvd" target="_blank" rel="noopener noreferrer">
              <Instagram size={18} />
            </a>
            <a href="https://mohavvvvd.netlify.app" target="_blank" rel="noopener noreferrer">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="instructions-panel">
          <h3>How to Play</h3>
          <p>Pick a letter from the bottom panel and click the empty tile where it belongs. 
  Each tile shows a number representing its position in the word—match the letters to the correct numbers. 
  Fill in all the words to win!</p>
          <button 
            className="close-instructions"
            onClick={() => setShowInstructions(false)}
          >
            Got it!
          </button>
        </div>
      )}

      <div className="game-content" ref={gameContentRef}>
        <div className="words-grid">
          {words.map((word, wordIndex) => (
            <div key={wordIndex} className="word-row">
              <div className="word-number">{wordIndex + 1}.</div>
              {word.split('').map((letter, letterIndex) => {
                const positionKey = `${wordIndex}-${letterIndex}`;
                const isPlaced = !!placedLetters[positionKey];
                const isShaking = shakePosition === positionKey;
                return (
                  <ScrabbleTile
                    key={letterIndex}
                    letter={letter}
                    isPlaced={isPlaced}
                    isShaking={isShaking}
                    onClick={() => handlePositionClick(wordIndex, letterIndex)}
                    positionKey={positionKey}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="letter-pool">
          <div className="pool-label">Available Letters</div>
          <div className="letters-container">
            {availableLetters.map((letter, index) => (
              <LetterButton
                key={index}
                letter={letter}
                index={index}
                isSelected={selectedLetter?.index === index}
                onClick={handleLetterSelect}
              />
            ))}
          </div>
        </div>

        {isGameComplete && (
          <div className="completion-message">
            <div className="message-content">
              <h2>🎉 Congratulations!</h2>
              <p>You've completed all the words with a score of {score} points!</p>
              <button className="reset-button" onClick={resetGame}>
                <RefreshCw size={18} />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
