const { response } = require('express');

const Protagonista = require('../models/mongoProtagonistas.model');
const { Protagonistas } = require('../models/mySqlProtagonistas.model');
const Heroe = require('../models/mongoHeroes.model');
const Pelicula = require('../models/mongoPeliculas.model');

const migrarProtagonistasMysqlAMongo = async (req, res = response) => {
  try {
    const dataMySql = await Protagonistas.findAll();

    let insertados = 0;
    let actualizados = 0;
    let erroresRelacion = 0;

    for (const p of dataMySql) {

      // 🔥 buscar heroe en Mongo
      const heroeMongo = await Heroe.findOne({ id: p.heroes_id });

      // 🔥 buscar pelicula en Mongo
      const peliculaMongo = await Pelicula.findOne({ id: p.peliculas_id });

      if (!heroeMongo || !peliculaMongo) {
        console.log('Error relación:', p.id);
        erroresRelacion++;
        continue;
      }

      const existe = await Protagonista.findOne({ id: p.id });

      const data = {
        id: p.id,
        heroes_id: p.heroes_id,
        peliculas_id: p.peliculas_id,
        id_heroe: heroeMongo._id,
        id_pelicula: peliculaMongo._id,
        papel: p.papel,
        fecha_participacion: p.fecha_participacion
      };

      if (existe) {
        await Protagonista.findByIdAndUpdate(existe._id, data);
        actualizados++;
      } else {
        const nuevo = new Protagonista(data);
        await nuevo.save();
        insertados++;
      }
    }

    res.json({
      ok: true,
      msg: 'Protagonistas migrados',
      total: dataMySql.length,
      insertados,
      actualizados,
      erroresRelacion
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error migrando protagonistas',
      error
    });
  }
};
const obtenerProtagonistasMongo = async (req, res = response) => {
  try {
    const protagonistas = await Protagonista.find({})
      .populate('id_heroe', 'nombre')
      .populate('id_pelicula', 'nombre');

    res.json({
      ok: true,
      total: protagonistas.length,
      protagonistas
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error obteniendo protagonistas',
      error
    });
  }
};

module.exports = {
  migrarProtagonistasMysqlAMongo,
  obtenerProtagonistasMongo
};