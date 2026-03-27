const express = require('express')
const cors = require('cors')

const { bdmysql, bdmysqlNube } = require('../database/mySqlConnection');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.pathsMySql = {
            auth: '/api/auth',
            prueba: '/api/prueba',
            heroes: '/api/heroes',
            usuarios: '/api/usuarios',
            casasProductoras: '/api/casas-productoras',
        }
                   
        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos... DESDE LA CLASE')
        })

        //Aqui me conecto a la BD LOCAL
        //this.dbConnection();

        //Aqui me conecto a la BD NUBE
        this.dbConnectionNube();

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

    routes() {
        //this.app.use(this.pathsMySql.auth, require('../routes/MySqlAuth'));
        //this.app.use(this.pathsMySql.prueba, require('../routes/prueba'));

        // HEROES
        this.app.use(this.pathsMySql.heroes, require('../routes/heroes.route'));
        
        // USUARIOS
        this.app.use(this.pathsMySql.usuarios, require('../routes/usuarios.route'));

        // CASAS PRODUCTORAS
        this.app.use(this.pathsMySql.casasProductoras, require('../routes/casasProductoras.route'));
    }
    
    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y Parseo del body
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