const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  password: 'qwerty',
  port: 5432,
  database: 'pokemons',
});
