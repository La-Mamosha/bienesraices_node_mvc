import { check, validationResult } from "express-validator"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from "../models/Usuario.js"
import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {

    // Validación
    await check('email').isEmail().withMessage('Escribe un email valido').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)
    
    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){   
        // Errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { email, password } = req.body

    // Comprobamos si el usuario existe
    const usuario = await Usuario.findOne({where: { email }})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{
                msg: 'El usuario no existe'}]
        })
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{
                msg: 'Tu cuenta no ha sido confirmada'}]
        })
    }
    
    // Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{
                msg: 'El password es incorrecto'}]
        })
    }

    // Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})

    console.log(token)

    // Almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true, (Nos genera un JWT siempre y cuando tengamos el certificado. )
        //sameSite: true (Nos genera un JWT siempre y cuando tengamos el certificado. )
    }).redirect('/mis-propiedades')

}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {

    // Validación
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Escribe un email valido').run(req)
    await check('password').isLength({min: 6}).withMessage('El password debe ser minimo de 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)
    //await check('repetir_password').equals('password').withMessage('Los password no son iguales').run(req)
    
    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer los datos
    const { nombre, email, password } = req.body

    // Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where: { email }})
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{
                msg: 'El usuario ya esta registrado'
            }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Almacenar un usuario 
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // Envia Email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un email de verificación, Revisa tu email para confirmar tu cuenta'
    })
}

// Función que combprueba una cuenta
const confirmar = async (req, res) => {
    
    const { token } = req.params;

    console.log(token)

    // Verificar que el token sea valido
    const usuario = await Usuario.findOne({where: { token }})

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirma tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intentalo de nuevo',
            error: true
        })
    }

    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Tu cuenta ha sido confirmada',
        mensaje: 'Hemos confirmado tu cuenta correctamente, ya puedes iniciar sesion',
    })

}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Escribe un email valido').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
            
        })
    }

    // Buscar el usuario 
    const { email } = req.body

    const usuario = await Usuario.findOne({where: { email }})

    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{
                msg: 'El Email no pertenece a ningun usuario'
            }],
            
        })
    }

    // Generar el token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    // Envia Email de confirmación
    emailOlvidePassword({
        email: usuario.email, 
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}


const combrobarToken = async (req, res) => {
    
    const  { token } = req.params;

    const usuario = await Usuario.findOne({where: { token }})
    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Restablece tu password',
            mensaje: 'Hubo un error al validar tu informacion, intentalo de nuevo',
            error: true
        })
    }

    // Mostrar el formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Restablece tu password',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword = async (req, res) => {
    
    // Validar el password}
    await check('password').isLength({min: 6}).withMessage('El password debe ser minimo de 6 caracteres').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        // Errores
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    // Identificar quien hace la peticion
    const usuario = await Usuario.findOne({where: { token }})

    // Hashear el password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password reestablecido correctamente',
        mensaje: 'Tu password se ha modificado correctamente'
    })
    
}


export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    combrobarToken,
    nuevoPassword,

}


