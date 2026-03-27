const { response, request } = require('express');

const { Heroes } = require('../models/mySqlHeroes.model');
const { bdmysqlNube } = require('../database/mySqlConnection');

const heroesGet = async (req, res = response) => {
    try {
        const unosHeroes = await Heroes.findAll();

        res.json({
            ok: true,
            data: unosHeroes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

const heroeIdGet = async (req, res = response) => {
    const { id } = req.params;

    try {
        const unHeroe = await Heroes.findByPk(id);

        if (!unHeroe) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un heroe con el id: ' + id
            });
        }

        res.json({
            ok: true,
            data: unHeroe
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

const heroesComoGet = async (req = request, res = response) => {
    const { termino } = req.params;

    try {
        const [results] = await bdmysqlNube.query(
            "SELECT nombre, bio FROM heroes WHERE nombre LIKE ? ORDER BY nombre",
            {
                replacements: [`%${termino}%`]
            }
        );

        res.json({
            ok: true,
            data: results,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

const heroesPost = async (req, res = response) => {
    const { nombre, bio, img, aparicion, casa, productora_id } = req.body;

    try {
        const existeHeroe = await Heroes.findOne({ where: { nombre } });

        if (existeHeroe) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un Heroe llamado: ' + nombre
            });
        }

        // Validar productora si fue enviada
        if (productora_id !== undefined && productora_id !== null) {
            const [productora] = await bdmysqlNube.query(
                'SELECT id FROM casas_productoras_heroes WHERE id = ?',
                {
                    replacements: [productora_id]
                }
            );

            if (productora.length === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La casa productora indicada no existe'
                });
            }
        }

        const heroe = new Heroes({
            nombre,
            bio,
            img,
            aparicion,
            casa,
            productora_id
        });

        const newHeroe = await heroe.save();

        res.json({
            ok: true,
            msg: 'Heroe INSERTADO',
            data: newHeroe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

const heroePut = async (req, res = response) => {
    const { id } = req.params;
    const { body } = req;

    try {
        const heroe = await Heroes.findByPk(id);

        if (!heroe) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un heroe con el id: ' + id
            });
        }

        // Validar productora si fue enviada
        if (body.productora_id !== undefined && body.productora_id !== null) {
            const [productora] = await bdmysqlNube.query(
                'SELECT id FROM casas_productoras_heroes WHERE id = ?',
                {
                    replacements: [body.productora_id]
                }
            );

            if (productora.length === 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La casa productora indicada no existe'
                });
            }
        }

        await heroe.update(body);

        res.json({
            ok: true,
            msg: "Heroe ACTUALIZADO",
            data: heroe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

const heroeDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const heroe = await Heroes.findByPk(id);

        if (!heroe) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un heroe con el id: ' + id
            });
        }

        await heroe.destroy();

        res.json({
            ok: true,
            msg: "Heroe ELIMINADO",
            data: heroe,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        });
    }
};

module.exports = {
    heroesGet,
    heroeIdGet,
    heroesComoGet,
    heroesPost,
    heroePut,
    heroeDelete
};