import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("accessToken");
  const hasToken = !!token;

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // -------------------------------
  // ⭐ DARK MODE LOGIC
  // -------------------------------
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // -------------------------------
  // SEARCH SUBMIT
  // -------------------------------
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/?query=${encodeURIComponent(searchTerm)}`);
  };

  // -------------------------------
  // CLEAR SEARCH
  // -------------------------------
  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  // -------------------------------
  // SPEECH RECOGNITION (VOICE SEARCH)
  // -------------------------------
  const startVoiceSearch = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setSearchTerm(result);
      navigate(`/?query=${encodeURIComponent(result)}`);
    };
  };

  // -------------------------------
  // HIGHLIGHT MATCH
  // -------------------------------
  const highlightMatch = (text, keyword) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="font-bold text-blue-600 dark:text-blue-400">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
        >
          VideoApp
        </Link>

        {/* SEARCH BAR */}
        <div className="hidden md:flex flex-col w-1/2 relative">
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full border dark:border-gray-700 rounded-l-full px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Clear Search */}
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 text-gray-500 dark:text-gray-300 hover:text-black"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700"
            >
              🔍
            </button>

            {/* Voice Search */}
            <button
              type="button"
              onClick={startVoiceSearch}
              className="ml-2 text-2xl dark:text-gray-200"
            >
              🎤
            </button>
          </form>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-3">

          {/* DARK MODE TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-white transition hover:scale-105"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {!hasToken ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/upload"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Upload
              </Link>

              <Link
                to="/my-videos"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                My Videos
              </Link>
              
              <Link
                to="/history"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                History
              </Link>


              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
