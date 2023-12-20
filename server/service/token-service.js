require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');

class TokenService {
  generateTokens(payload) {
    console.log('JWT_ACCESS_SECRET: ', process.env.JWT_ACCESS_SECRET);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    console.log('saveToken start');
    console.log('userId:', userId);
    const tokenData = await db.query('SELECT EXISTS (SELECT 1 FROM tokens WHERE user_id = $1)', [
      userId,
    ]);
    console.log('select tokenData', tokenData.rows[0].exists);
    if (tokenData.rows[0].exists) {
      const token = await db.query(
        'UPDATE tokens SET refresh_token = $1 WHERE user_id = $2 RETURNING *',
        [refreshToken, userId],
      );
      console.log('token if: ', token.rows[0]);
      return token.rows[0];
    }
    const token = await db.query(
      'INSERT INTO tokens (refresh_token, user_id) VALUES ($1, $2) RETURNING *',
      [refreshToken, userId],
    );
    console.log('token: ', token.rows[0]);
    console.log('saveToken end');
    return token.rows[0];
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const tokenData = await db.query('SELECT * FROM tokens WHERE refresh_token = $1', [
      refreshToken,
    ]);
    return tokenData.rows[0].refresh_token;
  }

  async removeToken(refreshToken) {
    const tokenData = await db.query('DELETE FROM tokens WHERE refresh_token = $1 RETURNING *', [
      refreshToken,
    ]);
    console.log('removeToken tokenData:', tokenData.rows[0].refresh_token);
    return tokenData.rows[0].refresh_token;
  }
}

module.exports = new TokenService();
