/*
==================================================
OCTOFLOW - FUNCIONES GENERALES
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


/*
==================================================
CONFIGURACIÓN
==================================================
*/

const CLAVE_NOTIFICACIONES =
    "octoflowNotificaciones";

let notificacionDashboardSeleccionada =
    null;


/*
==================================================
INICIAR
==================================================
*/

function iniciarDashboard() {

    if (!validarSesionDashboard()) {
        return;
    }

    if (!validarAccesoPortal()) {
        return;
    }

    cargarDatosUsuario();

    agregarLogoOctoflow();

    configurarBotonesCerrarSesion();

    configurarSistemaNotificaciones();

    generarNotificacionesAutomaticas();

    actualizarCampanaNotificaciones();
}


/*
==================================================
VALIDAR SESIÓN
==================================================
*/

function validarSesionDashboard() {

    const correo =
        sessionStorage.getItem(
            "octoflowCorreo"
        );

    const rol =
        sessionStorage.getItem(
            "octoflowRol"
        );

    const usuarioActivo =
        sessionStorage.getItem(
            "octoflowUsuarioActivo"
        );

    if (
        !correo ||
        !rol ||
        usuarioActivo !== "si"
    ) {

        regresarAlLogin();

        return false;
    }

    return true;
}


/*
==================================================
VALIDAR TIPO DE PORTAL
==================================================
*/

function validarAccesoPortal() {

    const rol =
        sessionStorage.getItem(
            "octoflowRol"
        );

    const tipoPortal =
        document.body.dataset.portal || "";

    if (
        tipoPortal === "gerente" &&
        rol !== "gerente"
    ) {

        window.location.replace(
            "colaboradores.html"
        );

        return false;
    }

    if (
        tipoPortal === "colaborador" &&
        rol !== "colaborador"
    ) {

        window.location.replace(
            "gerentes.html"
        );

        return false;
    }

    return true;
}


/*
==================================================
DATOS DE SESIÓN
==================================================
*/

function obtenerCorreoSesion() {

    return sessionStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


function obtenerRolSesion() {

    return sessionStorage.getItem(
        "octoflowRol"
    ) || "colaborador";
}


function obtenerNombreSesion() {

    return (
        sessionStorage.getItem(
            "octoflowNombreCompleto"
        ) ||
        obtenerNombreDesdeCorreo(
            obtenerCorreoSesion()
        )
    );
}


/*
==================================================
CARGAR DATOS DEL USUARIO
==================================================
*/

function cargarDatosUsuario() {

    const correo =
        obtenerCorreoSesion();

    const rol =
        obtenerRolSesion();

    const nombre =
        sessionStorage.getItem(
            "octoflowNombre"
        ) || "";

    const apellido =
        sessionStorage.getItem(
            "octoflowApellido"
        ) || "";

    const nombreCompletoGuardado =
        sessionStorage.getItem(
            "octoflowNombreCompleto"
        ) || "";

    const nombreCompleto =
        nombreCompletoGuardado.trim() ||
        [nombre, apellido]
            .filter(Boolean)
            .join(" ")
            .trim() ||
        obtenerNombreDesdeCorreo(
            correo
        );

    const primerNombre =
        nombre.trim() ||
        nombreCompleto
            .split(" ")
            .filter(Boolean)[0] ||
        "";

    const iniciales =
        obtenerInicialesDashboard(
            nombreCompleto
        );

    const rolVisible =
        rol === "gerente"
            ? "Gerente"
            : "Colaborador";

    document
        .querySelectorAll(
            "[data-nombre-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    nombreCompleto ||
                    "Usuario";
            }
        );

    document
        .querySelectorAll(
            "[data-correo-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    correo;
            }
        );

    document
        .querySelectorAll(
            "[data-rol-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    rolVisible;
            }
        );

    document
        .querySelectorAll(
            "[data-avatar-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    iniciales ||
                    "U";
            }
        );

    document
        .querySelectorAll(
            "[data-saludo]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    primerNombre
                        ? "¡Hola, " +
                          primerNombre +
                          "!"
                        : "¡Hola!";
            }
        );
}


/*
==================================================
CERRAR SESIÓN
==================================================
*/

function configurarBotonesCerrarSesion() {

    document
        .querySelectorAll(
            ".boton-salir"
        )
        .forEach(
            function (boton) {

                boton.removeAttribute(
                    "onclick"
                );

                boton.addEventListener(
                    "click",
                    cerrarSesion
                );
            }
        );
}


function cerrarSesion() {

    const confirmar =
        window.confirm(
            "¿Deseas cerrar tu sesión de OctoFlow?"
        );

    if (!confirmar) {
        return;
    }

    [
        "octoflowCorreo",
        "octoflowRol",
        "octoflowNombre",
        "octoflowApellido",
        "octoflowNombreCompleto",
        "octoflowUsuarioActivo",
        "octoflowInicioSesion"
    ].forEach(
        function (clave) {

            sessionStorage.removeItem(
                clave
            );
        }
    );

    regresarAlLogin();
}


/*
==================================================
REGRESAR AL LOGIN
==================================================
*/

function regresarAlLogin() {

    window.location.replace(
        "../index.html"
    );
}


/*
==================================================
NOTIFICACIÓN EMERGENTE
==================================================
*/

function mostrarNotificacion(
    texto
) {

    const notificacion =
        document.getElementById(
            "notificacion"
        );

    if (!notificacion) {

        console.log(
            texto
        );

        return;
    }

    notificacion.textContent =
        texto;

    notificacion.classList.add(
        "visible"
    );

    clearTimeout(
        window
            .octoflowTemporizadorNotificacion
    );

    window
        .octoflowTemporizadorNotificacion =
        setTimeout(
            function () {

                notificacion
                    .classList
                    .remove(
                        "visible"
                    );

            },
            3500
        );
}


/*
==================================================
SISTEMA DE NOTIFICACIONES
==================================================
*/

function configurarSistemaNotificaciones() {

    insertarEstilosNotificaciones();

    insertarPanelNotificaciones();

    configurarBotonesCampana();

    configurarEventosPanelNotificaciones();
}


/*
==================================================
ESTILOS DE NOTIFICACIONES
==================================================
*/

function insertarEstilosNotificaciones() {

    if (
        document.getElementById(
            "estilosNotificacionesOctoflow"
        )
    ) {

        return;
    }

    const estilos =
        document.createElement(
            "style"
        );

    estilos.id =
        "estilosNotificacionesOctoflow";

    estilos.textContent = `

        .contenedor-campana-octoflow {
            position: relative;
            display: inline-flex;
        }

        .boton-notificaciones {
            position: relative;
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            padding: 0;
            border: 1px solid #d8e3ef;
            border-radius: 50%;
            background-color: #ffffff;
            color: #003b71;
            font-size: 18px;
            cursor: pointer;
            transition:
                border-color 0.18s ease,
                background-color 0.18s ease,
                transform 0.18s ease;
        }

        .boton-notificaciones:hover {
            transform: translateY(-1px);
            border-color: #84caff;
            background-color: #f5fbff;
        }

        .contador-notificaciones-octoflow {
            position: absolute;
            top: -5px;
            right: -6px;
            display: none;
            place-items: center;
            min-width: 20px;
            height: 20px;
            padding: 0 5px;
            border: 2px solid #ffffff;
            border-radius: 999px;
            background-color: #d92d20;
            color: #ffffff;
            font-size: 9px;
            font-weight: 800;
            line-height: 1;
        }

        .contador-notificaciones-octoflow.visible {
            display: grid;
        }

        .panel-notificaciones-octoflow {
            position: fixed;
            inset: 0;
            z-index: 3000;
            display: none;
            justify-content: flex-end;
            background-color:
                rgba(15, 23, 42, 0.45);
        }

        .panel-notificaciones-octoflow.visible {
            display: flex;
        }

        .contenido-notificaciones-octoflow {
            width: min(430px, 100%);
            height: 100%;
            overflow-y: auto;
            padding: 24px;
            background-color: #ffffff;
            box-shadow:
                -18px 0 42px
                rgba(15, 23, 42, 0.18);
        }

        .cabecera-notificaciones-octoflow {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
        }

        .cabecera-notificaciones-octoflow h2 {
            margin: 7px 0 0;
            color: #003b71;
            font-size: 21px;
        }

        .etiqueta-notificaciones-octoflow {
            color: #005eb8;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .cerrar-notificaciones-octoflow {
            width: 38px;
            height: 38px;
            border: 1px solid #d8e3ef;
            border-radius: 50%;
            background-color: #ffffff;
            color: #344054;
            font-size: 23px;
            cursor: pointer;
        }

        .acciones-notificaciones-octoflow {
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
            margin-top: 22px;
            padding-bottom: 18px;
            border-bottom: 1px solid #e4eaf1;
        }

        .accion-notificaciones-octoflow {
            padding: 8px 11px;
            border: 1px solid #b2ddff;
            border-radius: 8px;
            background-color: #eff8ff;
            color: #005eb8;
            font-size: 10px;
            font-weight: 700;
            cursor: pointer;
        }

        .accion-notificaciones-octoflow.eliminar {
            border-color: #fecdca;
            background-color: #fff1f0;
            color: #b42318;
        }

        .resumen-notificaciones-octoflow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 19px;
        }

        .resumen-notificaciones-octoflow strong {
            color: #003b71;
            font-size: 13px;
        }

        .resumen-notificaciones-octoflow span {
            padding: 5px 9px;
            border-radius: 999px;
            background-color: #f2f4f7;
            color: #475467;
            font-size: 10px;
            font-weight: 700;
        }

        .lista-notificaciones-octoflow {
            display: grid;
            gap: 11px;
            margin-top: 15px;
        }

        .notificacion-octoflow-item {
            position: relative;
            padding: 15px 15px 15px 18px;
            border: 1px solid #d8e3ef;
            border-radius: 13px;
            background-color: #ffffff;
            cursor: pointer;
            transition:
                border-color 0.18s ease,
                background-color 0.18s ease,
                transform 0.18s ease;
        }

        .notificacion-octoflow-item:hover {
            transform: translateY(-1px);
            border-color: #b2ddff;
        }

        .notificacion-octoflow-item.no-leida {
            border-color: #84caff;
            background-color: #f5fbff;
        }

        .notificacion-octoflow-item.no-leida::before {
            position: absolute;
            top: 17px;
            left: 7px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #005eb8;
            content: "";
        }

        .cabecera-notificacion-item {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
        }

        .tipo-notificacion-octoflow {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .icono-notificacion-octoflow {
            display: grid;
            place-items: center;
            flex: 0 0 32px;
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background-color: #e8f3ff;
            font-size: 15px;
        }

        .tipo-notificacion-octoflow strong {
            color: #003b71;
            font-size: 12px;
        }

        .fecha-notificacion-octoflow {
            color: #667085;
            font-size: 9px;
            white-space: nowrap;
        }

        .mensaje-notificacion-octoflow {
            margin: 10px 0 0 40px;
            color: #475467;
            font-size: 11px;
            line-height: 1.55;
        }

        .pie-notificacion-octoflow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin: 12px 0 0 40px;
        }

        .enlace-notificacion-octoflow {
            border: none;
            background: transparent;
            color: #005eb8;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
        }

        .eliminar-notificacion-individual {
            border: none;
            background: transparent;
            color: #b42318;
            font-size: 10px;
            font-weight: 700;
            cursor: pointer;
        }

        .sin-notificaciones-octoflow {
            margin-top: 20px;
            padding: 34px 20px;
            border: 1px dashed #d0d5dd;
            border-radius: 13px;
            color: #667085;
            text-align: center;
            font-size: 12px;
            line-height: 1.6;
        }

        .filtros-notificaciones-octoflow {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }

        .filtro-notificacion-octoflow {
            padding: 7px 10px;
            border: 1px solid #d8e3ef;
            border-radius: 999px;
            background-color: #ffffff;
            color: #475467;
            font-size: 10px;
            font-weight: 700;
            cursor: pointer;
        }

        .filtro-notificacion-octoflow.activo {
            border-color: #005eb8;
            background-color: #e8f3ff;
            color: #005eb8;
        }

    `;

    document.head.appendChild(
        estilos
    );
}


/*
==================================================
CREAR PANEL
==================================================
*/

function insertarPanelNotificaciones() {

    if (
        document.getElementById(
            "panelNotificacionesOctoflow"
        )
    ) {

        return;
    }

    const panel =
        document.createElement(
            "div"
        );

    panel.id =
        "panelNotificacionesOctoflow";

    panel.className =
        "panel-notificaciones-octoflow";

    panel.setAttribute(
        "aria-hidden",
        "true"
    );

    panel.innerHTML = `

        <div class="contenido-notificaciones-octoflow">

            <div class="cabecera-notificaciones-octoflow">

                <div>

                    <span class="etiqueta-notificaciones-octoflow">
                        Centro de actividad
                    </span>

                    <h2>
                        Notificaciones
                    </h2>

                </div>

                <button
                    id="cerrarPanelNotificacionesOctoflow"
                    class="cerrar-notificaciones-octoflow"
                    type="button"
                    aria-label="Cerrar notificaciones"
                >
                    ×
                </button>

            </div>

            <div class="acciones-notificaciones-octoflow">

                <button
                    id="marcarTodasLeidasOctoflow"
                    class="accion-notificaciones-octoflow"
                    type="button"
                >
                    Marcar todas como leídas
                </button>

                <button
                    id="eliminarLeidasOctoflow"
                    class="
                        accion-notificaciones-octoflow
                        eliminar
                    "
                    type="button"
                >
                    Eliminar leídas
                </button>

            </div>

            <div class="filtros-notificaciones-octoflow">

                <button
                    class="
                        filtro-notificacion-octoflow
                        activo
                    "
                    type="button"
                    data-filtro-notificaciones="todas"
                >
                    Todas
                </button>

                <button
                    class="filtro-notificacion-octoflow"
                    type="button"
                    data-filtro-notificaciones="no-leidas"
                >
                    No leídas
                </button>

            </div>

            <div class="resumen-notificaciones-octoflow">

                <strong>
                    Actividad reciente
                </strong>

                <span id="contadorPanelNotificacionesOctoflow">
                    0 notificaciones
                </span>

            </div>

            <div
                id="listaNotificacionesOctoflow"
                class="lista-notificaciones-octoflow"
            ></div>

        </div>
    `;

    document.body.appendChild(
        panel
    );
}


/*
==================================================
CONFIGURAR CAMPANA
==================================================
*/

function configurarBotonesCampana() {

    let botones =
        [
            ...document.querySelectorAll(
                ".boton-notificaciones"
            )
        ];

    if (botones.length === 0) {

        const perfil =
            document.querySelector(
                ".perfil-superior"
            );

        if (perfil) {

            const boton =
                document.createElement(
                    "button"
                );

            boton.className =
                "boton-notificaciones";

            boton.type =
                "button";

            boton.textContent =
                "🔔";

            boton.setAttribute(
                "aria-label",
                "Abrir notificaciones"
            );

            perfil.insertBefore(
                boton,
                perfil.firstChild
            );

            botones = [
                boton
            ];
        }
    }

    botones.forEach(
        function (boton) {

            boton.removeAttribute(
                "onclick"
            );

            let contenedor =
                boton.parentElement;

            if (
                !contenedor.classList.contains(
                    "contenedor-campana-octoflow"
                )
            ) {

                contenedor =
                    document.createElement(
                        "div"
                    );

                contenedor.className =
                    "contenedor-campana-octoflow";

                boton.parentNode.insertBefore(
                    contenedor,
                    boton
                );

                contenedor.appendChild(
                    boton
                );
            }

            if (
                !contenedor.querySelector(
                    ".contador-notificaciones-octoflow"
                )
            ) {

                const contador =
                    document.createElement(
                        "span"
                    );

                contador.className =
                    "contador-notificaciones-octoflow";

                contador.textContent =
                    "0";

                contenedor.appendChild(
                    contador
                );
            }

            boton.addEventListener(
                "click",
                abrirPanelNotificaciones
            );
        }
    );
}


/*
==================================================
EVENTOS DEL PANEL
==================================================
*/

function configurarEventosPanelNotificaciones() {

    const panel =
        document.getElementById(
            "panelNotificacionesOctoflow"
        );

    document
        .getElementById(
            "cerrarPanelNotificacionesOctoflow"
        )
        ?.addEventListener(
            "click",
            cerrarPanelNotificaciones
        );

    document
        .getElementById(
            "marcarTodasLeidasOctoflow"
        )
        ?.addEventListener(
            "click",
            marcarTodasNotificacionesLeidas
        );

    document
        .getElementById(
            "eliminarLeidasOctoflow"
        )
        ?.addEventListener(
            "click",
            eliminarNotificacionesLeidas
        );

    panel?.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === panel
            ) {

                cerrarPanelNotificaciones();
            }
        }
    );

    document
        .querySelectorAll(
            "[data-filtro-notificaciones]"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                "[data-filtro-notificaciones]"
                            )
                            .forEach(
                                function (
                                    otroBoton
                                ) {

                                    otroBoton
                                        .classList
                                        .toggle(
                                            "activo",
                                            otroBoton ===
                                            boton
                                        );
                                }
                            );

                        notificacionDashboardSeleccionada =
                            boton.dataset
                                .filtroNotificaciones;

                        mostrarListaNotificaciones();
                    }
                );
            }
        );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key ===
                "Escape"
            ) {

                cerrarPanelNotificaciones();
            }
        }
    );
}


/*
==================================================
ABRIR Y CERRAR PANEL
==================================================
*/

function abrirPanelNotificaciones() {

    const panel =
        document.getElementById(
            "panelNotificacionesOctoflow"
        );

    panel?.classList.add(
        "visible"
    );

    panel?.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-abierto"
    );

    mostrarListaNotificaciones();
}


function cerrarPanelNotificaciones() {

    const panel =
        document.getElementById(
            "panelNotificacionesOctoflow"
        );

    panel?.classList.remove(
        "visible"
    );

    panel?.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-abierto"
    );
}


/*
==================================================
LEER Y GUARDAR NOTIFICACIONES
==================================================
*/

function leerNotificacionesOctoflow() {

    try {

        const datos =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_NOTIFICACIONES
                ) || "[]"
            );

        return Array.isArray(
            datos
        )
            ? datos
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer las notificaciones.",
            error
        );

        return [];
    }
}


function guardarNotificacionesOctoflow(
    notificaciones
) {

    localStorage.setItem(
        CLAVE_NOTIFICACIONES,
        JSON.stringify(
            notificaciones
        )
    );
}


/*
==================================================
CREAR NOTIFICACIÓN
==================================================
*/

function crearNotificacionOctoFlow(
    datos
) {

    const destinatario =
        String(
            datos.destinatario || ""
        ).trim();

    const rolDestinatario =
        String(
            datos.rolDestinatario || ""
        ).trim();

    if (
        !destinatario &&
        !rolDestinatario
    ) {

        console.warn(
            "La notificación no tiene destinatario."
        );

        return null;
    }

    const notificaciones =
        leerNotificacionesOctoflow();

    const claveUnica =
        datos.claveUnica ||
        [
            datos.tipo,
            destinatario,
            rolDestinatario,
            datos.proyectoId,
            datos.hitoId,
            datos.mensaje
        ]
            .filter(Boolean)
            .join("|");

    const existente =
        notificaciones.find(
            function (notificacion) {

                return (
                    notificacion.claveUnica ===
                    claveUnica
                );
            }
        );

    if (existente) {

        return existente;
    }

    const nuevaNotificacion = {

        id:
            generarIdNotificacion(),

        claveUnica:
            claveUnica,

        tipo:
            datos.tipo ||
            "general",

        titulo:
            datos.titulo ||
            "Nueva notificación",

        mensaje:
            datos.mensaje ||
            "",

        destinatario:
            destinatario,

        rolDestinatario:
            rolDestinatario,

        proyectoId:
            datos.proyectoId ||
            "",

        hitoId:
            datos.hitoId ||
            "",

        enlace:
            datos.enlace ||
            "",

        leida:
            false,

        fecha:
            datos.fecha ||
            new Date().toISOString(),

        creadaPor:
            datos.creadaPor ||
            obtenerCorreoSesion(),

        metadatos:
            datos.metadatos ||
            {}

    };

    notificaciones.unshift(
        nuevaNotificacion
    );

    guardarNotificacionesOctoflow(
        notificaciones
    );

    actualizarCampanaNotificaciones();

    return nuevaNotificacion;
}


/*
==================================================
NOTIFICACIONES DEL USUARIO
==================================================
*/

function obtenerNotificacionesUsuario() {

    const correo =
        normalizarTextoDashboard(
            obtenerCorreoSesion()
        );

    const rol =
        normalizarTextoDashboard(
            obtenerRolSesion()
        );

    return leerNotificacionesOctoflow()
        .filter(
            function (notificacion) {

                const coincideCorreo =
                    notificacion.destinatario &&
                    normalizarTextoDashboard(
                        notificacion.destinatario
                    ) === correo;

                const coincideRol =
                    notificacion.rolDestinatario &&
                    normalizarTextoDashboard(
                        notificacion.rolDestinatario
                    ) === rol;

                return (
                    coincideCorreo ||
                    coincideRol
                );
            }
        )
        .sort(
            function (a, b) {

                return (
                    new Date(b.fecha) -
                    new Date(a.fecha)
                );
            }
        );
}


/*
==================================================
ACTUALIZAR CAMPANA
==================================================
*/

function actualizarCampanaNotificaciones() {

    const noLeidas =
        obtenerNotificacionesUsuario()
            .filter(
                function (notificacion) {

                    return !notificacion.leida;
                }
            )
            .length;

    document
        .querySelectorAll(
            ".contador-notificaciones-octoflow"
        )
        .forEach(
            function (contador) {

                contador.textContent =
                    noLeidas > 99
                        ? "99+"
                        : String(
                            noLeidas
                        );

                contador.classList.toggle(
                    "visible",
                    noLeidas > 0
                );
            }
        );
}


/*
==================================================
MOSTRAR LISTA
==================================================
*/

function mostrarListaNotificaciones() {

    const contenedor =
        document.getElementById(
            "listaNotificacionesOctoflow"
        );

    if (!contenedor) {
        return;
    }

    let notificaciones =
        obtenerNotificacionesUsuario();

    if (
        notificacionDashboardSeleccionada ===
        "no-leidas"
    ) {

        notificaciones =
            notificaciones.filter(
                function (notificacion) {

                    return !notificacion.leida;
                }
            );
    }

    asignarTextoDashboard(
        "contadorPanelNotificacionesOctoflow",
        notificaciones.length === 1
            ? "1 notificación"
            : notificaciones.length +
              " notificaciones"
    );

    if (
        notificaciones.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="sin-notificaciones-octoflow">

                <strong>
                    No hay notificaciones
                </strong>

                <br>

                La actividad relacionada con tus ideas,
                proyectos e hitos aparecerá aquí.

            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        notificaciones
            .map(
                function (notificacion) {

                    const icono =
                        obtenerIconoNotificacion(
                            notificacion.tipo
                        );

                    return `
                        <article
                            class="
                                notificacion-octoflow-item
                                ${
                                    notificacion.leida
                                        ? ""
                                        : "no-leida"
                                }
                            "
                            onclick="
                                abrirNotificacionOctoflow(
                                    '${escaparAtributoDashboard(
                                        notificacion.id
                                    )}'
                                );
                            "
                        >

                            <div class="cabecera-notificacion-item">

                                <div class="tipo-notificacion-octoflow">

                                    <div class="icono-notificacion-octoflow">
                                        ${icono}
                                    </div>

                                    <strong>
                                        ${escaparTextoDashboard(
                                            notificacion.titulo
                                        )}
                                    </strong>

                                </div>

                                <time class="fecha-notificacion-octoflow">
                                    ${formatearFechaNotificacion(
                                        notificacion.fecha
                                    )}
                                </time>

                            </div>

                            <p class="mensaje-notificacion-octoflow">
                                ${escaparTextoDashboard(
                                    notificacion.mensaje
                                )}
                            </p>

                            <div class="pie-notificacion-octoflow">

                                ${
                                    notificacion.enlace
                                        ? `
                                            <button
                                                class="enlace-notificacion-octoflow"
                                                type="button"
                                                onclick="
                                                    event.stopPropagation();
                                                    abrirNotificacionOctoflow(
                                                        '${escaparAtributoDashboard(
                                                            notificacion.id
                                                        )}'
                                                    );
                                                "
                                            >
                                                Ver detalle →
                                            </button>
                                        `
                                        : `
                                            <span></span>
                                        `
                                }

                                <button
                                    class="eliminar-notificacion-individual"
                                    type="button"
                                    onclick="
                                        event.stopPropagation();
                                        eliminarNotificacionOctoflow(
                                            '${escaparAtributoDashboard(
                                                notificacion.id
                                            )}'
                                        );
                                    "
                                >
                                    Eliminar
                                </button>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
ABRIR NOTIFICACIÓN
==================================================
*/

function abrirNotificacionOctoflow(
    notificacionId
) {

    const notificaciones =
        leerNotificacionesOctoflow();

    const notificacion =
        notificaciones.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    notificacionId
                );
            }
        );

    if (!notificacion) {
        return;
    }

    notificacion.leida =
        true;

    notificacion.fechaLectura =
        new Date().toISOString();

    guardarNotificacionesOctoflow(
        notificaciones
    );

    actualizarCampanaNotificaciones();

    if (notificacion.enlace) {

        sessionStorage.setItem(
            "octoflowNotificacionProyectoId",
            notificacion.proyectoId ||
            ""
        );

        sessionStorage.setItem(
            "octoflowNotificacionHitoId",
            notificacion.hitoId ||
            ""
        );

        window.location.href =
            notificacion.enlace;

        return;
    }

    mostrarListaNotificaciones();
}


/*
==================================================
MARCAR COMO LEÍDA
==================================================
*/

function marcarTodasNotificacionesLeidas() {

    const correo =
        normalizarTextoDashboard(
            obtenerCorreoSesion()
        );

    const rol =
        normalizarTextoDashboard(
            obtenerRolSesion()
        );

    const notificaciones =
        leerNotificacionesOctoflow();

    let huboCambios =
        false;

    notificaciones.forEach(
        function (notificacion) {

            const coincideCorreo =
                notificacion.destinatario &&
                normalizarTextoDashboard(
                    notificacion.destinatario
                ) === correo;

            const coincideRol =
                notificacion.rolDestinatario &&
                normalizarTextoDashboard(
                    notificacion.rolDestinatario
                ) === rol;

            if (
                (
                    coincideCorreo ||
                    coincideRol
                ) &&
                !notificacion.leida
            ) {

                notificacion.leida =
                    true;

                notificacion.fechaLectura =
                    new Date().toISOString();

                huboCambios =
                    true;
            }
        }
    );

    if (!huboCambios) {

        mostrarNotificacion(
            "No hay notificaciones pendientes."
        );

        return;
    }

    guardarNotificacionesOctoflow(
        notificaciones
    );

    actualizarCampanaNotificaciones();

    mostrarListaNotificaciones();

    mostrarNotificacion(
        "Notificaciones marcadas como leídas."
    );
}


/*
==================================================
ELIMINAR NOTIFICACIONES
==================================================
*/

function eliminarNotificacionesLeidas() {

    const correo =
        normalizarTextoDashboard(
            obtenerCorreoSesion()
        );

    const rol =
        normalizarTextoDashboard(
            obtenerRolSesion()
        );

    const notificaciones =
        leerNotificacionesOctoflow();

    const nuevasNotificaciones =
        notificaciones.filter(
            function (notificacion) {

                const coincideCorreo =
                    notificacion.destinatario &&
                    normalizarTextoDashboard(
                        notificacion.destinatario
                    ) === correo;

                const coincideRol =
                    notificacion.rolDestinatario &&
                    normalizarTextoDashboard(
                        notificacion.rolDestinatario
                    ) === rol;

                const perteneceUsuario =
                    coincideCorreo ||
                    coincideRol;

                return !(
                    perteneceUsuario &&
                    notificacion.leida
                );
            }
        );

    if (
        nuevasNotificaciones.length ===
        notificaciones.length
    ) {

        mostrarNotificacion(
            "No hay notificaciones leídas para eliminar."
        );

        return;
    }

    guardarNotificacionesOctoflow(
        nuevasNotificaciones
    );

    actualizarCampanaNotificaciones();

    mostrarListaNotificaciones();

    mostrarNotificacion(
        "Notificaciones leídas eliminadas."
    );
}


function eliminarNotificacionOctoflow(
    notificacionId
) {

    const notificaciones =
        leerNotificacionesOctoflow();

    const nuevasNotificaciones =
        notificaciones.filter(
            function (notificacion) {

                return String(
                    notificacion.id
                ) !== String(
                    notificacionId
                );
            }
        );

    guardarNotificacionesOctoflow(
        nuevasNotificaciones
    );

    actualizarCampanaNotificaciones();

    mostrarListaNotificaciones();
}


/*
==================================================
GENERAR NOTIFICACIONES AUTOMÁTICAS
==================================================
*/

function generarNotificacionesAutomaticas() {

    const rol =
        obtenerRolSesion();

    if (rol === "gerente") {

        generarNotificacionesGerente();

    } else {

        generarNotificacionesColaborador();
    }
}


/*
==================================================
NOTIFICACIONES DEL COLABORADOR
==================================================
*/

function generarNotificacionesColaborador() {

    const correo =
        normalizarTextoDashboard(
            obtenerCorreoSesion()
        );

    const proyectos =
        leerColeccionDashboard(
            "octoflowProyectos"
        );

    proyectos.forEach(
        function (proyecto) {

            const participantes =
                Array.isArray(
                    proyecto.participantes
                )
                    ? proyecto.participantes
                    : [];

            const participa =
                participantes.some(
                    function (participante) {

                        return normalizarTextoDashboard(
                            participante.correo
                        ) === correo;
                    }
                );

            if (!participa) {
                return;
            }

            crearNotificacionOctoFlow({

                claveUnica:
                    "proyecto-asignado|" +
                    proyecto.id +
                    "|" +
                    correo,

                tipo:
                    "proyecto",

                titulo:
                    "Proyecto asignado",

                mensaje:
                    'Participas en el proyecto "' +
                    (
                        proyecto.titulo ||
                        proyecto.nombre ||
                        proyecto.id
                    ) +
                    '".',

                destinatario:
                    obtenerCorreoSesion(),

                proyectoId:
                    proyecto.id,

                enlace:
                    "proyectos.html",

                fecha:
                    proyecto.fechaCreacion ||
                    new Date().toISOString()
            });

            if (
                normalizarTextoDashboard(
                    proyecto.estado
                ) === "completado"
            ) {

                crearNotificacionOctoFlow({

                    claveUnica:
                        "proyecto-completado|" +
                        proyecto.id +
                        "|" +
                        correo,

                    tipo:
                        "completado",

                    titulo:
                        "Proyecto completado",

                    mensaje:
                        'El proyecto "' +
                        (
                            proyecto.titulo ||
                            proyecto.nombre ||
                            proyecto.id
                        ) +
                        '" fue completado.',

                    destinatario:
                        obtenerCorreoSesion(),

                    proyectoId:
                        proyecto.id,

                    enlace:
                        "proyectos.html",

                    fecha:
                        proyecto.fechaActualizacion ||
                        new Date().toISOString()
                });
            }

            const hitos =
                Array.isArray(
                    proyecto.hitos
                )
                    ? proyecto.hitos
                    : [];

            hitos.forEach(
                function (hito) {

                    if (
                        normalizarTextoDashboard(
                            hito.responsable
                        ) !== correo
                    ) {

                        return;
                    }

                    crearNotificacionOctoFlow({

                        claveUnica:
                            "hito-asignado|" +
                            proyecto.id +
                            "|" +
                            hito.id +
                            "|" +
                            correo,

                        tipo:
                            "hito",

                        titulo:
                            "Nuevo hito asignado",

                        mensaje:
                            'Se te asignó el hito "' +
                            (
                                hito.titulo ||
                                hito.id
                            ) +
                            '".',

                        destinatario:
                            obtenerCorreoSesion(),

                        proyectoId:
                            proyecto.id,

                        hitoId:
                            hito.id,

                        enlace:
                            "proyectos.html",

                        fecha:
                            hito.fechaCreacion ||
                            new Date().toISOString()
                    });

                    if (
                        normalizarTextoDashboard(
                            hito.estado
                        ) === "completado"
                    ) {

                        crearNotificacionOctoFlow({

                            claveUnica:
                                "hito-completado|" +
                                proyecto.id +
                                "|" +
                                hito.id +
                                "|" +
                                correo,

                            tipo:
                                "aprobacion",

                            titulo:
                                "Hito aprobado",

                            mensaje:
                                'El gerente aprobó el hito "' +
                                (
                                    hito.titulo ||
                                    hito.id
                                ) +
                                '".',

                            destinatario:
                                obtenerCorreoSesion(),

                            proyectoId:
                                proyecto.id,

                            hitoId:
                                hito.id,

                            enlace:
                                "proyectos.html",

                            fecha:
                                hito.verificacion
                                    ?.fecha ||
                                hito.fechaCompletado ||
                                new Date().toISOString()
                        });
                    }

                    if (
                        normalizarTextoDashboard(
                            hito.verificacion
                                ?.resultado
                        ) === "rechazado"
                    ) {

                        crearNotificacionOctoFlow({

                            claveUnica:
                                "hito-rechazado|" +
                                proyecto.id +
                                "|" +
                                hito.id +
                                "|" +
                                String(
                                    hito.verificacion
                                        ?.fecha ||
                                    ""
                                ),

                            tipo:
                                "rechazo",

                            titulo:
                                "Solicitud rechazada",

                            mensaje:
                                'El gerente solicitó cambios en el hito "' +
                                (
                                    hito.titulo ||
                                    hito.id
                                ) +
                                '".',

                            destinatario:
                                obtenerCorreoSesion(),

                            proyectoId:
                                proyecto.id,

                            hitoId:
                                hito.id,

                            enlace:
                                "proyectos.html",

                            fecha:
                                hito.verificacion
                                    ?.fecha ||
                                new Date().toISOString()
                        });
                    }

                    generarAlertaFechaHito(
                        proyecto,
                        hito
                    );
                }
            );
        }
    );
}


/*
==================================================
ALERTAS DE FECHAS
==================================================
*/

function generarAlertaFechaHito(
    proyecto,
    hito
) {

    if (
        !hito.fecha ||
        [
            "completado",
            "pendiente de verificacion"
        ].includes(
            normalizarTextoDashboard(
                hito.estado
            )
        )
    ) {

        return;
    }

    const hoy =
        obtenerFechaDashboardSinHora(
            new Date()
        );

    const fechaHito =
        obtenerFechaDashboardSinHora(
            new Date(
                hito.fecha +
                "T00:00:00"
            )
        );

    const diferencia =
        Math.ceil(
            (
                fechaHito.getTime() -
                hoy.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );

    if (diferencia < 0) {

        crearNotificacionOctoFlow({

            claveUnica:
                "hito-vencido|" +
                proyecto.id +
                "|" +
                hito.id +
                "|" +
                hito.fecha,

            tipo:
                "vencido",

            titulo:
                "Hito vencido",

            mensaje:
                'El hito "' +
                (
                    hito.titulo ||
                    hito.id
                ) +
                '" superó su fecha compromiso.',

            destinatario:
                obtenerCorreoSesion(),

            proyectoId:
                proyecto.id,

            hitoId:
                hito.id,

            enlace:
                "proyectos.html"
        });

    } else if (
        diferencia >= 0 &&
        diferencia <= 3
    ) {

        crearNotificacionOctoFlow({

            claveUnica:
                "hito-proximo|" +
                proyecto.id +
                "|" +
                hito.id +
                "|" +
                hito.fecha,

            tipo:
                "fecha",

            titulo:
                "Hito próximo a vencer",

            mensaje:
                'El hito "' +
                (
                    hito.titulo ||
                    hito.id
                ) +
                '" vence en ' +
                diferencia +
                (
                    diferencia === 1
                        ? " día."
                        : " días."
                ),

            destinatario:
                obtenerCorreoSesion(),

            proyectoId:
                proyecto.id,

            hitoId:
                hito.id,

            enlace:
                "proyectos.html"
        });
    }
}


/*
==================================================
NOTIFICACIONES DEL GERENTE
==================================================
*/

function generarNotificacionesGerente() {

    const proyectos =
        leerColeccionDashboard(
            "octoflowProyectos"
        );

    proyectos.forEach(
        function (proyecto) {

            const hitos =
                Array.isArray(
                    proyecto.hitos
                )
                    ? proyecto.hitos
                    : [];

            hitos.forEach(
                function (hito) {

                    if (
                        normalizarTextoDashboard(
                            hito.estado
                        ) ===
                        "pendiente de verificacion"
                    ) {

                        crearNotificacionOctoFlow({

                            claveUnica:
                                "verificar-hito|" +
                                proyecto.id +
                                "|" +
                                hito.id +
                                "|" +
                                String(
                                    hito
                                        .solicitudCompletado
                                        ?.fecha ||
                                    ""
                                ),

                            tipo:
                                "verificacion",

                            titulo:
                                "Hito por verificar",

                            mensaje:
                                (
                                    hito.nombreResponsable ||
                                    obtenerNombreDesdeCorreo(
                                        hito.responsable
                                    )
                                ) +
                                ' solicitó completar el hito "' +
                                (
                                    hito.titulo ||
                                    hito.id
                                ) +
                                '".',

                            rolDestinatario:
                                "gerente",

                            proyectoId:
                                proyecto.id,

                            hitoId:
                                hito.id,

                            enlace:
                                "proyectos-gerente.html",

                            fecha:
                                hito
                                    .solicitudCompletado
                                    ?.fecha ||
                                new Date().toISOString()
                        });
                    }

                    if (
                        hito.fecha &&
                        normalizarTextoDashboard(
                            hito.estado
                        ) !== "completado"
                    ) {

                        const hoy =
                            obtenerFechaDashboardSinHora(
                                new Date()
                            );

                        const compromiso =
                            obtenerFechaDashboardSinHora(
                                new Date(
                                    hito.fecha +
                                    "T00:00:00"
                                )
                            );

                        if (
                            compromiso.getTime() <
                            hoy.getTime()
                        ) {

                            crearNotificacionOctoFlow({

                                claveUnica:
                                    "gerente-hito-vencido|" +
                                    proyecto.id +
                                    "|" +
                                    hito.id +
                                    "|" +
                                    hito.fecha,

                                tipo:
                                    "vencido",

                                titulo:
                                    "Hito vencido",

                                mensaje:
                                    'El hito "' +
                                    (
                                        hito.titulo ||
                                        hito.id
                                    ) +
                                    '" del proyecto "' +
                                    (
                                        proyecto.titulo ||
                                        proyecto.nombre ||
                                        proyecto.id
                                    ) +
                                    '" está vencido.',

                                rolDestinatario:
                                    "gerente",

                                proyectoId:
                                    proyecto.id,

                                hitoId:
                                    hito.id,

                                enlace:
                                    "proyectos-gerente.html"
                            });
                        }
                    }
                }
            );
        }
    );
}


/*
==================================================
ICONOS
==================================================
*/

function obtenerIconoNotificacion(
    tipo
) {

    const iconos = {

        proyecto:
            "▣",

        hito:
            "◆",

        aprobacion:
            "✓",

        rechazo:
            "×",

        verificacion:
            "◉",

        vencido:
            "!",

        fecha:
            "◷",

        idea:
            "💡",

        oportunidad:
            "🚀",

        comentario:
            "💬",

        completado:
            "★",

        general:
            "🔔"
    };

    return iconos[
        tipo
    ] || "🔔";
}


/*
==================================================
UTILIDADES DE DATOS
==================================================
*/

function leerColeccionDashboard(
    clave
) {

    try {

        const datos =
            JSON.parse(
                localStorage.getItem(
                    clave
                ) || "[]"
            );

        return Array.isArray(
            datos
        )
            ? datos
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer " +
            clave,
            error
        );

        return [];
    }
}


function generarIdNotificacion() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
        "function"
    ) {

        return window.crypto.randomUUID();
    }

    return (
        Date.now().toString() +
        "-" +
        Math.random()
            .toString(16)
            .slice(2)
    );
}


function normalizarTextoDashboard(
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


function obtenerFechaDashboardSinHora(
    fecha
) {

    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );
}


function formatearFechaNotificacion(
    valor
) {

    const fecha =
        new Date(
            valor
        );

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return "Sin fecha";
    }

    const ahora =
        new Date();

    const diferencia =
        ahora.getTime() -
        fecha.getTime();

    const minutos =
        Math.floor(
            diferencia /
            (
                1000 *
                60
            )
        );

    const horas =
        Math.floor(
            minutos /
            60
        );

    const dias =
        Math.floor(
            horas /
            24
        );

    if (
        minutos >= 0 &&
        minutos < 1
    ) {

        return "Ahora";
    }

    if (
        minutos >= 1 &&
        minutos < 60
    ) {

        return (
            "Hace " +
            minutos +
            (
                minutos === 1
                    ? " min"
                    : " min"
            )
        );
    }

    if (
        horas >= 1 &&
        horas < 24
    ) {

        return (
            "Hace " +
            horas +
            (
                horas === 1
                    ? " h"
                    : " h"
            )
        );
    }

    if (
        dias >= 1 &&
        dias <= 7
    ) {

        return (
            "Hace " +
            dias +
            (
                dias === 1
                    ? " día"
                    : " días"
            )
        );
    }

    return fecha.toLocaleDateString(
        "es-MX",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    );
}


function asignarTextoDashboard(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {

        elemento.textContent =
            texto ?? "—";
    }
}


function escaparTextoDashboard(
    texto
) {

    const elemento =
        document.createElement(
            "div"
        );

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function escaparAtributoDashboard(
    texto
) {

    return String(
        texto || ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /\r/g,
            ""
        )
        .replace(
            /\n/g,
            "\\n"
        );
}


/*
==================================================
UTILIDADES DEL USUARIO
==================================================
*/

function obtenerNombreDesdeCorreo(
    correo
) {

    return String(
        correo || "Usuario"
    )
        .split("@")[0]
        .replace(
            /[._-]+/g,
            " "
        )
        .split(" ")
        .filter(Boolean)
        .map(
            function (palabra) {

                return (
                    palabra
                        .charAt(0)
                        .toUpperCase()
                    +
                    palabra
                        .slice(1)
                        .toLowerCase()
                );
            }
        )
        .join(" ");
}


function obtenerInicialesDashboard(
    nombre
) {

    const partes =
        String(
            nombre || "Usuario"
        )
            .split(" ")
            .filter(Boolean);

    if (
        partes.length === 1
    ) {

        return partes[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        partes[0]
            .charAt(0)
        +
        partes[
            partes.length - 1
        ]
            .charAt(0)
    ).toUpperCase();
}
/*
==================================================
AGREGAR LOGO DE OCTOFLOW
==================================================
*/

function agregarLogoOctoflow() {

    document
        .querySelectorAll(
            ".marca"
        )
        .forEach(
            function (marca) {

                if (
                    marca.querySelector(
                        ".marca-octoflow"
                    )
                ) {
                    return;
                }

                const titulo =
                    marca.querySelector(
                        "h1"
                    );

                if (!titulo) {
                    return;
                }

                const contenedor =
                    document.createElement(
                        "div"
                    );

                contenedor.className =
                    "marca-octoflow";

                const logo =
                    document.createElement(
                        "img"
                    );

                logo.className =
                    "logo-octoflow";

                logo.src =
                    "../img/Logo.png";

                logo.alt =
                    "Logo de OctoFlow";

                titulo.parentNode.insertBefore(
                    contenedor,
                    titulo
                );

                contenedor.appendChild(
                    logo
                );

                contenedor.appendChild(
                    titulo
                );
            }
        );
}
