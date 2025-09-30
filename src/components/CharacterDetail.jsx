// src/components/CharacterDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);
      try {
        const charRes = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!charRes.ok) throw new Error('Character not found');
        const charData = await charRes.json();
        setCharacter(charData);

        const epPromises = charData.episode.map(url => fetch(url).then(r => r.json()));
        const epData = await Promise.all(epPromises);
        setEpisodes(epData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <div className="text-center">
          <p className="text-xl mb-4">⚠️ {error}</p>
          <Link
            to="/"
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            ← Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
        >
          ← Back to Characters
        </Link>

        <div className="bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-900/50">
              <img
                src={character.image}
                alt={character.name}
                className="w-48 h-48 md:w-full md:h-auto rounded-2xl object-cover shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {character.name}
              </h1>
              <div className="space-y-2 text-gray-200">
                <InfoRow label="Status" value={character.status} isStatus />
                <InfoRow label="Species" value={character.species} />
                <InfoRow label="Type" value={character.type || '—'} />
                <InfoRow label="Gender" value={character.gender} />
                <InfoRow label="Origin" value={character.origin?.name || 'Unknown'} />
                <InfoRow label="Location" value={character.location?.name || 'Unknown'} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 px-6 pb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              📺 Episode Appearances <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">{episodes.length}</span>
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {episodes.length > 0 ? (
                episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <strong className="text-purple-300">{ep.name}</strong>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">{ep.episode}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Air Date: {ep.air_date}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No episode data.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen helper untuk baris info
const InfoRow = ({ label, value, isStatus = false }) => {
  let statusColor = 'text-gray-400';
  if (isStatus) {
    statusColor =
      value === 'Alive' ? 'text-green-400' :
      value === 'Dead' ? 'text-red-400' :
      'text-yellow-400';
  }

  return (
    <p>
      <span className="font-medium text-gray-400">{label}:</span>{' '}
      <span className={isStatus ? statusColor : 'text-white'}>{value}</span>
    </p>
  );
};

export default CharacterDetail;