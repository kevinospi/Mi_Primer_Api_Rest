const {
    getCasas,
    getCasaById,
    searchCasas,
    createCasa,
    updateCasa,
    deleteCasa,
    tieneHeroes
} = require('../models/mySqlCasasProductoras.model');

// Obtener todas las casas productoras
const obtenerCasas = async (req, res) => {
    try {
        const casas = await getCasas();

        res.json({
            ok: true,
            msg: 'Lista de casas productoras',
            casas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar las casas productoras'
        });
    }
};

// Obtener una casa por ID
const obtenerCasaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const casa = await getCasaById(id);

        if (!casa) {
            return res.status(404).json({
                ok: false,
                msg: 'La casa productora no existe'
            });
        }

        res.json({
            ok: true,
            casa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar la casa productora'
        });
    }
};

// Buscar casas por texto
const buscarCasas = async (req, res) => {
    try {
        const { texto } = req.params;

        const casas = await searchCasas(texto);

        res.json({
            ok: true,
            resultados: casas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar casas productoras'
        });
    }
};

// Crear casa productora
const crearCasa = async (req, res) => {
    try {
        const { nombre, pais, tipo_medio, heroes_famosos } = req.body;

        const result = await createCasa({
            nombre,
            pais,
            tipo_medio,
            heroes_famosos
        });

        res.status(201).json({
            ok: true,
            msg: 'Casa productora creada correctamente',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la casa productora'
        });
    }
};

// Actualizar casa productora
const actualizarCasa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, pais, tipo_medio, heroes_famosos } = req.body;

        const casa = await getCasaById(id);

        if (!casa) {
            return res.status(404).json({
                ok: false,
                msg: 'La casa productora no existe'
            });
        }

        await updateCasa(id, {
            nombre,
            pais,
            tipo_medio,
            heroes_famosos
        });

        res.json({
            ok: true,
            msg: 'Casa productora actualizada correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la casa productora'
        });
    }
};

// Eliminar casa productora
const eliminarCasa = async (req, res) => {
    try {
        const { id } = req.params;

        const casa = await getCasaById(id);

        if (!casa) {
            return res.status(404).json({
                ok: false,
                msg: 'La casa productora no existe'
            });
        }

        const existeRelacion = await tieneHeroes(id);

        if (existeRelacion) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede eliminar la casa productora porque tiene héroes asociados'
            });
        }

        await deleteCasa(id);

        res.json({
            ok: true,
            msg: 'Casa productora eliminada correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la casa productora'
        });
    }
};

module.exports = {
    obtenerCasas,
    obtenerCasaPorId,
    buscarCasas,
    crearCasa,
    actualizarCasa,
    eliminarCasa
};