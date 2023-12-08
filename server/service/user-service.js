const db = require('../db');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const mailSerivce = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
  static _password = 'qwerty';

  async registration(email, password) {
    console.log('registration start');
    const candidate = await db.query(
      'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS email_exists',
      [email],
    );
    if (!candidate) {
      throw ApiError.BadRequest('Пользователь с такой почтой уже существует');
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await db.query(
      'INSERT INTO users (email, password, activation_link) VALUES ($1, $2, $3) RETURNING *',
      [email, hashPassword, activationLink],
    );
    await mailSerivce.sendActivationMail(
      email,
      `http://localhost:5000/api/activate/${activationLink}`,
    );

    console.log('user!!!:', user.rows[0]);
    const userObj = {
      email,
      password,
      isActivated: false,
      id: user.rows[0].id,
    };

    const userDto = new UserDto(userObj);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    console.log('registration end');
    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    console.log('activate start');
    const user = await db.query('SELECT EXISTS (SELECT 1 FROM users WHERE activation_link = $1)', [
      activationLink,
    ]);
    console.log('select user:', user);
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации');
    }
    // const user_id = user.rows[0].id;
    // console.log('activate:', user.rows[0].id);
    const activate_true = await db.query('UPDATE users SET is_activated = true');
  }

  async login(email, password) {
    const user = await db.query(
      'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS email_exists',
      [email],
    );
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    const passwordFromDb = await db.query('SELECT * FROM "users" WHERE "email" = $1', [email]);
    console.log('passwordFromDb: ', passwordFromDb);
    const isPassEquals = await bcrypt.compare(password, passwordFromDb.rows[0].password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль');
    }
    const userObj = {
      email,
      password,
      isActivated: true,
      id: passwordFromDb.rows[0].id,
    };
    const userDto = new UserDto(userObj);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    console.log('refreshToken logout:\n\n\n\n ', token);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    console.log('userData', userData);
    console.log('tokenFromDb', tokenFromDb);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const userObj = {
      email: userData.email,
      id: userData.id,
      isActivated: true,
    };

    const userDto = new UserDto(userObj);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await db.query('SELECT * FROM users');
    return users.rows;
  }
}

module.exports = new UserService();
