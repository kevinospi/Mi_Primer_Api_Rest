const { Schema, model } = require('mongoose');

const CasaProductoraSchema = Schema(
  {
    id: {
      type: Number,
      required: [true, 'El id de MySQL es obligatorio'],
      unique: true
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio']
    },
    pais: {
      type: String,
      required: [true, 'El país es obligatorio']
    },
    tipo_medio: {
      type: String,
      required: [true, 'El tipo de medio es obligatorio']
    },
    heroes_famosos: {
      type: String,
      required: false,
      default: ''
    }
  },
  {
    collection: 'casas_productoras'
  }
);

CasaProductoraSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

module.exports = model('casa_productora', CasaProductoraSchema);