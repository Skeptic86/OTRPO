const Router = require('express');
const router = new Router();
const pokemonController = require('../controller/pokemon.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/result', pokemonController.createPokemonResult);
// router.get('/result', pokemonController.getAllPokemonResults);
// router.get('/result/:id', pokemonController.getPokemonResult);
router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  pokemonController.registration,
);
router.post('/login', pokemonController.login);
router.post('/logout', pokemonController.logout);
router.get('/activate/:link', pokemonController.activate);
router.get('/refresh', pokemonController.refresh);
router.get('/users', authMiddleware, pokemonController.getUsers);

module.exports = router;
