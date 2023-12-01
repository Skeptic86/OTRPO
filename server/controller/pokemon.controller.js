const { response } = require("../app");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

class PokemonController {
  async createPokemonResult(req, res) {
    const { winner_id, loser_id, date_time } = req.body;
    if (winner_id && loser_id && date_time) {
      const newResult = await db.query(
        "INSERT INTO pokemons (winner_id, loser_id, date_time) VALUES ($1, $2, $3) RETURNING *",
        [winner_id, loser_id, date_time]
      );
      res.json(newResult.rows[0]);
    } else {
      res.sendStatus(400);
    }
  }

  async getAllPokemonResults(req, res) {
    const newResult = await db.query("SELECT * FROM pokemons");
    res.json(newResult.rows[0]);
  }

  async getPokemonResult(req, res) {
    const id = req.params.id;
    const newResult = await db.query("SELECT * FROM pokemons WHERE id = $1", [
      id,
    ]);
    res.json(newResult.rows[0]);
  }

  async register(req, res) {
    const secretKey = process.env.JWT_KEY;
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a secret for 2FA
    const secret = speakeasy.generateSecret();

    // Insert user into the database
    try {
      const result = await db.query(
        "INSERT INTO users (username, password, secret) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, secret.base32]
      );

      const user = result.rows[0];

      // Generate OTP Auth URL
      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: "YourApp:" + username,
        issuer: "YourApp",
      });

      // Generate QR code
      QRCode.toDataURL(otpAuthUrl, (err, dataUrl) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ username: user.username, qrCode: dataUrl });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req, res) {
    const secretKey = process.env.JWT_KEY;
    const { username, password, token } = req.body;

    // Check if the user exists
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify the 2FA token
    const isTokenValid = speakeasy.totp.verify({
      secret: user.rows[0].secret,
      encoding: "base32",
      token,
    });

    // Generate JWT token
    const jwtToken = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    res.json({ token: jwtToken });
  }

  async test(req, res) {
    const secretKey = process.env.JWT_KEY;
    try {
      res.json("works");
    } catch (error) {}
  }
}

module.exports = new PokemonController();
