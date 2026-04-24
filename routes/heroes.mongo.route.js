const { Router } = require('express');

const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const {
    obtenerHeroes,
    obtenerHeroe,
    crearHeroe,
    actualizarHeroe,
    borrarHeroe,
    migrarHeroesMysqlAMongo
} = require('../controllers/heroes.mongo.controller');

const { existeHeroePorId } = require('../helpers/db-validators.mongo');


const router = Router();

router.post('/migrar/mysql-a-mongo', migrarHeroesMysqlAMongo);

router.get('/', obtenerHeroes);

router.get('/:id',
    check('id', 'No es un id de Mongo válido').isMongoId(),  
    validarCampos,    
    obtenerHeroe
);

router.post('/', crearHeroe);

router.put('/:id',
    check('id', 'No es un id de Mongo válido').isMongoId(),  
    check('id').custom( existeHeroePorId ),
    validarCampos,    
    actualizarHeroe
);

router.delete('/:id',
    check('id', 'No es un id de Mongo válido').isMongoId(),  
    check('id').custom( existeHeroePorId ),
    validarCampos,    
    borrarHeroe
);






module.exports = router;