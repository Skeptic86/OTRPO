const { response } = require("../app");
const db = require("../db");

class PokemonController {
  async createPokemonResult(req, res) {
    const { winner_id, loser_id, date_time } = req.body;
    if (winner_id && loser_id && date_time) {
      const newResult = await db.query(
        "INSERT INTO pokemons (winner_id, loser_id, date_time) VALUES ($1, $2, $3) RETURNING *",
        [winner_id, loser_id, date_time]
      );
      res.json(newResult.rows[0]);
    } else {
      res.sendStatus(400);
    }
  }

  async getAllPokemonResults(req, res) {
    const newResult = await db.query("SELECT * FROM pokemons");
    res.json(newResult.rows[0]);
  }

  async getPokemonResult(req, res) {
    const id = req.params.id;
    const newResult = await db.query("SELECT * FROM pokemons WHERE id = $1", [
      id,
    ]);
    res.json(newResult.rows[0]);
  }
}

module.exports = new PokemonController();
