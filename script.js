// INICIALIZACIÓN DE VUE
const app = Vue.createApp({
  data() {
    return {
      // DATOS DE LOS PRODUCTOS CARGADOS DESDE LA BASE DE DATOS
      productos: [],
      carrito: [],
      vistaActual: "tienda",

      // PRODUCTO QUE SE MUESTRA EN DETALLE
      productoSeleccionado: null,

      // DATOS DEL FORMULARIO DE REGISTRO
      usuarioNuevo: {
        nombre: "",
        id: "",
        email: "",
        telefono: "",
        cuenta: "",
      },

      // MENSAJES DE ERROR PARA LOS CAMPOS DEL FORMULARIO
      errores: {
        nombre: "",
        id: "",
        email: "",
        telefono: "",
        cuenta: "",
      },

      // USUARIO ACTUALMENTE LOGUEADO
      usuarioYaRegistrado: null,

      // MODO DE AUTENTICACIÓN ACTIVO (LOGIN O REGISTRO)
      modoAutenticacion: "login",

      // CREDENCIALES PARA INICIAR SESIÓN
      usuarioLogin: {
        id: "",
        email: "",
      },
    };
  },

  // FUNCIÓN QUE SE EJECUTA AL CARGAR LA APLICACIÓN
  mounted() {
    // TRAER LOS PRODUCTOS DESDE EL SERVIDOR
    this.cargarProductos();

    // RECUPERAR CARRITO GUARDADO DEL NAVEGADOR
    const carritoGuardado = localStorage.getItem("carritoSoma");
    if (carritoGuardado) {
      // CONVERTIR EL JSON A OBJETO
      this.carrito = JSON.parse(carritoGuardado);
      console.log("Carrito recuperado:", this.carrito);
    }

    // VERIFICAR SI HAY UNA SESIÓN ACTIVA
    const usuarioGuardado = sessionStorage.getItem("usuarioSoma");
    if (usuarioGuardado) {
      // RESTAURAR DATOS DEL USUARIO
      this.usuarioYaRegistrado = JSON.parse(usuarioGuardado);
      this.vistaActual = "tienda";

      console.log("Bienvenido de nuevo ", this.usuarioYaRegistrado.nombre);
    }
  },

  // FUNCIONES DE LA APLICACIÓN
  methods: {
    // OBTENER TODOS LOS PRODUCTOS DESDE LA BASE DE DATOS
    cargarProductos() {
      fetch("productos.php")
        .then((res) => res.json())
        .then((data) => {
          // GUARDAR LOS PRODUCTOS EN EL ESTADO
          this.productos = data;
        })
        .catch((error) => console.error("Error cargando productos:", error));
    },

    // AÑADIR UN PRODUCTO AL CARRITO DE COMPRAS
    agregarAlCarrito(producto) {
      // COMPROBAR QUE EL USUARIO ESTÉ REGISTRADO
      if (!this.usuarioYaRegistrado) {
        alert("¡Debes registrarte para añadir productos al carrito!");
        this.vistaActual = "registro";
        return;
      }

      // COMPROBAR QUE HAYA STOCK DISPONIBLE
      if (producto.disponibilidad <= 0) {
        alert("Lo sentimos, este producto está agotado");
        return;
      }

      // AGREGAR PRODUCTO AL CARRITO Y GUARDARLO
      this.carrito.push(producto);
      localStorage.setItem("carritoSoma", JSON.stringify(this.carrito));
      console.log("Carrito actual:", this.carrito);
    },

    // MOSTRAR LA VISTA DETALLADA DE UN PRODUCTO
    verDetallesProducto(nombreProducto) {
      console.log("Click en producto:", nombreProducto);
      console.log("Productos disponibles:", this.productos);

      // ENCONTRAR EL PRODUCTO EN LA LISTA
      const producto = this.productos.find((p) => p.nombre === nombreProducto);

      console.log("Producto encontrado:", producto);

      if (producto) {
        // GUARDAR PRODUCTO PARA MOSTRARLO
        this.productoSeleccionado = producto;
        // IR A LA PÁGINA DE DETALLE
        this.vistaActual = "detalle-producto";
        console.log("Vista cambiada a:", this.vistaActual);
      } else {
        console.log("No se encontró el producto:", nombreProducto);
        alert("Producto no encontrado. Verifica que esté cargado en la base de datos.");
      }
    },

    // FINALIZAR LA COMPRA DEL CARRITO
    confirmarPedido() {
      // COMPROBAR QUE EL USUARIO ESTÉ REGISTRADO
      if (!this.usuarioYaRegistrado) {
        alert("¡Debes registrarte para realizar una compra!");
        this.vistaActual = "registro";
        return;
      }

      if (this.carrito.length > 0) {
        alert("¡Gracias por tu compra! El total es: " + this.totalCarrito + "€");
        this.carrito = [];
        localStorage.removeItem("carritoSoma");
        this.vistaActual = "tienda"; // REGRESAR AL INICIO
      }
    },

    // QUITAR UN PRODUCTO DEL CARRITO
    eliminarDelCarrito(index) {
      // BORRAR PRODUCTO POR SU POSICIÓN
      this.carrito.splice(index, 1);

      // ACTUALIZAR DATOS GUARDADOS
      localStorage.setItem("carritoSoma", JSON.stringify(this.carrito));

      console.log("Producto eliminado. Carrito actual:", this.carrito);
    },

    // CAMBIAR ENTRE LAS DIFERENTES PÁGINAS
    cambiarVista(nuevaVista) {
      this.vistaActual = nuevaVista;
    },

    // VALIDAR LOS CAMPOS DEL FORMULARIO MIENTRAS SE ESCRIBE
    validarCampo(campo) {
      // EXPRESIONES REGULARES PARA CADA CAMPO
      const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
      const regexID = /^\d{5}$/;
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const regexTel = /^[679]\d{8}$/;
      const regexCuenta = /^ES\d{22}$/;

      // APLICAR VALIDACIÓN SEGÚN EL CAMPO
      switch (campo) {
        // VALIDAR NOMBRE: MÍNIMO 3 CARACTERES, SOLO LETRAS
        case "nombre":
          if (!this.usuarioNuevo.nombre) {
            this.errores.nombre = "";
          } else if (!regexNombre.test(this.usuarioNuevo.nombre)) {
            this.errores.nombre = "Mínimo 3 caracteres, solo letras";
          } else {
            this.errores.nombre = "";
          }
          break;

        // VALIDAR ID: EXACTAMENTE 5 NÚMEROS
        case "id":
          if (!this.usuarioNuevo.id) {
            this.errores.id = "";
          } else if (!regexID.test(this.usuarioNuevo.id)) {
            this.errores.id = "Debe tener exactamente 5 números";
          } else {
            this.errores.id = "";
          }
          break;

        // VALIDAR EMAIL: FORMATO CORRECTO
        case "email":
          if (!this.usuarioNuevo.email) {
            this.errores.email = "";
          } else if (!regexEmail.test(this.usuarioNuevo.email)) {
            this.errores.email = "Correo electrónico no válido";
          } else {
            this.errores.email = "";
          }
          break;

        // VALIDAR TELÉFONO: 9 DÍGITOS, EMPEZANDO POR 6, 7 O 9
        case "telefono":
          if (!this.usuarioNuevo.telefono) {
            this.errores.telefono = "";
          } else if (!regexTel.test(this.usuarioNuevo.telefono)) {
            this.errores.telefono = "9 dígitos, debe empezar por 6, 7 o 9";
          } else {
            this.errores.telefono = "";
          }
          break;

        // VALIDAR CUENTA BANCARIA: FORMATO IBAN ESPAÑOL
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

    // AUTENTICAR UN USUARIO EXISTENTE
    iniciarSesion() {
      if (!this.usuarioLogin.id || !this.usuarioLogin.email) {
        alert("Por favor, completa todos los campos");
        return;
      }

      // ENVIAR CREDENCIALES AL SERVIDOR PARA VERIFICAR
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

            // GUARDAR DATOS DEL USUARIO EN EL NAVEGADOR
            sessionStorage.setItem("usuarioSoma", JSON.stringify(data.usuario));

            // ESTABLECER USUARIO COMO LOGUEADO
            this.usuarioYaRegistrado = data.usuario;

            // LIMPIAR CAMPOS DEL FORMULARIO
            this.usuarioLogin = { id: "", email: "" };

            // REGRESAR A LA TIENDA
            this.vistaActual = "tienda";
          } else {
            alert("Usuario no encontrado o datos incorrectos");
          }
        })
        .catch((error) => {
          // MOSTRAR ERROR SI FALLA LA CONEXIÓN
          console.error("Error al iniciar sesión:", error);
          alert("Error al iniciar sesión");
        });
    },

    validarRegistro() {
      // REVISAR TODOS LOS CAMPOS
      this.validarCampo("nombre");
      this.validarCampo("id");
      this.validarCampo("email");
      this.validarCampo("telefono");
      this.validarCampo("cuenta");

      // VER SI HAY ERRORES O CAMPOS VACÍOS
      const hayErrores = Object.values(this.errores).some((error) => error !== "");
      const camposVacios = Object.values(this.usuarioNuevo).some((valor) => valor === "");

      // VERIFICAR QUE TODOS LOS CAMPOS ESTÉN LLENOS
      if (camposVacios) {
        alert("Por favor, completa todos los campos");
        return;
      }

      // VERIFICAR QUE NO HAYA ERRORES DE VALIDACIÓN
      if (hayErrores) {
        alert("Por favor, corrige los errores en el formulario");
        return;
      }

      // ENVIAR LOS DATOS AL SERVIDOR PARA REGISTRAR
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
          // CONFIRMACIÓN DE REGISTRO EXITOSO
          alert("¡Registro completado y guardado en la base de datos!");

          // GUARDAR USUARIO Y AUTENTICARLO AUTOMÁTICAMENTE
          sessionStorage.setItem("usuarioSoma", JSON.stringify(this.usuarioNuevo));

          // ESTABLECER COMO USUARIO LOGUEADO
          this.usuarioYaRegistrado = { ...this.usuarioNuevo };

          // RESETEAR EL FORMULARIO
          this.usuarioNuevo = {
            nombre: "",
            id: "",
            email: "",
            telefono: "",
            cuenta: "",
          };

          // RESETEAR MENSAJES DE ERROR
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
          // MOSTRAR ERROR SI FALLA EL REGISTRO
          console.error("Error al registrar:", error);
          alert("Hubo un error al conectar con el servidor.");
        });
    },

    // DESCONECTAR AL USUARIO Y LIMPIAR DATOS
    cerrarSesion() {
      this.usuarioYaRegistrado = null;
      sessionStorage.removeItem("usuarioSoma");

      // VACIAR CARRITO AL SALIR
      this.carrito = [];
      localStorage.removeItem("carritoSoma");

      this.vistaActual = "tienda";
      alert("Sesión cerrada");
    },
  },
  // PROPIEDADES CALCULADAS AUTOMÁTICAMENTE
  computed: {
    // CALCULAR EL TOTAL DEL CARRITO
    totalCarrito() {
      let total = 0;

      // SUMAR EL PRECIO DE TODOS LOS PRODUCTOS DEL CARRITO
      for (let i = 0; i < this.carrito.length; i++) {
        total += parseFloat(this.carrito[i].precio);
      }
      return total.toFixed(2); // DOS DECIMALES
    },
  },
});

// COMPONENTE DEL PIE DE PÁGINA
app.component("footer-soma", {
  template: `
    <footer class="soma-footer">
        <p>&copy; 2026 SOMA ESSENTIALS - Salud y Bienestar</p>
        <p>Calle Bienestar 1, Arrecife | contacto@soma.com</p>
    </footer>
  `,
});

// INICIAR LA APLICACIÓN VUE
app.mount("#app");

// TRADUCCIONES DE LA WEB (ESPAÑOL E INGLÉS)
const traducciones = {
  // TEXTOS EN ESPAÑOL
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
  // TEXTOS EN INGLÉS
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

// IDIOMA GUARDADO EN EL NAVEGADOR
let idiomaActual = localStorage.getItem("idiomaSoma") || "es";

// ALTERNAR ENTRE ESPAÑOL E INGLÉS
function cambiarIdioma() {
  // CAMBIAR DE UN IDIOMA AL OTRO
  idiomaActual = idiomaActual === "es" ? "en" : "es";

  // GUARDAR SELECCIÓN DEL USUARIO
  localStorage.setItem("idiomaSoma", idiomaActual);

  // ACTUALIZAR TEXTOS DE LA PÁGINA
  aplicarTraducciones();
}

// CAMBIAR LOS TEXTOS AL IDIOMA SELECCIONADO
function aplicarTraducciones() {
  // OBTENER TODOS LOS ELEMENTOS CON TRADUCCIÓN
  const elementos = document.querySelectorAll("[data-traduccion]");

  elementos.forEach((elemento) => {
    const clave = elemento.getAttribute("data-traduccion");
    // REEMPLAZAR TEXTO SI EXISTE LA TRADUCCIÓN
    if (traducciones[idiomaActual][clave]) {
      elemento.textContent = traducciones[idiomaActual][clave];
    }
  });
}

// ESTABLECER IDIOMA CUANDO CARGA LA PÁGINA
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
