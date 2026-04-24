const { Router } = require('express');

const {
  obtenerPeliculasMongo,
  migrarPeliculasMysqlAMongo,
  agregarMultimediaPelicula
} = require('../controllers/peliculas.mongo.controller');

const router = Router();

router.post('/migrar/mysql-a-mongo', migrarPeliculasMysqlAMongo);

router.get('/', obtenerPeliculasMongo);

router.post('/:id/multimedia', agregarMultimediaPelicula);

module.exports = router;