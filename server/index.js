const express = require('express');
const pokemonRouter = require('./routes/pokemon.routes');
const PORT = 5000;

const app = express();
app.use(express.json());

app.use('/api', pokemonRouter);

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
