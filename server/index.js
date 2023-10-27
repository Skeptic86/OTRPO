const express = require("express");
const nodemailer = require("nodemailer");
const pokemonRouter = require("./routes/pokemon.routes");
const cors = require("cors");
const fs = require("fs");
const PORT = 5000;
const axios = require("axios");
const redis = require("redis");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", pokemonRouter);

(async () => {
  redisClient = redis.createClient(6379);

  redisClient.on("error", (error) => console.log("Что-то пошло не так", error)); // вешаем хук на ошибку подключения к серверу Redis

  await redisClient.connect(); // подключаемся к серверу
})();

var ftpClient = require("ftp-client"),
  config = {
    host: "ftpupload.net",
    port: 21,
    user: "ezyro_35295053",
    password: "8b4bdac145760",
  },
  options = {
    logging: "basic",
  },
  client = new ftpClient(config, options);

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "stud0000245135@study.utmn.ru", // Ваш email
    pass: "fcxyxkcdoopvfeby", // Ваш пароль
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

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Error Redis: ", err);
});

async function getPokemons(number) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${number}`;
  const { data } = await axios.get(apiUrl);
  return data;
}

app.get("/redis/:id", async (req, res) => {
  console.log("get");
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const redisKey = `pokemon:${id}`;
  console.log("try get");
  // Попытаться получить данные из Redis
  const cacheData = await redisClient.get(redisKey);
  if (cacheData) {
    results = JSON.parse(cacheData);
  } else {
    results = await getPokemons(id);
    if (results.length === 0) throw "API error"; // обрабатываем пустой результат ошибкой
    await redisClient.set(redisKey, JSON.stringify(results));
  }

  res.json(results);
});

// создаем асинхронную функцию для запроса данных с удаленного сервера с помощью axios

async function getRemoteData() {
  const information = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/1`
  ); // отправляем  запрос на удаленный сервер с API
  console.log("There was a request to a remote server"); // выводим информационное сообщение в консоль
  return information.data; // возвращаем полученные JSON-данные в сыром виде
}

// создаем асинхронную функция обработки пользовательских запросов

async function onRequest(req, res) {
  let results; // заранее объявляем переменную для результата

  const cacheData = await redisClient.get("post"); // пытаемся получить переменную post из базы данных Redis

  if (cacheData) {
    results = JSON.parse(cacheData); // парсим данные из формата сырой строки в формат структуры
  } else {
    results = await getRemoteData(); // вызываем функцию получения данных с удаленного сервера
    if (results.length === 0) throw "API error"; // обрабатываем пустой результат ошибкой
    await redisClient.set("post", JSON.stringify(results)); // кэшируем полученные данные
  }

  res.send(results); // отвечаем на запрос JSON-данными
}

// запускаем HTTP-сервер с необходимыми настройками

// app.get("/test", onRequest); // вешаем ранее созданную функцию на хук GET-запроса

app.post("/save-pokemon", (req, res) => {
  const { name } = req.body;
  console.log(`saving ${name}`);
  const date = getDate();

  var dir = `test/${date}/`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.appendFile(`${dir}/${name}.md`, `# ${name}`, function (err) {
    if (err) throw err;
    console.log("File is created successfully.");
  });

  client.connect(function () {
    client.upload(
      ["test/**"],
      "/htdocs",
      {
        baseDir: "htdocs",
        overwrite: "older",
      },
      function (result) {
        console.log(result);
      }
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

app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  const mailOptions = {
    from: "stud0000245135@study.utmn.ru",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Ошибка отправки письма");
    } else {
      console.log("Email отправлен: " + info.response);
      res.send("Email отправлен успешно");
    }
  });
});

const getDate = () => {
  let ts = Date.now();

  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  const returnDate = year + "-" + month + "-" + date;
  return returnDate;
};

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
