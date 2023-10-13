const db = require('../db');

class FightResultController {
  async createFightResult(req, res) {
    const { winner, loser } = req;
    const newFightResult = await db.query(
      'INSERT INTO pokemons (winner, loser) values ($1, $2) RETURNING',
      [winner, loser],
    );
    res.json(newFightResult.rows[0]);
  }

  async getFightResults(req, res) {
    const allFightResults = await db.query('SELECT * FROM pokemons');
    res.json(allFightResults.rows);
  }

  async getOneResults(res, req) {
    const { id } = req;
    const newFightResult = await db.query('SELECT * FROM pokemons where id = $1', [id]);
    res.json(newFightResult.rows[0]);
  }
}

module.exports = new FightResultController();
