// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function() {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;  // El precio base es de 2000

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15; 
            break;
        case '2':
            cantidad = base * 1.05; 
            break;
        case '3':
            cantidad = base * 1.35; 
            break;
        default:
            break;
    }
    
    // Obtener el año y luego tener la diferencia
    const diferencia = new Date().getFullYear() - this.year;

    // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    cantidad -= ((0.03 * diferencia) * cantidad);
    
    /*
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es complesto se multiplica por un 50% más
    */
    if(this.tipo === 'basico') {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }
    return cantidad;
}

function UI() {}

// Lena las opciones de los años
UI.prototype.llenarOpciones = () => {
    // Se obtiene el año actual para el maximo, y se resta 15 para el mínimo
    const max = new Date().getFullYear();
    const min = max - 15;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {
        const option = document.createElement('OPTION');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    //Creamos la etiqueta div
    const div = document.createElement('DIV');

    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }
    div.classList.add('mensaje', 'mt-10')
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    },2000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    // Destructuring de seguro
    const {marca, year, tipo} = seguro;

    let textoMarca;
    switch(marca) {
        case '1':
            textoMarca = 'Americana';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Contenido HTML para mostrar
    const contenidoResultado = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal">${total}</span></p>
    `;

    // Crear el resultado total
    const div = document.createElement('DIV');
    div.classList.add('resultado', 'mt-10');
    div.innerHTML = contenidoResultado;

    const resultadoDiv = document.querySelector('#resultado');

    // Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    
    // Límite de tiempo para borar spinner y luego mostrar el div resultado
    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 2000);
    
}

UI.prototype.limpiarHTML = () => {
    // Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado');
    while(resultados.firstChild) {
        resultados.removeChild(resultados.firstChild);
    }
}

// Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    // Llena el select con los años
    ui.llenarOpciones();
})

// Función para EventListeners
eventListeners();

function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);    
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Obtener valores de marca, año y tipo seleccionado
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[type="radio"]:checked').value;

    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    // Desactivar temporalmente el botón de cotización
    const botonCotizar = document.querySelector('#cotizar-seguro button');
    botonCotizar.disabled = true;
    botonCotizar.classList.add('opacity-50', 'pointer-events-none');

    ui.limpiarHTML();

    ui.mostrarMensaje('Cotizando...', 'exito');

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    
    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);

    // Resetear el formulario después de un breve intervalo
    setTimeout(() => {
        document.querySelector('#cotizar-seguro').reset();
        botonCotizar.disabled = false; // Reactivar el botón
        botonCotizar.classList.remove('opacity-50', 'pointer-events-none');
    }, 2000);
}

