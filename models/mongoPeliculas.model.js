const { Schema, model } = require('mongoose');

const PeliculaSchema = Schema(
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
    multimedia: [
      {
        tipo: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        descripcion: {
          type: String,
          default: ''
        }
      }
    ]
  },
  {
    collection: 'peliculas'
  }
);

PeliculaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

module.exports = model('pelicula', PeliculaSchema);