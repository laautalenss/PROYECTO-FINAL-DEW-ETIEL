// VUE.JS
const app = Vue.createApp({
  data() {
    return {
      productos: [
        { name: 'Masajeador de Cuello', precio: '189.99 €', img: 'imgs/imgs_productos/masaje_cuello.png' },
        { name: 'Masajeador de Espalda', precio: '234.99 €', img: 'imgs/imgs_productos/masaje_espalda.png' },
        { name: 'Masajeador de Pies', precio: '149.99 €', img: 'imgs/imgs_productos/masaje_pies.png' },
        { name: 'Pastillas para Dormir', precio: '16.99 €', img: 'imgs/imgs_productos/pastillas_dormir.png' },
        { name: 'Pistola de Masaje', precio: '89.99 €', img: 'imgs/imgs_productos/pistola.png' },
        { name: 'Plantillas Ortopédicas', precio: '70.50 €', img: 'imgs/imgs_productos/plantillas_pie.png' },
        { name: 'Vitaminas Bienestar', precio: '24.99 €', img: 'imgs/imgs_productos/vitaminas_bienestar.png' },
        { name: 'Vitaminas Diarias', precio: '18.99 €', img: 'imgs/imgs_productos/vitaminas_diarias.png' }
      ],

      carrito: [], 

      vistaActual: 'tienda'
    }
  },
  methods: {

    //FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
    agregarAlCarrito(producto) {
      //PUSH PARA AÑADIR EL OBJETO A LA ARRAY DE CARRITO:
      this.carrito.push(producto);
      localStorage.setItem('carritoSoma', JSON.stringify(this.carrito));
      console.log("Carrito actual:", this.carrito);
    },

    //FUNCION PARA NAVEGAR
    cambiarVista(nuevaVista) {
      this.vistaActual = nuevaVista;
    }
  }
})
app.mount('#app')

// CARRUSEL
const track = document.querySelector(".carrusel-pista");
const slides = document.querySelectorAll(".diapositiva");

let index = 1; // empezamos en la primera real
const DELAY = 3000;

function updateCarousel(animate = true) {
    track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
    track.style.transform = `translateX(-${index * 100}%)`;
}

// Posición inicial
updateCarousel(false);

// Autoplay
setInterval(() => {
    console.log('Cambiando slide, index:', index);
    index++;
    updateCarousel();

    // Si llegamos al clon final
    if (index === slides.length - 1) {
        setTimeout(() => {
            index = 1;
            updateCarousel(false);
        }, 500);
    }

    // Si llegamos al clon inicial (por seguridad)
    if (index === 0) {
        setTimeout(() => {
            index = slides.length - 2;
            updateCarousel(false);
        }, 500);
    }
}, DELAY);

