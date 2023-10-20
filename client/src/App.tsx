import React from 'react';
import './App.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import PokemonFight from './pages/PokemonFight';
import PokemonFullCard from './pages/PokemonFullCard';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="fight" element={<PokemonFight />} />
        <Route path="info/:id" element={<PokemonFullCard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
