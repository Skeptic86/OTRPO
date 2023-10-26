const { FtpSrv } = require('ftp-srv');
const server = new FtpSrv('ftp://127.0.0.1:21');

server.on('login', (data, resolve, reject) => {
  // Здесь вы можете реализовать логику проверки учетных данных пользователя
  // data.username содержит имя пользователя, data.password содержит пароль.
  // Если учетные данные правильные, вызывайте resolve(), иначе вызывайте reject().
});

server.listen().then(() => {
  console.log('FTP сервер запущен');
});
