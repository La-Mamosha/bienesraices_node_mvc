
const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId // Quiere decir que es el vendedor
}

const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    const opciones = {
        weekday: 'long', // Nombre del día completo
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones) // Formatamos la fecha en español
}

// Lo exportamos como un objeto porque vamos a tener otras funciones
export {
    esVendedor,
    formatearFecha
}