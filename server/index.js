const express = require('express');
const nodemailer = require('nodemailer');
const pokemonRouter = require('./routes/pokemon.routes');
const cors = require('cors');
const PORT = 5000;

const app = express();
app.use(express.json());

app.use(cors());
app.use('/api', pokemonRouter);

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'stud0000245135@study.utmn.ru', // Ваш email
    pass: 'fcxyxkcdoopvfeby', // Ваш пароль
  },
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;
  console.log(to, subject, text);
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

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
