(function(){
    const lat = -33.4489;
    const lng = -70.6693;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = [];

    // Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value // +e para convertir el valor a numerico
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value // +e para convertir el valor a numerico
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades' 
            const respuesta = await fetch(url) // Consumiendo la API o JSON
            propiedades = await respuesta.json() // Resultado de la consulta
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {

        // Limpiando los markers previos
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            // Agregando los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true // Para centrar la vista
            })
            .addTo(mapa) // Va creando los pines
            .bindPopup(`
                <p class="text-green-600 font-bold">${propiedad.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-2"> ${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-green-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
            `) 
            markers.addLayer(marker) // Permite limpiar
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter( filtrarCategorias ).filter( filtrarPrecios )
        mostrarPropiedades(resultado)
    }


    const filtrarCategorias = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
        
        const filtrarPrecios = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad
        

    obtenerPropiedades() //Llamado a la función
})()
