const { Router } = require('express');

const {
  migrarProtagonistasMysqlAMongo,
  obtenerProtagonistasMongo
} = require('../controllers/protagonistas.mongo.controller');

const router = Router();

router.post('/migrar/mysql-a-mongo', migrarProtagonistasMysqlAMongo);

router.get('/', obtenerProtagonistasMongo);

module.exports = router;