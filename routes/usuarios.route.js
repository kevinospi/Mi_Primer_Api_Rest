const { Router } = require('express');

const { validarJWT} = require('../middlewares/validar-jwt');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorEmailMySql,noExisteUsuarioPorEmailMySql } = require('../helpers/db-validatorsMySql');


const {
    usuariosPost,
    login,
    usuariosGet
} = require('../controllers/usuarios.controller');

const router = Router();

// Insert - CREATE USUARIOS
router.post('/', 
    check('correo','El correo es obligatorio').isEmail(),
    check('correo').custom( noExisteUsuarioPorEmailMySql),


    validarCampos,
       
    usuariosPost);

router.post('/login', 
    //Valido que el correo sea un correo Valido
    check('correo','El correo es obligatorio').isEmail(),
    check('correo').custom( existeUsuarioPorEmailMySql),

    //Valido que el password no sea vacio
    check('password','La contraseña es obligatoria').not().isEmpty(),
   
    validarCampos,
    
    login);

router.get('/',

    validarJWT,

    usuariosGet);

module.exports = router;
