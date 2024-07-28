import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

Propiedad.belongsTo(Precio, {foreignkey: 'precioId'}) // Relacion de precio y propiedad
Propiedad.belongsTo(Categoria, {foreignkey: 'categoriaId'}) // Relacion de categoria y propiedad
Propiedad.belongsTo(Usuario, {foreignkey: 'usuarioId'}) // Relacion de usuario y propiedad
Propiedad.hasMany(Mensaje, {foreignkey: 'propiedadId'}) // Relacion de mensajes y propiedad

Mensaje.belongsTo(Propiedad, {foreignkey: 'propiedadId'})
Mensaje.belongsTo(Usuario, {foreignkey: 'usuarioId'})

export { 
    Propiedad, 
    Precio, 
    Categoria, 
    Usuario,
    Mensaje 
}

