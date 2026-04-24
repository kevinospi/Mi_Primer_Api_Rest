const { Schema, model } = require('mongoose');

const ProtagonistaSchema = Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },

    heroes_id: {
      type: Number
    },

    peliculas_id: {
      type: Number
    },

    id_heroe: {
      type: Schema.Types.ObjectId,
      ref: 'Heroe',
      required: true
    },

    id_pelicula: {
      type: Schema.Types.ObjectId,
      ref: 'pelicula',
      required: true
    },

    papel: {
      type: String,
      required: true
    },

    fecha_participacion: {
      type: Date
    }
  },
  {
    collection: 'protagonistas'
  }
);

ProtagonistaSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

module.exports = model('protagonista', ProtagonistaSchema);