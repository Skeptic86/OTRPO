const Router = require('express');
const router = new Router();
const fightResultRouter = require('../controllers/fightResult.controller');

router.post('/fightResult', fightResultRouter.createFightResult);
router.get('/fightResult', fightResultRouter.getFightResults);
router.get('/fightResult/:id', fightResultRouter.getOneResults);

module.exports = router;
