import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie parser
app.use( cookieParser() );

// Habilitar CSRF
app.use( csrf({cookie: true}) );

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Base de datos conectada corectamente');
} catch (error) {
    console.log(error);
}

// Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta Pública
app.use(express.static('public') );

// Routing
app.use('/', appRoutes);
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);



// Definir puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});











































































































