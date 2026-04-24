const express = require('express')
const cors = require('cors')

const { bdmysql,bdmysqlNube } = require('../database/mySqlConnection');

const { dbConnectionMongo } = require('../database/mongoConnection');


class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;


        
        this.pathsMySql = {
            auth: '/api/auth',
            prueba: '/api/prueba',
            heroes: '/api/heroes',
            usuarios: '/api/usuarios',
            casas: '/api/casasproductoras',
        }

        
        this.pathsMyMongo = {
            heroes: '/api/heroesm',
            casas: '/api/casasproductorasm',
            usuarios: '/api/usuariosm',
            peliculas: '/api/peliculasm',
            protagonistas: '/api/protagonistasm',
        }

        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos... DESDE LA CLASE')
        })
       

        //Aqui me conecto a la BD LOCAL
        //this.dbConnection();

        //Aqui me conecto a la BD NUBE
        this.dbConnectionNube();

        //Aqui me conecto a la BD Mongo
        this.conectarBDMongo();


        //Middlewares
        this.middlewares();

        //Routes
        this.routes();

    }

    async dbConnection() {
        try {
            await bdmysql.authenticate();
            console.log('Connection OK a MySQL LOCAL');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL LOCAL', error);
        }
    }   

    async dbConnectionNube() {
        try {
            await bdmysqlNube.authenticate();
            console.log('Connection OK a MySQL NUBE');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL NUBE', error);
        }
    }   

    async conectarBDMongo(){
        await dbConnectionMongo();
    }

    
    routes() {
    // MYSQL
    this.app.use(this.pathsMySql.heroes, require('../routes/heroes.route'));
    this.app.use(this.pathsMySql.usuarios, require('../routes/usuarios.route'));
    this.app.use(this.pathsMySql.casas, require('../routes/casasProductoras.route'));

    // MONGO
    this.app.use(this.pathsMyMongo.heroes, require('../routes/heroes.mongo.route'));
    this.app.use(this.pathsMyMongo.casas, require('../routes/casasProductoras.mongo.route'));
    this.app.use(this.pathsMyMongo.usuarios, require('../routes/usuarios.mongo.route'));
    this.app.use(this.pathsMyMongo.peliculas, require('../routes/peliculas.mongo.route'));
    this.app.use(this.pathsMyMongo.protagonistas, require('../routes/protagonistas.mongo.route'));
    }
    
    
    middlewares() {
        //CORS
        //Evitar errores por Cors Domain Access
        //Usado para evitar errores.
        this.app.use(cors());


        //Lectura y Parseo del body
        //JSON
       
        //JSON (JavaScript Object Notation)
        //es un formato ligero de intercambio de datos.
        //JSON es de fácil lectura y escritura para los usuarios.
        //JSON es fácil de analizar y generar por parte de las máquinas.
        //JSON se basa en un subconjunto del lenguaje de programación JavaScript,
        //Estándar ECMA-262 3a Edición - Diciembre de 1999.
       
        this.app.use(express.json());


        //Directorio publico
        this.app.use(express.static('public'));

    }
    

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;