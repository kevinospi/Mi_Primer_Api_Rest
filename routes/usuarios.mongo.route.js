const { Router } = require('express');
const { migrarUsuariosMysqlAMongo } = require('../controllers/usuarios.mongo.controller');

const router = Router();

router.post('/migrar/mysql-a-mongo', migrarUsuariosMysqlAMongo);

module.exports = router;