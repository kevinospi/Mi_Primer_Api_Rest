const db = require('../database/mySqlConnection');

// Obtener todas
const getCasas = async () => {
    const [rows] = await db.query('SELECT * FROM casas_productoras_heroes');
    return rows;
};

// Obtener por ID
const getCasaById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM casas_productoras_heroes WHERE id = ?',
        [id]
    );
    return rows[0];
};

// Buscar por texto
const searchCasas = async (texto) => {
    const [rows] = await db.query(
        'SELECT * FROM casas_productoras_heroes WHERE nombre LIKE ?',
        [`%${texto}%`]
    );
    return rows;
};

// Crear
const createCasa = async (data) => {
    const { nombre, pais, tipo_medio, heroes_famosos } = data;

    const [result] = await db.query(
        `INSERT INTO casas_productoras_heroes 
        (nombre, pais, tipo_medio, heroes_famosos) 
        VALUES (?, ?, ?, ?)`,
        [nombre, pais, tipo_medio, heroes_famosos]
    );

    return result;
};

// Actualizar
const updateCasa = async (id, data) => {
    const { nombre, pais, tipo_medio, heroes_famosos } = data;

    const [result] = await db.query(
        `UPDATE casas_productoras_heroes 
        SET nombre=?, pais=?, tipo_medio=?, heroes_famosos=? 
        WHERE id=?`,
        [nombre, pais, tipo_medio, heroes_famosos, id]
    );

    return result;
};

// Verificar si tiene héroes asociados
const tieneHeroes = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM heroes WHERE productora_id = ?',
        [id]
    );
    return rows.length > 0;
};

// Eliminar
const deleteCasa = async (id) => {
    const [result] = await db.query(
        'DELETE FROM casas_productoras_heroes WHERE id = ?',
        [id]
    );
    return result;
};

module.exports = {
    getCasas,
    getCasaById,
    searchCasas,
    createCasa,
    updateCasa,
    deleteCasa,
    tieneHeroes
};