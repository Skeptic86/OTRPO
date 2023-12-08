const app = require('./app');
require('dotenv').config();

const PORT = 5000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server start on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
