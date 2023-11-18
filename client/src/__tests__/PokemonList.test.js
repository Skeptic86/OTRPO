import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'; // Для улучшения возможностей утвержденийaa

import PokemonList from '../components/PokemonList/index';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('PokemonList Component', () => {
  it('renders without crashing', () => {
    const pokemons = [
      { id: 1, name: 'Bulbasaur' },
      { id: 2, name: 'Charmander' }
      // Add more mock data as needed
    ];

    const mockDispatch = jest.fn();

    jest.mock('../../redux/slices/pokemonSlice', () => ({
      ...jest.requireActual('../../redux/slices/pokemonSlice'),
      setChosenPokemon: mockDispatch
    }));

    render(<PokemonList onChangePage={jest.fn()} pokemons={pokemons} currentPage={1} />);

    // Your assertions go here
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
    // Add more assertions as needed
  });

  it('handles Pokemon button click', () => {
    const pokemons = [
      { id: 1, name: 'Bulbasaur' },
      { id: 2, name: 'Charmander' }
      // Add more mock data as needed
    ];

    const mockDispatch = jest.fn();

    jest.mock('../../redux/slices/pokemonSlice', () => ({
      ...jest.requireActual('../../redux/slices/pokemonSlice'),
      setChosenPokemon: mockDispatch
    }));

    render(<PokemonList onChangePage={jest.fn()} pokemons={pokemons} currentPage={1} />);

    // Trigger a button click
    fireEvent.click(screen.getByText('Bulbasaur'));

    // Verify that the dispatch function was called with the correct argument
    expect(mockDispatch).toHaveBeenCalledWith({
      id: 1,
      name: 'Bulbasaur'
    });
  });

  // Add more test cases as needed
});
