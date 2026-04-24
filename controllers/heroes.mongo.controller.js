const { response } = require("express");
const  Heroe = require("../models/mongoHeroes.model");


//const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const obtenerHeroes = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    //const query = { estado: true };


    try {
        const [total, heroes] = await Promise.all([
            Heroe.countDocuments(),
            Heroe.find({})
                //.populate("id_casa_productora", "nombre")

                .skip(Number(desde))
                //.sort({ nombre: 1 })
                .limit(Number(limite)),
        ]);


        res.json({ Ok: true, 
                   total: total, 
                   resp: heroes });
    } catch (error) {
        res.json({ Ok: false, 
            resp: error });
    }
};

const obtenerHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {
    const heroe = await Heroe.findById(id)
                .populate("id_casa_productora", "nombre")
;
     
    res.json({ Ok: true, resp: heroe });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};


const crearHeroe = async (req, res = response) => {


  const body = req.body;
 
  try {


    const heroeDB = await Heroe.findOne({ nombre: body.nombre });


    if (heroeDB) {
      return res
      //.status(400)
      .json({
        Ok: false,
        msg: `El Heroe ${body.nombre}, ya existe`,
      });
    }

  
    const heroe = new Heroe(body);


    //console.log(heroe);


    // Guardar DB
    await heroe.save();


    //console.log("CREADA",heroe);


    res
    //.status(201)
    .json({ Ok: true, msg: 'Heroe Insertado en Mongo', resp: heroe});
  } catch (error) {
    console.log("ERROR:INSERTAR",error);


    res.json({ Ok: false, msg:'Error al Insertar Heroe', resp: error });
  }
};


const actualizarHeroe = async (req, res = response) => {

  const { id } = req.params;
  
  const data  = req.body;


  console.log(data)


  try {


    /*
    if (data.nombre) {
        const heroeDB = await Heroe.findOne({ nombre: data.nombre });


        if (heroeDB) {
          return res.status(400).json({
            msg: `El Heroe ${data.nombre}, ya existe`,
          });
        }
    }
    */
   
    const heroe = await Heroe.findByIdAndUpdate(id, data, {
      new: true,
    });


    res.json({ Ok: true, msg: 'Heroe Actualizado', resp: heroe });
  } catch (error) {
    console.log("ERROR_MODIFICAR",error);
    res.json({ Ok: false, resp: error });
  }
};


const borrarHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {


    /*
    const [total, multimediaheroe] = await Promise.all([
      MultimediaHeroe.countDocuments({ IdHeroe: id }),
      MultimediaHeroe.find({ IdHeroe: id})
        //.limit(Number(limite)),
    ]);


    if (total > 0){
      return res
      //.status(400)
      .json({
        Ok: false,
        msg: `El Heroe tiene (${total}) multimedias asignadas y no puede ser borrado....`,
      });
    }
     
    else{
    */
      const heroeBorrado = await Heroe.findByIdAndDelete(id);


      res.json({ Ok: true, resp: heroeBorrado });


    //}


    /*
    const opcionBorrada = await Option.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );
    */


  } catch (error) {
    console.log("ERROR_BORRADO",error);
    res.json({ Ok: false, resp: error });
  }
};

const { Heroes } = require('../models/mySqlHeroes.model');
const CasaProductora = require('../models/mongoCasasProductoras.model');

const migrarHeroesMysqlAMongo = async (req, res = response) => {
  try {
    const heroesMySql = await Heroes.findAll();

    let insertados = 0;
    let actualizados = 0;
    let sinCasa = 0;

    for (const heroe of heroesMySql) {
      const casaMongo = await CasaProductora.findOne({
        id: heroe.productora_id
      });

      if (!casaMongo) {
        console.log(`Heroe sin casa en Mongo: ${heroe.nombre}`);
        sinCasa++;
        continue;
      }

      const existe = await Heroe.findOne({ id: heroe.id });

      const data = {
        id: heroe.id,
        nombre: heroe.nombre,
        bio: heroe.bio,
        img: heroe.img,
        aparicion: heroe.aparicion,
        casa: heroe.casa,
        productora_id: heroe.productora_id,
        id_casa_productora: casaMongo._id
      };

      if (existe) {
        await Heroe.findByIdAndUpdate(existe._id, data);
        actualizados++;
      } else {
        const nuevoHeroe = new Heroe(data);
        await nuevoHeroe.save();
        insertados++;
      }
    }

    res.json({
      ok: true,
      msg: 'Migración de héroes completada',
      total: heroesMySql.length,
      insertados,
      actualizados,
      sinCasa
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error migrando héroes',
      error
    });
  }
};



module.exports = {
    obtenerHeroes,
    obtenerHeroe,
    crearHeroe,
    actualizarHeroe,
    borrarHeroe,
    migrarHeroesMysqlAMongo
};
