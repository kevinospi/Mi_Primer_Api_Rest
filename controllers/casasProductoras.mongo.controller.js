const { response } = require('express');
const CasaProductora = require('../models/mongoCasasProductoras.model');
const { getCasas } = require('../models/mySqlCasasProductoras.model');

const obtenerCasasMongo = async (req, res = response) => {
  const { limite = 10, desde = 0 } = req.query;

  try {
    const [total, casas] = await Promise.all([
      CasaProductora.countDocuments(),
      CasaProductora.find({})
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
      ok: true,
      total,
      casas
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener casas productoras en Mongo',
      error
    });
  }
};

const obtenerCasaMongoPorId = async (req, res = response) => {
  const { id } = req.params;

  try {
    const casa = await CasaProductora.findById(id);

    if (!casa) {
      return res.status(404).json({
        ok: false,
        msg: 'Casa productora no encontrada'
      });
    }

    res.json({
      ok: true,
      casa
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener casa productora en Mongo',
      error
    });
  }
};

const crearCasaMongo = async (req, res = response) => {
  const body = req.body;

  try {
    const existePorNombre = await CasaProductora.findOne({ nombre: body.nombre });

    if (existePorNombre) {
      return res.status(400).json({
        ok: false,
        msg: `La casa productora ${body.nombre} ya existe`
      });
    }

    const casa = new CasaProductora(body);
    await casa.save();

    res.status(201).json({
      ok: true,
      msg: 'Casa productora creada en Mongo',
      casa
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear casa productora en Mongo',
      error
    });
  }
};

const actualizarCasaMongo = async (req, res = response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const casa = await CasaProductora.findByIdAndUpdate(id, data, { new: true });

    if (!casa) {
      return res.status(404).json({
        ok: false,
        msg: 'Casa productora no encontrada'
      });
    }

    res.json({
      ok: true,
      msg: 'Casa productora actualizada en Mongo',
      casa
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar casa productora en Mongo',
      error
    });
  }
};

const borrarCasaMongo = async (req, res = response) => {
  const { id } = req.params;

  try {
    const casa = await CasaProductora.findByIdAndDelete(id);

    if (!casa) {
      return res.status(404).json({
        ok: false,
        msg: 'Casa productora no encontrada'
      });
    }

    res.json({
      ok: true,
      msg: 'Casa productora eliminada de Mongo',
      casa
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar casa productora en Mongo',
      error
    });
  }
};

const migrarCasasMysqlAMongo = async (req, res = response) => {
  try {
    const casasMySql = await getCasas();

    let insertadas = 0;
    let actualizadas = 0;
    const errores = [];

    for (const casa of casasMySql) {
      try {
        const existe = await CasaProductora.findOne({ id: casa.id });

        if (existe) {
          await CasaProductora.findByIdAndUpdate(existe._id, {
            id: casa.id,
            nombre: casa.nombre,
            pais: casa.pais,
            tipo_medio: casa.tipo_medio,
            heroes_famosos: casa.heroes_famosos
          });

          actualizadas++;
        } else {
          const nuevaCasa = new CasaProductora({
            id: casa.id,
            nombre: casa.nombre,
            pais: casa.pais,
            tipo_medio: casa.tipo_medio,
            heroes_famosos: casa.heroes_famosos
          });

          await nuevaCasa.save();
          insertadas++;
        }
      } catch (error) {
        errores.push({
          casa_id_mysql: casa.id,
          nombre: casa.nombre,
          error: error.message
        });
      }
    }

    res.json({
      ok: true,
      msg: 'Migración de casas productoras finalizada',
      total_mysql: casasMySql.length,
      insertadas,
      actualizadas,
      errores
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al migrar casas productoras de MySQL a Mongo',
      error
    });
  }
};

module.exports = {
  obtenerCasasMongo,
  obtenerCasaMongoPorId,
  crearCasaMongo,
  actualizarCasaMongo,
  borrarCasaMongo,
  migrarCasasMysqlAMongo
};