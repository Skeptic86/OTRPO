const nodemailer = require('nodemailer');
const ApiError = require('../exceptions/api-error');

class MailSerivce {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_LOGIN, // Ваш email
        pass: process.env.MAIL_PASSWORD, // Ваш пароль
      },
    });
  }

  async sendActivationMail(to, link) {
    console.log('send email start');
    await this.transporter.sendMail({
      from: 'stud0000245135@study.utmn.ru',
      to,
      subject: 'Активация аккаунта на ApiPokemon',
      text: '',
      html: `
      <div>
        <h1> Для активации перейдите по ссылке</h1>
        <a href="${link}">${link}</a>
      </div>
      `,
    });
    console.log('send email end');
  }
}

module.exports = new MailSerivce();
