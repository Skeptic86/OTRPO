const express = require('express');
const fightResultRouter = require('./routes/FightResult.routes');

const PORT = 5000;

const app = express();

app.use(express.json());
app.use('api/', fightResultRouter);

async function startApp() {
  try {
    app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
