// src/components/CharacterList.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [info, setInfo] = useState({ pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // === Fetch daftar karakter ===
  const fetchCharacters = useCallback(async (page) => {
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await res.json();
      setCharacters(data.results || []);
      setInfo(data.info || { pages: 1 });
    } catch (err) {
      console.error('Failed to load characters:', err);
      setCharacters([]);
    }
  }, []);

  // === Cari karakter dengan debounce ===
  const handleSearch = useCallback((query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character?name=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleSuggestionClick = (id) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/character/${id}`);
  };

  // === Tutup saran saat klik di luar ===
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // === Fetch saat halaman berubah ===
  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage, fetchCharacters]);

  // === Navigasi halaman ===
  const goToPage = (page) => {
    if (page >= 1 && page <= info.pages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Rick and Morty Characters
        </h1>

        {/* Search */}
        <div className="search-container relative mb-10 max-w-lg mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            placeholder="Search a character..."
            className="w-full p-4 rounded-xl bg-gray-800/70 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {showSuggestions && (
            <div className="absolute z-20 w-full mt-2 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((char) => (
                  <div
                    key={char.id}
                    onClick={() => handleSuggestionClick(char.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 p-3 hover:bg-gray-700/60 cursor-pointer transition-colors"
                  >
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-600"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-semibold">{char.name}</p>
                      <p className="text-xs text-gray-400">{char.species} • {char.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-center text-gray-400">No results found</p>
              )}
            </div>
          )}
        </div>

        {/* Grid Karakter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {characters.map((char) => (
            <Link
              to={`/character/${char.id}`}
              key={char.id}
              className="group bg-gray-800/60 hover:bg-gray-700/70 backdrop-blur rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{char.name}</h3>
                <p className="text-sm text-gray-300">{char.species}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    char.status === 'Alive'
                      ? 'bg-green-500/20 text-green-400'
                      : char.status === 'Dead'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {char.status}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-xl transition-colors"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 bg-gray-800/80 rounded-xl">
            Page {currentPage} of {info.pages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === info.pages}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-xl transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterList;