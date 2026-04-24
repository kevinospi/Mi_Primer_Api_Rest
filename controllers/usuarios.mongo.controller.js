const { response } = require('express');
const Usuario = require('../models/mongoUsuarios.model');
const { Usuarios } = require('../models/usuarios.model');

const migrarUsuariosMysqlAMongo = async (req, res = response) => {
  try {
    const usuariosMySql = await Usuarios.findAll();

    let insertados = 0;
    let actualizados = 0;

    for (const user of usuariosMySql) {
      const existe = await Usuario.findOne({ id: user.id });

      const data = {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        password: user.password,
        img: user.img,
        rol: user.rol,
        estado: user.estado,
        google: user.google,
        fecha_creacion: user.fecha_creacion,
        fecha_actualizacion: user.fecha_actualizacion
      };

      if (existe) {
        await Usuario.findByIdAndUpdate(existe._id, data);
        actualizados++;
      } else {
        const nuevo = new Usuario(data);
        await nuevo.save();
        insertados++;
      }
    }

    res.json({
      ok: true,
      msg: 'Usuarios migrados',
      total: usuariosMySql.length,
      insertados,
      actualizados
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error migrando usuarios',
      error
    });
  }
};

module.exports = {
  migrarUsuariosMysqlAMongo
};