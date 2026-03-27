const { Router } = require('express');
const { check } = require('express-validator');

const {
    obtenerCasas,
    obtenerCasaPorId,
    buscarCasas,
    crearCasa,
    actualizarCasa,
    eliminarCasa
} = require('../controllers/casasProductoras.controller');

const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('../middlewares/validar-campos');

const router = Router();

router.use(validarJWT);

// Buscar por texto
router.get('/buscar/:texto', buscarCasas);

// Obtener todas
router.get('/', obtenerCasas);

// Obtener por ID
router.get('/:id', [
    check('id', 'El id debe ser numérico').isInt(),
    validarCampos
], obtenerCasaPorId);

// Crear
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe tener mínimo 2 caracteres').isLength({ min: 2 }),
    check('pais', 'El país es obligatorio').not().isEmpty(),
    check('tipo_medio', 'El tipo de medio es obligatorio').not().isEmpty(),
    validarCampos
], crearCasa);

// Actualizar
router.put('/:id', [
    check('id', 'El id debe ser numérico').isInt(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('pais', 'El país es obligatorio').not().isEmpty(),
    check('tipo_medio', 'El tipo de medio es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCasa);

// Eliminar
router.delete('/:id', [
    check('id', 'El id debe ser numérico').isInt(),
    validarCampos
], eliminarCasa);

module.exports = router;