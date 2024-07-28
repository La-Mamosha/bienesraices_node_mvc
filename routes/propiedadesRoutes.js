import express from "express"
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedadController.js'
import protegerRuta from "../middleware/protegerRuta.js"
import upload from '../middleware/subirImagen.js'
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción del anuncio es obligatoria')
        .isLength({max: 200}).withMessage('La descripción es demasiada larga'), // shif + alt + flecha abajo = Duplica la linea
    body('categoria').isNumeric().withMessage('Seleccione una categoria'),
    body('precio').isNumeric().withMessage('Seleccione un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Seleccione la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleccione la cantidad de estacionamiento'),
    body('wc').isNumeric().withMessage('Seleccione la cantidad de baños'),
    body('wc').isNumeric().withMessage('Seleccione la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id', 
    protegerRuta,
    agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/propiedades/editar/:id', 
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción del anuncio es obligatoria')
        .isLength({max: 200}).withMessage('La descripción es demasiada larga'), // shif + alt + flecha abajo = Duplica la linea
    body('categoria').isNumeric().withMessage('Seleccione una categoria'),
    body('precio').isNumeric().withMessage('Seleccione un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Seleccione la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleccione la cantidad de estacionamiento'),
    body('wc').isNumeric().withMessage('Seleccione la cantidad de baños'),
    body('wc').isNumeric().withMessage('Seleccione la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios
)

router.post('/propiedades/eliminar/:id', 
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

// Area publica
router.get('/propiedad/:id', 
    identificarUsuario,
    mostrarPropiedad
)

// Almacenar los mensajes
router.post('/propiedad/:id', 
    identificarUsuario,
    body('mensaje').isLength({min: 20}).withMessage('El mensaje es obligatorio o es demasiado corto'), // Vaqlidar el textarea de mostrar.pug
    enviarMensaje
)

router.get('/mensajes/:id', 
    protegerRuta,
    verMensajes
)

export default router