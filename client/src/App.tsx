import React from 'react';
import './App.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import PokemonFight from './pages/PokemonFight';
import PokemonFullCard from './pages/PokemonFullCard';
import Authorization from './pages/Authorization';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Authorization />} />
        <Route path="home" element={<Home />} />
        <Route path="fight" element={<PokemonFight />} />
        <Route path="home/info/:id" element={<PokemonFullCard />} />
        <Route path="*" element={<Authorization />} />
      </Routes>
    </div>
  );
}

export default App;
