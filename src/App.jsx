import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterList from './components/CharacterList';
import CharacterDetail from './components/CharacterDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/character/:id" element={<CharacterDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;