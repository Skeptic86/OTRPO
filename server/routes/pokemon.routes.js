const Router = require("express");
const router = new Router();
const pokemonController = require("../controller/pokemon.controller");

router.post("/result", pokemonController.createPokemonResult);
router.get("/result", pokemonController.getAllPokemonResults);
router.get("/result/:id", pokemonController.getPokemonResult);
router.post("/register", pokemonController.register);
router.post("/login", pokemonController.login);
router.post("/test", pokemonController.test);

module.exports = router;
