const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  obtenerCasasMongo,
  obtenerCasaMongoPorId,
  crearCasaMongo,
  actualizarCasaMongo,
  borrarCasaMongo,
  migrarCasasMysqlAMongo
} = require('../controllers/casasProductoras.mongo.controller');

const router = Router();

router.post('/migrar/mysql-a-mongo', migrarCasasMysqlAMongo);

router.get('/', obtenerCasasMongo);

router.get('/:id', [
  check('id', 'No es un id de Mongo válido').isMongoId(),
  validarCampos
], obtenerCasaMongoPorId);

router.post('/', [
  check('id', 'El id de MySQL es obligatorio').isInt(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('pais', 'El país es obligatorio').not().isEmpty(),
  check('tipo_medio', 'El tipo de medio es obligatorio').not().isEmpty(),
  validarCampos
], crearCasaMongo);

router.put('/:id', [
  check('id', 'No es un id de Mongo válido').isMongoId(),
  validarCampos
], actualizarCasaMongo);

router.delete('/:id', [
  check('id', 'No es un id de Mongo válido').isMongoId(),
  validarCampos
], borrarCasaMongo);

module.exports = router;