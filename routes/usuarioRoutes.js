import express from 'express';
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, combrobarToken, nuevoPassword } from '../controllers/usuarioController.js';

const router = express.Router(); 

router.get('/login', formularioLogin);
router.post('/login', autenticar);

// Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro',  formularioRegistro);
router.post('/registro',  registrar);

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password',  formularioOlvidePassword);
router.post('/olvide-password',  resetPassword);

// Almacena el nuevo Password 
router.get('/olvide-password/:token', combrobarToken);
router.post('/olvide-password/:token', nuevoPassword);




export default router