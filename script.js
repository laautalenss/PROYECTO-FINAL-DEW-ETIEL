// VUE.JS
const app = Vue.createApp({
  data() {
    return {
      //aqui se guarda desde productos.php
      productos: [],
      carrito: [],
      vistaActual: "tienda",

      //PRODUCTO SELECCIONADO PARA VISTA DETALLADA
      productoSeleccionado: null,

      //aqui se guarda desde el formulario de registrarse
      usuarioNuevo: {
        nombre: "",
        id: "",
        email: "",
        telefono: "",
        cuenta: "",
      },

      //ERRORES DE VALIDACION DEL FORMULARIO
      errores: {
        nombre: "",
        id: "",
        email: "",
        telefono: "",
        cuenta: "",
      },

      //usuario ya registrado/logueado
      usuarioYaRegistrado: null,

      //MODO DE AUTENTICACIÓN (login o registro)
      modoAutenticacion: "login",

      //DATOS PARA LOGIN
      usuarioLogin: {
        id: "",
        email: "",
      },
    };
  },

  mounted() {
    //CARGAR PRODUCTOS
    this.cargarProductos();

    //RECUPERAR CARRITO SI EXISTE
    const carritoGuardado = localStorage.getItem("carritoSoma");
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
      console.log("Carrito recuperado:", this.carrito);
    }

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
      //VERIFICAR SI EL USUARIO ESTA REGISTRADO
      if (!this.usuarioYaRegistrado) {
        alert("¡Debes registrarte para añadir productos al carrito!");
        this.vistaActual = "registro";
        return;
      }

      //VERIFICAR DISPONIBILIDAD DEL PRODUCTO
      if (producto.disponibilidad <= 0) {
        alert("Lo sentimos, este producto está agotado");
        return;
      }

      //PUSH PARA AÑADIR EL OBJETO A LA ARRAY DE CARRITO:
      this.carrito.push(producto);
      localStorage.setItem("carritoSoma", JSON.stringify(this.carrito));
      console.log("Carrito actual:", this.carrito);
    },

    //FUNCION PARA MOSTRAR DETALLES DE UN PRODUCTO
    verDetallesProducto(idProducto) {
      console.log("Click en producto con ID:", idProducto);
      console.log("Productos disponibles:", this.productos);

      //CONVERTIR A NUMERO POR SI ACASO
      const idBuscado = Number(idProducto);

      //BUSCAR EL PRODUCTO POR ID EN LA LISTA
      const producto = this.productos.find((p) => Number(p.id) === idBuscado);

      console.log("Producto encontrado:", producto);

      if (producto) {
        //GUARDAR PRODUCTO SELECCIONADO
        this.productoSeleccionado = producto;
        //CAMBIAR A VISTA DETALLE
        this.vistaActual = "detalle-producto";
        console.log("Vista cambiada a:", this.vistaActual);
      } else {
        console.log("No se encontró el producto con ID:", idBuscado);
        alert("Producto no encontrado. Verifica que esté cargado en la base de datos.");
      }
    },

    //FUNCION PARA CONFIRMAR PEDIDO
    confirmarPedido() {
      //VERIFICAR SI EL USUARIO ESTA REGISTRADO
      if (!this.usuarioYaRegistrado) {
        alert("¡Debes registrarte para realizar una compra!");
        this.vistaActual = "registro";
        return;
      }

      if (this.carrito.length > 0) {
        alert("¡Gracias por tu compra! El total es: " + this.totalCarrito + "€");
        this.carrito = [];
        localStorage.removeItem("carritoSoma");
        this.vistaActual = "tienda"; //volver a la tienda
      }
    },

    //FUNCION PARA ELIMINAR UN PRODUCTO DEL CARRITO
    eliminarDelCarrito(index) {
      //ELIMINAR PRODUCTO POR SU INDICE EN LA ARRAY
      this.carrito.splice(index, 1);

      //ACTUALIZAR LOCALSTORAGE
      localStorage.setItem("carritoSoma", JSON.stringify(this.carrito));

      console.log("Producto eliminado. Carrito actual:", this.carrito);
    },

    //FUNCION PARA NAVEGAR
    cambiarVista(nuevaVista) {
      this.vistaActual = nuevaVista;
    },

    //FUNCION PARA VALIDAR CAMPOS EN TIEMPO REAL
    validarCampo(campo) {
      //REGEXS
      const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
      const regexID = /^\d{5}$/;
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const regexTel = /^[679]\d{8}$/;
      const regexCuenta = /^ES\d{22}$/;

      //VALIDAR SEGUN EL CAMPO
      switch (campo) {
        case "nombre":
          if (!this.usuarioNuevo.nombre) {
            this.errores.nombre = "";
          } else if (!regexNombre.test(this.usuarioNuevo.nombre)) {
            this.errores.nombre = "Mínimo 3 caracteres, solo letras";
          } else {
            this.errores.nombre = "";
          }
          break;

        case "id":
          if (!this.usuarioNuevo.id) {
            this.errores.id = "";
          } else if (!regexID.test(this.usuarioNuevo.id)) {
            this.errores.id = "Debe tener exactamente 5 números";
          } else {
            this.errores.id = "";
          }
          break;

        case "email":
          if (!this.usuarioNuevo.email) {
            this.errores.email = "";
          } else if (!regexEmail.test(this.usuarioNuevo.email)) {
            this.errores.email = "Correo electrónico no válido";
          } else {
            this.errores.email = "";
          }
          break;

        case "telefono":
          if (!this.usuarioNuevo.telefono) {
            this.errores.telefono = "";
          } else if (!regexTel.test(this.usuarioNuevo.telefono)) {
            this.errores.telefono = "9 dígitos, debe empezar por 6, 7 o 9";
          } else {
            this.errores.telefono = "";
          }
          break;

        case "cuenta":
          if (!this.usuarioNuevo.cuenta) {
            this.errores.cuenta = "";
          } else if (!regexCuenta.test(this.usuarioNuevo.cuenta)) {
            this.errores.cuenta = "ES + 22 dígitos";
          } else {
            this.errores.cuenta = "";
          }
          break;
      }
    },

    //FUNCION PARA INICIAR SESION
    iniciarSesion() {
      if (!this.usuarioLogin.id || !this.usuarioLogin.email) {
        alert("Por favor, completa todos los campos");
        return;
      }

      //ENVIAR AL PHP PARA VERIFICAR
      fetch("usuarios.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "login",
          id: this.usuarioLogin.id,
          email: this.usuarioLogin.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.mensaje === "exito") {
            alert("¡Bienvenido de nuevo!");

            //GUARDAR USUARIO EN SESSIONSTORAGE
            sessionStorage.setItem("usuarioSoma", JSON.stringify(data.usuario));

            //ASIGNAR DATOS A USUARIO LOGUEADO
            this.usuarioYaRegistrado = data.usuario;

            //LIMPIAR FORMULARIO
            this.usuarioLogin = { id: "", email: "" };

            //VOLVER A LA TIENDA
            this.vistaActual = "tienda";
          } else {
            alert("Usuario no encontrado o datos incorrectos");
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
          alert("Error al iniciar sesión");
        });
    },

    validarRegistro() {
      //VALIDAR TODOS LOS CAMPOS
      this.validarCampo("nombre");
      this.validarCampo("id");
      this.validarCampo("email");
      this.validarCampo("telefono");
      this.validarCampo("cuenta");

      //VERIFICAR SI HAY ERRORES
      const hayErrores = Object.values(this.errores).some((error) => error !== "");
      const camposVacios = Object.values(this.usuarioNuevo).some((valor) => valor === "");

      if (camposVacios) {
        alert("Por favor, completa todos los campos");
        return;
      }

      if (hayErrores) {
        alert("Por favor, corrige los errores en el formulario");
        return;
      }

      //SI LAS VALIDACIONES PASAN, ENVIAMOS AL PHP
      fetch("usuarios.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "registro",
          ...this.usuarioNuevo,
        }),
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

          //LIMPIAR ERRORES
          this.errores = {
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
    },

    //FUNCION PARA CERRAR SESION
    cerrarSesion() {
      this.usuarioYaRegistrado = null;
      sessionStorage.removeItem("usuarioSoma");

      //LIMPIAR CARRITO AL CERRAR SESIÓN
      this.carrito = [];
      localStorage.removeItem("carritoSoma");

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
        <p>Calle Bienestar 1, Arrecife | contacto@soma.com</p>
    </footer>
  `,
});

app.mount("#app");

//IDIOMAS ESPAÑOL E INGLES
const traducciones = {
  es: {
    "menu-inicio": "Inicio",
    "menu-productos": "Productos",
    "menu-acercade": "Acerca de",
    carrito: "Carrito",
    "texto-idioma": "Idioma",
    "tab-login": "Iniciar Sesión",
    "tab-registro": "Registrarse",
    "titulo-login": "Iniciar Sesión",
    "btn-iniciar-sesion": "Iniciar Sesión",
    "productos-destacados": "Productos destacados",
    "nuestros-productos": "Nuestros Productos",
    "btn-agregar": "Añadir al carrito",
    "sin-stock": "Sin stock",
    "titulo-carrito": "Tu carrito",
    "carrito-vacio": "¡Tu carrito está vacío. Añade algo a tu carrito!",
    "btn-eliminar": "Eliminar",
    total: "Total",
    "btn-confirmar": "Confirmar Pedido",
    "btn-seguir-comprando": "Seguir comprando",
    "titulo-registro": "Registrarse",
    "btn-registrarse": "Registrarse",
    "btn-volver-tienda": "Volver a la tienda",
    "titulo-perfil": "Tu Perfil de Usuario",
    "campo-nombre": "Nombre:",
    "campo-email": "Email:",
    "campo-telefono": "Teléfono:",
    "btn-cerrar-sesion": "Cerrar Sesión",
    "titulo-acercade": "ACERCA DE NOSOTROS",
    "texto-acercade":
      "En SOMA creemos que el bienestar no tiene por qué ser complicado. Nacimos con la idea de que cuidar tu cuerpo y tu mente debe ser algo natural y accesible, sin términos extraños ni rutinas imposibles. Simplemente, estamos aquí para ayudarte a sentirte mejor cada día. Nos dedicamos a elegir productos que realmente marcan la diferencia en tu rutina. Desde vitaminas que te dan ese empujón extra hasta masajeadores diseñados para liberar el estrés acumulado, cada artículo en nuestra tienda ha sido seleccionado pensando en tu descanso y tu energía. No somos solo una tienda de salud; queremos ser tu aliado de confianza. En SOMA, nuestro compromiso es ofrecerte soluciones prácticas y honestas para que alcances tu mejor versión, siempre a tu ritmo y sin complicaciones.",
    "valor1-titulo": "Calidad Premium",
    "valor1-texto": "Productos seleccionados cuidadosamente para garantizar los mejores resultados",
    "valor2-titulo": "Bienestar Natural",
    "valor2-texto": "Soluciones naturales y efectivas para tu cuerpo y mente sin complicaciones",
    "valor3-titulo": "Confianza Total",
    "valor3-texto": "Tu aliado de confianza en el camino hacia tu mejor versión personal",
  },
  en: {
    "menu-inicio": "Home",
    "menu-productos": "Products",
    "menu-acercade": "About Us",
    carrito: "Cart",
    "texto-idioma": "Language",
    "tab-login": "Log In",
    "tab-registro": "Sign Up",
    "titulo-login": "Log In",
    "btn-iniciar-sesion": "Log In",
    "productos-destacados": "Featured Products",
    "nuestros-productos": "Our Products",
    "btn-agregar": "Add to cart",
    "sin-stock": "Out of stock",
    "titulo-carrito": "Your Cart",
    "carrito-vacio": "Your cart is empty. Add something to your cart!",
    "btn-eliminar": "Remove",
    total: "Total",
    "btn-confirmar": "Confirm Order",
    "btn-seguir-comprando": "Continue Shopping",
    "titulo-registro": "Sign Up",
    "btn-registrarse": "Register",
    "btn-volver-tienda": "Back to Store",
    "titulo-perfil": "Your User Profile",
    "campo-nombre": "Name:",
    "campo-email": "Email:",
    "campo-telefono": "Phone:",
    "btn-cerrar-sesion": "Log Out",
    "titulo-acercade": "ABOUT US",
    "texto-acercade":
      "At SOMA we believe that wellness doesn't have to be complicated. We were born with the idea that taking care of your body and mind should be natural and accessible, without strange terms or impossible routines. Simply, we are here to help you feel better every day. We are dedicated to choosing products that really make a difference in your routine. From vitamins that give you that extra boost to massagers designed to release accumulated stress, each item in our store has been selected with your rest and energy in mind. We are not just a health store; we want to be your trusted ally. At SOMA, our commitment is to offer you practical and honest solutions so that you can achieve your best version, always at your own pace and without complications.",
    "valor1-titulo": "Premium Quality",
    "valor1-texto": "Carefully selected products to guarantee the best results",
    "valor2-titulo": "Natural Wellness",
    "valor2-texto": "Natural and effective solutions for your body and mind without complications",
    "valor3-titulo": "Total Trust",
    "valor3-texto": "Your trusted ally on the path to your best personal version",
  },
};

//IDIOMA ACTUAL GUARDADO EN LOCALSTORAGE
let idiomaActual = localStorage.getItem("idiomaSoma") || "es";

//FUNCIÓN PARA CAMBIAR IDIOMA
function cambiarIdioma() {
  //ALTERNAR ENTRE ES Y EN
  idiomaActual = idiomaActual === "es" ? "en" : "es";

  //GUARDAR PREFERENCIA
  localStorage.setItem("idiomaSoma", idiomaActual);

  //APLICAR TRADUCCIONES
  aplicarTraducciones();
}

//FUNCIÓN PARA APLICAR LAS TRADUCCIONES AL DOM
function aplicarTraducciones() {
  const elementos = document.querySelectorAll("[data-traduccion]");

  elementos.forEach((elemento) => {
    const clave = elemento.getAttribute("data-traduccion");
    if (traducciones[idiomaActual][clave]) {
      elemento.textContent = traducciones[idiomaActual][clave];
    }
  });
}

//APLICAR IDIOMA AL CARGAR LA PÁGINA
window.addEventListener("DOMContentLoaded", () => {
  aplicarTraducciones();
});

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
