import bcrypt from 'bcryptjs'

const usuarios = [
    {
        nombre: 'Mamosha',
        email: 'Mamosha@gmail.com',
        confirmado : 1,
        password: bcrypt.hashSync('password', 10)
    },
    {
        nombre: 'Juan',
        email: 'Juan@gmail.com',
        confirmado : 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios