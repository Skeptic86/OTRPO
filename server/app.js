const express = require("express");
const nodemailer = require("nodemailer");
const pokemonRouter = require("./routes/pokemon.routes");
const cors = require("cors");
const fs = require("fs");
const PORT = 5000;
const axios = require("axios");
// const redis = require("redis");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/api", pokemonRouter);

// (async () => {
//   redisClient = redis.createClient(6379);

//   redisClient.on("error", (error) => console.log("Что-то пошло не так", error)); // вешаем хук на ошибку подключения к серверу Redis

//   await redisClient.connect(); // подключаемся к серверу
// })();

var ftpClient = require("ftp-client"),
  config = {
    host: "ftpupload.net",
    port: 21,
    user: process.env.FTP_LOGIN,
    password: process.env.FTP_PASSWORD,
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
    user: process.env.MAIL_LOGIN, // Ваш email
    pass: process.env.MAIL_PASSWORD, // Ваш пароль
  },
});

// redisClient.on("connect", () => {
//   console.log("Connected to Redis");
// });

// redisClient.on("error", (err) => {
//   console.error("Error Redis: ", err);
// });

async function getPokemons(number) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${number}`;
  const { data } = await axios.get(apiUrl);
  return data;
}

// app.get("/redis/:id", async (req, res) => {
//   console.log("get");
//   console.log(req.params);
//   const { id } = req.params;
//   console.log(id);
//   const redisKey = `pokemon:${id}`;
//   console.log("try get");
//   // Попытаться получить данные из Redis
//   const cacheData = await redisClient.get(redisKey);
//   if (cacheData) {
//     results = JSON.parse(cacheData);
//   } else {
//     results = await getPokemons(id);
//     if (results.length === 0) throw "API error"; // обрабатываем пустой результат ошибкой
//     await redisClient.set(redisKey, JSON.stringify(results));
//   }

//   res.json(results);
// });

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

module.exports = app;
