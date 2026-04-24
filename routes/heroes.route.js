const { Router } = require('express');

const { heroesGet,
        heroeIdGet,
        heroesComoGet,
        heroesPost,
        heroePut,
        heroeDelete
} = require('../controllers/heroes.controller');

const { validarJWT} = require('../middlewares/validar-jwt');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeHeroePorIdMySql } = require('../helpers/db-validatorsMySql');



const router = Router();

//READ (3) - GET
router.get('/', heroesGet);

router.get('/:id', 
    check('id').custom( existeHeroePorIdMySql),
    validarCampos,        
    heroeIdGet);

router.get('/como/:termino', heroesComoGet);

//CREATE - POST - INSERT
router.post('/', heroesPost);

//UPDATE - PUT 
router.put('/:id', 
    validarJWT,
    check('id').custom( existeHeroePorIdMySql),

    validarCampos,   

    heroePut);

//DELETE - DELETE
router.delete('/:id', 
    check('id').custom( existeHeroePorIdMySql),
    
    validarCampos,   
    
    heroeDelete);

//router.patch('/', usuariosPatch);

module.exports = router;
