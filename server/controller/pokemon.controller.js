const { response } = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const uuid = require('uuid');
const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class PokemonController {
  async createPokemonResult(req, res) {
    const { winner_id, loser_id, date_time } = req.body;
    if (winner_id && loser_id && date_time) {
      const newResult = await db.query(
        'INSERT INTO pokemons (winner_id, loser_id, date_time) VALUES ($1, $2, $3) RETURNING *',
        [winner_id, loser_id, date_time],
      );
      res.json(newResult.rows[0]);
    } else {
      res.sendStatus(400);
    }
  }

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации'), errors.array());
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(`http://localhost:3000`);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // async getAllPokemonResults(req, res) {
  //   const newResult = await db.query('SELECT * FROM pokemons');
  //   res.json(newResult.rows[0]);
  // }

  // async getPokemonResult(req, res) {
  //   const id = req.params.id;
  //   const newResult = await db.query('SELECT * FROM pokemons WHERE id = $1', [id]);
  //   res.json(newResult.rows[0]);
  // }
}

module.exports = new PokemonController();
