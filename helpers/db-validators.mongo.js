const Heroe = require("../models/mongoHeroes.model");


/**
 * Heroe
 */
const existeHeroePorId = async (id) => {
  // Verificar si el correo existe
  const existeHeroe = await Heroe.findById(id);
  if (!existeHeroe) {
    throw new Error(`El id del Heroe no existe ${id}`);
  }
};


module.exports = {
  existeHeroePorId,
};
