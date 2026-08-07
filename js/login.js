/*
==================================================
OCTOFLOW - LOGIN
==================================================
*/

let usuariosOctoFlow = [];


document.addEventListener(
    "DOMContentLoaded",
    iniciarLogin
);


/*
==================================================
INICIAR LOGIN
==================================================
*/

function iniciarLogin() {

    const formulario =
        document.getElementById(
            "formularioLogin"
        );

    if (!formulario) {

        console.error(
            "No se encontró el formularioLogin."
        );

        return;
    }

    formulario.addEventListener(
        "submit",
        procesarInicioSesion
    );

    configurarRecuperacionContrasena();

    cargarCorreoRecordado();

    cargarUsuariosDesdeExcel();
}


/*
==================================================
CARGAR USUARIOS DESDE EXCEL
==================================================
*/

async function cargarUsuariosDesdeExcel() {

    mostrarEstadoCarga(
        "Cargando base de usuarios...",
        "cargando"
    );

    deshabilitarBotonLogin(
        "Cargando usuarios..."
    );

    try {

        if (typeof XLSX === "undefined") {

            throw new Error(
                "No se pudo cargar la librería de Excel."
            );
        }

        const respuesta =
            await fetch(
                "./data/usuarios_octoflow.xlsx?v=" +
                Date.now()
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se encontró el archivo data/usuarios_octoflow.xlsx."
            );
        }

        const archivo =
            await respuesta.arrayBuffer();

        const libro =
            XLSX.read(
                archivo,
                {
                    type: "array"
                }
            );

        if (
            !Array.isArray(
                libro.SheetNames
            ) ||
            libro.SheetNames.length === 0
        ) {

            throw new Error(
                "El archivo Excel no contiene hojas."
            );
        }

        const nombreHoja =
            libro.SheetNames[0];

        const hoja =
            libro.Sheets[
                nombreHoja
            ];

        const filas =
            XLSX.utils.sheet_to_json(
                hoja,
                {
                    defval: "",
                    raw: false
                }
            );

        usuariosOctoFlow =
            filas
                .map(
                    convertirFilaEnUsuario
                )
                .filter(
                    function (usuario) {

                        return Boolean(
                            usuario.correo
                        );
                    }
                );

        if (
            usuariosOctoFlow.length === 0
        ) {

            throw new Error(
                "El Excel no contiene usuarios válidos."
            );
        }

        console.log(
            "Usuarios cargados:",
            usuariosOctoFlow.map(
                function (usuario) {

                    return {
                        correo:
                            usuario.correo,

                        rol:
                            usuario.rol,

                        activo:
                            usuario.activo,

                        tieneContrasena:
                            Boolean(
                                usuario.contrasena
                            )
                    };
                }
            )
        );

        mostrarEstadoCarga(
            "Base de usuarios disponible.",
            "exito"
        );

        habilitarBotonLogin();

    } catch (error) {

        console.error(
            "Error al cargar usuarios:",
            error
        );

        usuariosOctoFlow = [];

        mostrarEstadoCarga(
            "No fue posible cargar la base de usuarios. " +
            error.message +
            " Abre OctoFlow con Live Server.",
            "error"
        );

        deshabilitarBotonLogin(
            "Base no disponible"
        );
    }
}


/*
==================================================
CONVERTIR FILA DEL EXCEL
==================================================
*/

function convertirFilaEnUsuario(
    fila
) {

    const correo =
        obtenerColumna(
            fila,
            "Correo"
        );

    const nombre =
        obtenerColumna(
            fila,
            "Nombre"
        );

    const apellido =
        obtenerColumna(
            fila,
            "Apellido"
        );

    const rol =
        obtenerColumna(
            fila,
            "Rol"
        );

    const activo =
        obtenerColumna(
            fila,
            "Activo"
        );

    const contrasena =
        obtenerColumna(
            fila,
            "Contrasena"
        ) ||
        obtenerColumna(
            fila,
            "Contraseña"
        );

    const nombreLimpio =
        String(
            nombre || ""
        ).trim();

    const apellidoLimpio =
        String(
            apellido || ""
        ).trim();

    const nombreCompleto =
        [
            nombreLimpio,
            apellidoLimpio
        ]
            .filter(Boolean)
            .join(" ");

    return {

        correo:
            String(
                correo || ""
            )
                .trim()
                .toLowerCase(),

        nombre:
            nombreLimpio,

        apellido:
            apellidoLimpio,

        nombreCompleto:
            nombreCompleto,

        rol:
            normalizarRolLogin(
                rol
            ),

        activo:
            normalizarActivoLogin(
                activo
            ),

        contrasena:
            String(
                contrasena || ""
            ).trim()

    };
}


/*
==================================================
OBTENER COLUMNA DEL EXCEL
==================================================
*/

function obtenerColumna(
    fila,
    nombreBuscado
) {

    const claveEncontrada =
        Object.keys(fila)
            .find(
                function (clave) {

                    return (
                        normalizarTextoLogin(
                            clave
                        ) ===
                        normalizarTextoLogin(
                            nombreBuscado
                        )
                    );
                }
            );

    if (!claveEncontrada) {

        return "";
    }

    return fila[
        claveEncontrada
    ];
}


/*
==================================================
PROCESAR INICIO DE SESIÓN
==================================================
*/

function procesarInicioSesion(
    evento
) {

    evento.preventDefault();

    limpiarMensajeLogin();

    const campoCorreo =
        document.getElementById(
            "correo"
        );

    const campoContrasena =
        document.getElementById(
            "contrasena"
        );

    const correo =
        String(
            campoCorreo?.value || ""
        )
            .trim()
            .toLowerCase();

    const contrasena =
        String(
            campoContrasena?.value || ""
        );

    if (!correo) {

        mostrarMensajeLogin(
            "Ingresa tu correo corporativo.",
            "error"
        );

        campoCorreo?.focus();

        return;
    }

    if (!contrasena) {

        mostrarMensajeLogin(
            "Ingresa tu contraseña.",
            "error"
        );

        campoContrasena?.focus();

        return;
    }

    if (
        usuariosOctoFlow.length === 0
    ) {

        mostrarMensajeLogin(
            "La base de usuarios todavía no está disponible.",
            "error"
        );

        return;
    }

    const usuario =
        usuariosOctoFlow.find(
            function (registro) {

                return (
                    registro.correo ===
                    correo
                );
            }
        );

    if (!usuario) {

        mostrarMensajeLogin(
            "El correo no está registrado.",
            "error"
        );

        return;
    }

    if (!usuario.activo) {

        mostrarMensajeLogin(
            "Este usuario se encuentra inactivo.",
            "error"
        );

        return;
    }

    if (!usuario.contrasena) {

        mostrarMensajeLogin(
            "Este usuario no tiene una contraseña configurada.",
            "error"
        );

        return;
    }

    if (
        usuario.contrasena !==
        contrasena
    ) {

        mostrarMensajeLogin(
            "La contraseña es incorrecta.",
            "error"
        );

        return;
    }

    if (
        usuario.rol !== "gerente" &&
        usuario.rol !== "colaborador"
    ) {

        mostrarMensajeLogin(
            "El rol del usuario no es válido.",
            "error"
        );

        return;
    }

    guardarSesion(
        usuario
    );

    guardarCorreoRecordado(
        usuario.correo
    );

    mostrarMensajeLogin(
        "Acceso correcto.",
        "exito"
    );

    bloquearFormularioLogin();

    console.log(
        "Inicio de sesión correcto:",
        {
            correo:
                usuario.correo,

            rol:
                usuario.rol,

            destino:
                usuario.rol ===
                    "gerente"
                    ? "./pages/gerentes.html"
                    : "./pages/colaboradores.html"
        }
    );

    setTimeout(
        function () {

            redirigirUsuario(
                usuario.rol
            );

        },
        300
    );
}


/*
==================================================
GUARDAR SESIÓN POR PESTAÑA
==================================================
*/

function guardarSesion(
    usuario
) {

    sessionStorage.setItem(
        "octoflowCorreo",
        usuario.correo
    );

    sessionStorage.setItem(
        "octoflowRol",
        usuario.rol
    );

    sessionStorage.setItem(
        "octoflowNombre",
        usuario.nombre
    );

    sessionStorage.setItem(
        "octoflowApellido",
        usuario.apellido
    );

    sessionStorage.setItem(
        "octoflowNombreCompleto",
        usuario.nombreCompleto
    );

    sessionStorage.setItem(
        "octoflowUsuarioActivo",
        "si"
    );

    sessionStorage.setItem(
        "octoflowInicioSesion",
        new Date().toISOString()
    );
}


/*
==================================================
REDIRIGIR SEGÚN EL ROL
==================================================
*/

function redirigirUsuario(
    rol
) {

    if (rol === "gerente") {

        window.location.href =
            "./pages/gerentes.html";

        return;
    }

    if (rol === "colaborador") {

        window.location.href =
            "./pages/colaboradores.html";

        return;
    }

    desbloquearFormularioLogin();

    mostrarMensajeLogin(
        "No fue posible identificar el portal correspondiente.",
        "error"
    );
}


/*
==================================================
NORMALIZAR ROL
==================================================
*/

function normalizarRolLogin(
    rol
) {

    const valor =
        normalizarTextoLogin(
            rol
        );

    if (
        valor === "gerente"
    ) {

        return "gerente";
    }

    if (
        valor === "colaborador"
    ) {

        return "colaborador";
    }

    /*
    Compatibilidad temporal con archivos antiguos.
    */

    if (
        valor === "empleado"
    ) {

        return "colaborador";
    }

    return valor;
}


/*
==================================================
NORMALIZAR ACTIVO
==================================================
*/

function normalizarActivoLogin(
    valor
) {

    const texto =
        normalizarTextoLogin(
            valor
        );

    return [
        "si",
        "true",
        "1",
        "activo",
        "yes"
    ].includes(
        texto
    );
}


/*
==================================================
RECORDAR CORREO
==================================================
*/

function cargarCorreoRecordado() {

    const correoRecordado =
        localStorage.getItem(
            "octoflowCorreoRecordado"
        ) || "";

    const campoCorreo =
        document.getElementById(
            "correo"
        );

    const casillaRecordar =
        document.getElementById(
            "recordarme"
        );

    if (
        correoRecordado &&
        campoCorreo
    ) {

        campoCorreo.value =
            correoRecordado;
    }

    if (
        correoRecordado &&
        casillaRecordar
    ) {

        casillaRecordar.checked =
            true;
    }
}


function guardarCorreoRecordado(
    correo
) {

    const recordar =
        document.getElementById(
            "recordarme"
        )?.checked;

    if (recordar) {

        localStorage.setItem(
            "octoflowCorreoRecordado",
            correo
        );

        return;
    }

    localStorage.removeItem(
        "octoflowCorreoRecordado"
    );
}


/*
==================================================
RECUPERACIÓN DE CONTRASEÑA
==================================================
*/

function configurarRecuperacionContrasena() {

    document
        .getElementById(
            "botonOlvideContrasena"
        )
        ?.addEventListener(
            "click",
            function () {

                window.alert(
                    "La recuperación de contraseña se conectará posteriormente con el sistema corporativo de Danone."
                );
            }
        );
}


/*
==================================================
ESTADO DE CARGA
==================================================
*/

function mostrarEstadoCarga(
    texto,
    tipo
) {

    const estado =
        document.getElementById(
            "estadoCarga"
        );

    if (!estado) {

        console.warn(
            "No existe el elemento estadoCarga."
        );

        return;
    }

    estado.className =
        "estado-carga " + tipo;

    estado.textContent =
        texto;
}


/*
==================================================
MENSAJES DEL LOGIN
==================================================
*/

function mostrarMensajeLogin(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensaje"
        );

    if (!mensaje) {

        console.warn(
            "No existe el elemento mensaje."
        );

        return;
    }

    mensaje.className =
        "mensaje " + tipo;

    mensaje.textContent =
        texto;
}


function limpiarMensajeLogin() {

    const mensaje =
        document.getElementById(
            "mensaje"
        );

    if (!mensaje) {

        return;
    }

    mensaje.className =
        "mensaje";

    mensaje.textContent =
        "";
}


/*
==================================================
BOTÓN Y FORMULARIO
==================================================
*/

function habilitarBotonLogin() {

    const boton =
        document.getElementById(
            "botonLogin"
        );

    if (!boton) {

        console.error(
            "No existe el botón botonLogin."
        );

        return;
    }

    boton.disabled =
        false;

    boton.textContent =
        "Iniciar sesión";
}


function deshabilitarBotonLogin(
    texto
) {

    const boton =
        document.getElementById(
            "botonLogin"
        );

    if (!boton) {

        return;
    }

    boton.disabled =
        true;

    boton.textContent =
        texto ||
        "Base no disponible";
}


function bloquearFormularioLogin() {

    const boton =
        document.getElementById(
            "botonLogin"
        );

    const correo =
        document.getElementById(
            "correo"
        );

    const contrasena =
        document.getElementById(
            "contrasena"
        );

    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "Ingresando...";
    }

    if (correo) {

        correo.disabled =
            true;
    }

    if (contrasena) {

        contrasena.disabled =
            true;
    }
}


function desbloquearFormularioLogin() {

    const boton =
        document.getElementById(
            "botonLogin"
        );

    const correo =
        document.getElementById(
            "correo"
        );

    const contrasena =
        document.getElementById(
            "contrasena"
        );

    if (boton) {

        boton.disabled =
            false;

        boton.textContent =
            "Iniciar sesión";
    }

    if (correo) {

        correo.disabled =
            false;
    }

    if (contrasena) {

        contrasena.disabled =
            false;
    }
}


/*
==================================================
UTILIDADES
==================================================
*/

function normalizarTextoLogin(
    texto
) {

    return String(
        texto || ""
    )
        .trim()
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}