import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }); 

    const { email, nombre, token } = datos

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
                <p>Hola: ${nombre}, Confirma tu cuenta en BienesRaices.com</p>

                <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
    })
}

// segundo email olvide password
const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }); 

    const { email, nombre, token } = datos

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu Password en BienesRaices.com',
        text: 'Reestablece tu Password en BienesRaices.com',
        html: `
                <p>Hola: ${nombre}, haz solicitado reestablecer tu password en BienesRaices.com</p>

                <p>Sigue el siguiente enlace para generar un nuevo password:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Password</a></p>

                <p>Si tu no solicitaste este cambio de password, puedes ignorar este mensaje</p>`
    })

}

export {
    emailRegistro,
    emailOlvidePassword
}


