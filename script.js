// VUE.JS
const app = Vue.createApp({
  data() {
    return {
      //aqui se guarda desde productos.php
      productos: [],
      carrito: [],
      vistaActual: "tienda",

      //aqui se guarda desde el formulario de registrarse
      usuarioNuevo: {
        nombre: "",
        id: "",
        email: "",
        telefono: "",
        cuenta: "",
      },

      //usuario ya registrado/logueado
      usuarioYaRegistrado: null,
    };
  },

  mounted() {
    //CARGAR PRODUCTOS
    this.cargarProductos();

    //RECUPERAR USUARIO SI EXISTE
    const usuarioGuardado = sessionStorage.getItem("usuarioSoma");
    if (usuarioGuardado) {
      this.usuarioYaRegistrado = JSON.parse(usuarioGuardado);
      this.vistaActual = "tienda";

      console.log("Bienvenido de nuevo ", this.usuarioYaRegistrado.nombre);
    }
  },

  methods: {
    //FUNCION PARA CARGAR PRODUCTOS DESDE EL PHP
    cargarProductos() {
      fetch("productos.php")
        .then((res) => res.json())
        .then((data) => {
          this.productos = data;
        })
        .catch((error) => console.error("Error cargando productos:", error));
    },

    //FUNCION PARA AGREGAR PRODUCTOS AL CARRITO
    agregarAlCarrito(producto) {
      //PUSH PARA AÑADIR EL OBJETO A LA ARRAY DE CARRITO:
      this.carrito.push(producto);
      localStorage.setItem("carritoSoma", JSON.stringify(this.carrito));
      console.log("Carrito actual:", this.carrito);
    },

    //FUNCION PARA CONFIRMAR PEDIDO
    confirmarPedido() {
      if (this.carrito.length > 0) {
        alert("¡Gracias por tu compra! El total es: " + this.totalCarrito + "€");
        this.carrito = [];
        localStorage.removeItem("carritoSoma");
        this.vistaActual = "tienda"; //volver a la tienda
      }
    },

    //FUNCION PARA NAVEGAR
    cambiarVista(nuevaVista) {
      this.vistaActual = nuevaVista;
    },

    validarRegistro() {
      //REGEXS
      const regexID = /^\d{5}$/;
      const regexTel = /^[679]\d{8}$/;
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      //COMPROBACIONES
      if (!regexID.test(this.usuarioNuevo.id)) {
        alert("Error: El ID debe tener 5 números.");
      } else if (!regexTel.test(this.usuarioNuevo.telefono)) {
        alert("Error: El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9.");
      } else if (!regexEmail.test(this.usuarioNuevo.email)) {
        alert("Error: El correo electrónico no es válido.");
      } else {
        //SI LAS VALIDACIONES PASAN, ENVIAMOS AL PHP
        fetch("usuarios.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.usuarioNuevo),
        })
          .then((res) => res.json())
          .then((data) => {
            alert("¡Registro completado y guardado en la base de datos!");

            //GUARDAR EN SESSIONSTORAGE Y LOGUEAR AL USUARIO
            sessionStorage.setItem("usuarioSoma", JSON.stringify(this.usuarioNuevo));

            //COPIAR DATOS A USUARIO LOGUEADO
            this.usuarioYaRegistrado = { ...this.usuarioNuevo };

            //LIMPIAR FORMULARIO
            this.usuarioNuevo = {
              nombre: "",
              id: "",
              email: "",
              telefono: "",
              cuenta: "",
            };

            this.vistaActual = "tienda";
          })
          .catch((error) => {
            console.error("Error al registrar:", error);
            alert("Hubo un error al conectar con el servidor.");
          });
      }
    },
    //FUNCION PARA CERRAR SESION
    cerrarSesion() {
      this.usuarioYaRegistrado = null;
      sessionStorage.removeItem("usuarioSoma");
      this.vistaActual = "tienda";
      alert("Sesión cerrada");
    },
  },
  //PARA CALCULAR AUTOMATICAMENTE CADA VEZ QUE EL CARRITO CAMBIE
  computed: {
    totalCarrito() {
      let total = 0;

      //sumar el precio de cada producto que este en el carrito
      for (let i = 0; i < this.carrito.length; i++) {
        total += parseFloat(this.carrito[i].precio);
      }
      return total.toFixed(2); //DOS DECIMALES
    },
  },
});

//COMPONENTE (FOOTER)
app.component("footer-soma", {
  template: `
    <footer class="soma-footer">
        <p>&copy; 2026 SOMA ESSENTIALS - Salud y Bienestar</p>
        <p>Calle Bienestar 1, San Bartolomé | contacto@soma.com</p>
    </footer>
  `,
});

app.mount("#app");

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
  console.log("Cambiando slide, index:", index);
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
