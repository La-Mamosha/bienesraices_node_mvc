import { exit } from 'node:process'
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js";

import { where } from 'sequelize';
import { truncate } from 'node:fs';

const importarDatos = async () => {
    try {
        // Autenticar en la base de datos
        await db.authenticate();

        // Generar las Columnas
        await db.sync();

        // Insertamos los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)

        ])

        console.log('Datos importados correctamente')
        exit()
        
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        //])

        await db.sync({force: true});

        console.log('Datos eliminadas correctamente');
        exit();
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === "-i"){
    importarDatos(); 
}

if(process.argv[2] === "-e"){
    eliminarDatos(); 
}
