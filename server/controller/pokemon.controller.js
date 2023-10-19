const db = require('../db');

class PokemonController {
  async createPokemonResult(req, res) {
    const { winner, loser } = req.body;
    const newResult = await db.query(
      'INSERT INTO pokemons (winner, loser) VALUES ($1, $2) RETURNING *',
      [winner, loser],
    );
    res.json(newResult.rows[0]);
  }

  async getAllPokemonResults(req, res) {
    const newResult = await db.query('SELECT * FROM pokemons');
    res.json(newResult.rows[0]);
  }

  async getPokemonResult(req, res) {
    const id = req.params.id;
    const newResult = await db.query('SELECT * FROM pokemons WHERE id = $1', [id]);
    res.json(newResult.rows[0]);
  }
}

module.exports = new PokemonController();
