const { Router } = require('express');
const { check } = require('express-validator');

const {
    heroesGet,
    heroeIdGet,
    heroesComoGet,
    heroesPost,
    heroePut,
    heroeDelete
} = require('../controllers/heroes.controller');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeHeroePorIdMySql } = require('../helpers/db-validatorsMySql');

const router = Router();

// READ
router.get('/', heroesGet);

router.get('/como/:termino', heroesComoGet);

router.get('/:id',
    check('id').custom(existeHeroePorIdMySql),
    validarCampos,
    heroeIdGet
);

// CREATE
router.post('/',
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('bio', 'La bio es obligatoria').not().isEmpty(),
    check('img', 'La imagen es obligatoria').not().isEmpty(),
    check('productora_id', 'El productora_id debe ser numérico').optional().isInt(),
    validarCampos,
    heroesPost
);

// UPDATE
router.put('/:id',
    validarJWT,
    check('id').custom(existeHeroePorIdMySql),
    check('productora_id', 'El productora_id debe ser numérico').optional().isInt(),
    validarCampos,
    heroePut
);

// DELETE
router.delete('/:id',
    validarJWT,
    check('id').custom(existeHeroePorIdMySql),
    validarCampos,
    heroeDelete
);

module.exports = router;