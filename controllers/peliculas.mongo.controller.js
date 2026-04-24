const { response } = require('express');
const Pelicula = require('../models/mongoPeliculas.model');
const { Peliculas } = require('../models/mySqlPeliculas.model');

const obtenerPeliculasMongo = async (req, res = response) => {
  try {
    const peliculas = await Pelicula.find({});

    res.json({
      ok: true,
      total: peliculas.length,
      peliculas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener películas',
      error
    });
  }
};

const migrarPeliculasMysqlAMongo = async (req, res = response) => {
  try {
    const peliculasMySql = await Peliculas.findAll();

    let insertadas = 0;
    let actualizadas = 0;

    for (const peli of peliculasMySql) {
      const existe = await Pelicula.findOne({ id: peli.id });

      const data = {
        id: peli.id,
        nombre: peli.nombre
      };

      if (existe) {
        await Pelicula.findByIdAndUpdate(existe._id, data);
        actualizadas++;
      } else {
        const nueva = new Pelicula(data);
        await nueva.save();
        insertadas++;
      }
    }

    res.json({
      ok: true,
      msg: 'Películas migradas',
      total: peliculasMySql.length,
      insertadas,
      actualizadas
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error migrando películas',
      error
    });
  }
};

const agregarMultimediaPelicula = async (req, res = response) => {
  const { id } = req.params;
  const { tipo, url, descripcion } = req.body;

  try {
    const pelicula = await Pelicula.findByIdAndUpdate(
      id,
      {
        $push: {
          multimedia: {
            tipo,
            url,
            descripcion
          }
        }
      },
      { new: true }
    );

    res.json({
      ok: true,
      msg: 'Multimedia agregada a la película',
      pelicula
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error agregando multimedia',
      error
    });
  }
};

module.exports = {
  obtenerPeliculasMongo,
  migrarPeliculasMysqlAMongo,
  agregarMultimediaPelicula
};