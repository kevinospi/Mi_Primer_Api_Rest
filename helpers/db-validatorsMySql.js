const {
    Heroes
} = require("../models/mySqlHeroes.model");


const {
    Usuarios
} = require("../models/usuarios.model");


/**
 * Heroe
 */
const existeHeroePorIdMySql = async (id) => {
  // Verificar si el correo existe
  const existeHeroe = await Heroes.findByPk(id);
  if (!existeHeroe) {
    throw new Error(`El id no existe ${id}`);
  }

};


/**
 * Usuario
 */
const existeUsuarioPorEmailMySql = async (correo) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuarios.findOne({ where: { correo: correo} });


    //const existeUsuario = await Usuarios.findByPk(id);
    if (!existeUsuario) {
      throw new Error(`No existe un Usuario con el correo ${correo}`);
    }
  };
 
  const noExisteUsuarioPorEmailMySql = async (correo) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuarios.findOne({ where: { correo: correo} });


    //const existeUsuario = await Usuarios.findByPk(id);
    if (existeUsuario) {
      throw new Error(`Existe un Usuario con el correo ${correo}`);
    }
  };


module.exports = {
  existeHeroePorIdMySql,
  existeUsuarioPorEmailMySql,
  noExisteUsuarioPorEmailMySql
};


