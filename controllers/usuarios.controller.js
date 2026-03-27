const { response } = require('express');
const { Usuarios } = require('../models/usuarios.model');

const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

// INSERT un usuario
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, img, rol, google } = req.body;

    const usuario = new Usuarios({ nombre, correo, password, img, rol, google });

    try {
        const existeUsuario = await Usuarios.findOne({ where: { correo: correo } });

        if (existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un Usuario con el correo ' + correo
            });
        }

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(usuario.password, salt);

        const newUsuario = await usuario.save();

        res.json({
            ok: true,
            msg: "Usuario Creado",
            data: newUsuario
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

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuarios.findOne({ where: { correo: correo } });
        console.log(usuario);

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario / Password no son correctos - correo: " + correo,
            });
        }

        if (!usuario.estado) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario / Password no son correctos - estado: false",
            });
        }

        const validaPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validaPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario / Password no son correctos - password",
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: "Login ok",
            usuario,
            token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador...",
            error: error,
        });
    }
};

const usuariosGet = async (req, res = response) => {
    try {
        const unosUsuarios = await Usuarios.findAll();

        res.json({
            ok: true,
            data: unosUsuarios
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
    usuariosPost,
    login,
    usuariosGet
};