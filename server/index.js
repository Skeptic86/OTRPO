const express = require('express');
const nodemailer = require('nodemailer');
const pokemonRouter = require('./routes/pokemon.routes');
const cors = require('cors');
const fs = require('fs');
const PORT = 5000;
const axios = require('axios');
const redis = require('redis');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', pokemonRouter);

const redisClient = redis.createClient(6379);

var ftpClient = require('ftp-client'),
  config = {
    host: 'ftpupload.net',
    port: 21,
    user: 'ezyro_35295053',
    password: '8b4bdac145760',
  },
  options = {
    logging: 'basic',
  },
  client = new ftpClient(config, options);

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'stud0000245135@study.utmn.ru', // Ваш email
    pass: 'fcxyxkcdoopvfeby', // Ваш пароль
  },
});

// function setResponse(id, pokemon) {
//   return `<h2>pokemon with id:${id} is ${pokemon.name}</h2>`;
// }

// async function getPokemon(req, res, next) {
//   try {
//     const { id } = req.params;
//     const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

//     const response = await axios.get(url);
//     const pokemon = await response.data.json();
//     console.log(pokemon);

//     redisClient.setEx(id, 3600, pokemon);

//     res.json(setResponse(id, pokemon));
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//   }
// }

// function cache(req, res, next) {
//   const { id } = req.params;

//   redisClient.get(id, (err, data) => {
//     if (err) throw err;

//     if (data !== null) {
//       res.json(setResponse(id, data));
//     } else {
//       next();
//     }
//   });
// }

// app.get('/redis/:id', getPokemon);

// Проверяем соединение с Redis
redisClient.on('connect', () => {
  console.log('Подключено к Redis');
});

redisClient.on('error', (err) => {
  console.error('Ошибка подключения к Redis:', err);
});

app.get('/redis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const redisKey = `pokemon:${id}`;

    // Попытаться получить данные из Redis
    redisClient.get(redisKey, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Если данные уже есть в Redis, вернуть их
        const pokemonData = JSON.parse(data);
        res.json(pokemonData);
      } else {
        // Если данных нет в Redis, выполнить запрос к API
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const response = await axios.get(apiUrl);
        const pokemonData = response.data;

        // Сохранить данные в Redis с TTL (временем жизни) в секундах
        redisClient.setex(redisKey, 3600, JSON.stringify(pokemonData));

        res.json(pokemonData);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных Pokemon' });
  }
});

app.post('/save-pokemon', (req, res) => {
  const { name } = req.body;
  console.log(`saving ${name}`);
  const date = getDate();

  var dir = `test/${date}/`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.appendFile(`${dir}/${name}.md`, `# ${name}`, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });

  client.connect(function () {
    client.upload(
      ['test/**'],
      '/htdocs',
      {
        baseDir: 'htdocs',
        overwrite: 'older',
      },
      function (result) {
        console.log(result);
      },
    );

    // client.download(
    //   "/htdocs",
    //   "test/",
    //   {
    //     overwrite: "all",
    //   },
    //   function (result) {
    //     console.log(result);
    //   }
    // );
  });
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;
  const mailOptions = {
    from: 'stud0000245135@study.utmn.ru',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Ошибка отправки письма');
    } else {
      console.log('Email отправлен: ' + info.response);
      res.send('Email отправлен успешно');
    }
  });
});

const getDate = () => {
  let ts = Date.now();

  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  const returnDate = year + '-' + month + '-' + date;
  return returnDate;
};

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
