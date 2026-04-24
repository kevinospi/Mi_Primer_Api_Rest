const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    nombre: {
      type: String,
      required: true
    },
    correo: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    img: {
      type: String
    },
    rol: {
      type: String
    },
    estado: {
      type: Boolean,
      default: true
    },
    google: {
      type: Boolean,
      default: false
    },
    fecha_creacion: {
      type: Date
    },
    fecha_actualizacion: {
      type: Date
    }
  },
  {
    collection: 'usuarios'
  }
);

module.exports = model('usuario', UsuarioSchema);