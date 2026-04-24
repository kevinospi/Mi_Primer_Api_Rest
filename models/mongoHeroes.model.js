const { Schema, model } = require('mongoose');

const HeroeSchema = Schema({

    id: {
        type: Number,
        //required: [true, 'El id es obligatorio'],
        //unique: true
    },


    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    bio: {
        type: String,
        required: [true, 'La biografia es obligatoria'],
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    aparicion: {
        type: Date,
        required: 'Debe tener una fecha de Aparicion'
    },
    casa: {
        type: String,
        required: false,
        default: ''
    },
    productora_id: {
        type: Number,
        required: [true, 'La productora_id es obligatoria'],
    },
  
    id_casa_productora: {
        type: Schema.Types.ObjectId,
        ref: 'casa_productora',
        required: false
    },

},
    //Direccionamos el modelo a la Coleccion
    {
        collection: 'Heroesnuevos'  // Especificar el nombre de la colección
    }
);

HeroeSchema.methods.toJSON = function () {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Heroe', HeroeSchema);




