/*
==================================================
OCTOFLOW - OPORTUNIDADES Y POSTULACIONES
==================================================
*/

let oportunidadSeleccionada = null;
let postulacionSeleccionada = null;
let recomendacionesCalculadas = [];


document.addEventListener(
    "DOMContentLoaded",
    iniciarOportunidades
);


function iniciarOportunidades() {

    crearOportunidadesDemostracion();

    configurarPestanas();

    configurarFiltrosOportunidades();

    configurarFiltrosPostulaciones();

    configurarPanelOportunidad();

    configurarPanelPostulacion();

    actualizarPortalOportunidades();
}


/*
==================================================
ACTUALIZAR PORTAL
==================================================
*/

function actualizarPortalOportunidades() {

    const habilidades =
        obtenerHabilidadesOportunidades();

    const perfil =
        obtenerPerfilOportunidades();

    const oportunidades =
        obtenerOportunidades();

    mostrarAvisoPerfil(
        habilidades,
        perfil
    );

    recomendacionesCalculadas =
        oportunidades.map(
            function (oportunidad) {

                return calcularCompatibilidad(
                    oportunidad,
                    habilidades,
                    perfil
                );
            }
        );

    cargarAreasOportunidades();

    actualizarResumenOportunidades();

    mostrarOportunidades();

    actualizarResumenPostulaciones();

    mostrarPostulaciones();

    actualizarContadorPestana();
}


/*
==================================================
PESTAÑAS
==================================================
*/

function configurarPestanas() {

    const botonExplorar =
        document.getElementById(
            "pestanaExplorar"
        );

    const botonPostulaciones =
        document.getElementById(
            "pestanaPostulaciones"
        );

    botonExplorar?.addEventListener(
        "click",
        function () {

            cambiarPestanaOportunidades(
                "explorar"
            );
        }
    );

    botonPostulaciones?.addEventListener(
        "click",
        function () {

            cambiarPestanaOportunidades(
                "postulaciones"
            );
        }
    );
}


function cambiarPestanaOportunidades(
    pestana
) {

    const explorar =
        document.getElementById(
            "seccionExplorar"
        );

    const postulaciones =
        document.getElementById(
            "seccionPostulaciones"
        );

    const botonExplorar =
        document.getElementById(
            "pestanaExplorar"
        );

    const botonPostulaciones =
        document.getElementById(
            "pestanaPostulaciones"
        );

    const mostrarExplorar =
        pestana === "explorar";

    explorar?.classList.toggle(
        "oculto",
        !mostrarExplorar
    );

    postulaciones?.classList.toggle(
        "oculto",
        mostrarExplorar
    );

    botonExplorar?.classList.toggle(
        "activa",
        mostrarExplorar
    );

    botonPostulaciones?.classList.toggle(
        "activa",
        !mostrarExplorar
    );

    if (!mostrarExplorar) {

        mostrarPostulaciones();
    }
}


/*
==================================================
DATOS
==================================================
*/

function obtenerCorreoOportunidades() {

    return localStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


function obtenerOportunidades() {

    const datos =
        localStorage.getItem(
            "octoflowOportunidades"
        );

    if (!datos) {

        return [];
    }

    try {

        const oportunidades =
            JSON.parse(datos);

        return Array.isArray(oportunidades)
            ? oportunidades.filter(
                function (oportunidad) {

                    return normalizarOportunidad(
                        oportunidad.estado
                    ) === "publicada";
                }
            )
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer las oportunidades.",
            error
        );

        return [];
    }
}


function obtenerHabilidadesOportunidades() {

    const correo =
        obtenerCorreoOportunidades();

    const datos =
        localStorage.getItem(
            "octoflowHabilidades"
        );

    if (!datos || !correo) {

        return [];
    }

    try {

        const habilidades =
            JSON.parse(datos);

        return Array.isArray(habilidades)
            ? habilidades.filter(
                function (habilidad) {

                    return normalizarOportunidad(
                        habilidad.correo
                    ) === normalizarOportunidad(
                        correo
                    );
                }
            )
            : [];

    } catch (error) {

        return [];
    }
}


function obtenerPerfilOportunidades() {

    const correo =
        obtenerCorreoOportunidades();

    const datos =
        localStorage.getItem(
            "octoflowPerfilesHabilidades"
        );

    if (!datos || !correo) {

        return null;
    }

    try {

        const perfiles =
            JSON.parse(datos);

        return Array.isArray(perfiles)
            ? perfiles.find(
                function (perfil) {

                    return normalizarOportunidad(
                        perfil.correo
                    ) === normalizarOportunidad(
                        correo
                    );
                }
            ) || null
            : null;

    } catch (error) {

        return null;
    }
}


function obtenerPostulaciones() {

    const datos =
        localStorage.getItem(
            "octoflowPostulaciones"
        );

    if (!datos) {

        return [];
    }

    try {

        const postulaciones =
            JSON.parse(datos);

        return Array.isArray(postulaciones)
            ? postulaciones
            : [];

    } catch (error) {

        return [];
    }
}


function obtenerPostulacionesUsuario() {

    const correo =
        normalizarOportunidad(
            obtenerCorreoOportunidades()
        );

    return obtenerPostulaciones()
        .filter(
            function (postulacion) {

                return normalizarOportunidad(
                    postulacion.correo
                ) === correo;
            }
        );
}


/*
==================================================
PROYECTOS DE DEMOSTRACIÓN
==================================================
*/

function crearOportunidadesDemostracion() {

    const datos =
        localStorage.getItem(
            "octoflowOportunidades"
        );

    if (datos) {

        return;
    }

    const ahora =
        Date.now();

    const oportunidades = [

        {
            id: "OP-1001",

            titulo:
                "Automatización de conciliación mensual",

            area:
                "Finanzas",

            descripcion:
                "Automatizar la consolidación de movimientos, identificar diferencias y generar un reporte mensual.",

            herramientas: [
                "Excel",
                "Power Automate"
            ],

            duracion:
                "2 meses",

            disponibilidad:
                4,

            dificultad:
                "Intermedia",

            estado:
                "Publicada",

            championAsignado:
                true,

            learnerAsignado:
                false,

            fechaPublicacion:
                new Date(
                    ahora
                ).toISOString(),

            responsabilidadesChampion:
                "Diseñar el flujo, revisar la lógica y orientar al equipo.",

            responsabilidadesLearner:
                "Construir validaciones, ejecutar pruebas y documentar el proceso.",

            responsabilidadesContributor:
                "Apoyar con datos, validaciones y pruebas."
        },

        {
            id: "OP-1002",

            titulo:
                "Dashboard de seguimiento de inventarios",

            area:
                "Operaciones",

            descripcion:
                "Crear un dashboard con indicadores de inventario, rotación y alertas de niveles mínimos.",

            herramientas: [
                "Power BI",
                "Excel"
            ],

            duracion:
                "3 meses",

            disponibilidad:
                4,

            dificultad:
                "Intermedia",

            estado:
                "Publicada",

            championAsignado:
                false,

            learnerAsignado:
                false,

            fechaPublicacion:
                new Date(
                    ahora - 86400000
                ).toISOString(),

            responsabilidadesChampion:
                "Definir el modelo de datos y revisar los indicadores.",

            responsabilidadesLearner:
                "Preparar datos y construir visualizaciones.",

            responsabilidadesContributor:
                "Validar fuentes y resultados."
        },

        {
            id: "OP-1003",

            titulo:
                "Portal de solicitudes internas",

            area:
                "Recursos Humanos",

            descripcion:
                "Desarrollar un portal para registrar y dar seguimiento a solicitudes internas.",

            herramientas: [
                "HTML",
                "JavaScript",
                "SharePoint"
            ],

            duracion:
                "3 meses",

            disponibilidad:
                6,

            dificultad:
                "Avanzada",

            estado:
                "Publicada",

            championAsignado:
                true,

            learnerAsignado:
                true,

            fechaPublicacion:
                new Date(
                    ahora - 172800000
                ).toISOString(),

            responsabilidadesChampion:
                "Definir la arquitectura y revisar el código.",

            responsabilidadesLearner:
                "Desarrollar secciones y ejecutar pruebas.",

            responsabilidadesContributor:
                "Documentar procesos y apoyar en el diseño."
        },

        {
            id: "OP-1004",

            titulo:
                "Validación automática de proveedores",

            area:
                "Compras",

            descripcion:
                "Validar automáticamente campos, documentación y datos de proveedores antes de su alta.",

            herramientas: [
                "Excel",
                "Power Automate",
                "SharePoint"
            ],

            duracion:
                "2 meses",

            disponibilidad:
                2,

            dificultad:
                "Básica",

            estado:
                "Publicada",

            championAsignado:
                true,

            learnerAsignado:
                false,

            fechaPublicacion:
                new Date(
                    ahora - 259200000
                ).toISOString(),

            responsabilidadesChampion:
                "Crear el flujo principal y revisar las reglas.",

            responsabilidadesLearner:
                "Configurar validaciones y documentar pruebas.",

            responsabilidadesContributor:
                "Apoyar con reglas de negocio."
        }
    ];

    localStorage.setItem(
        "octoflowOportunidades",
        JSON.stringify(oportunidades)
    );
}


/*
==================================================
COMPATIBILIDAD
==================================================
*/

function calcularCompatibilidad(
    oportunidad,
    habilidades,
    perfil
) {

    const herramientasProyecto =
        Array.isArray(
            oportunidad.herramientas
        )
            ? oportunidad.herramientas
            : [];

    const dominadas = [];
    const aprendizaje = [];
    const razones = [];

    herramientasProyecto.forEach(
        function (herramientaProyecto) {

            const habilidad =
                habilidades.find(
                    function (registro) {

                        return normalizarOportunidad(
                            registro.herramienta
                        ) === normalizarOportunidad(
                            herramientaProyecto
                        );
                    }
                );

            if (!habilidad) {

                return;
            }

            const nivel =
                normalizarOportunidad(
                    habilidad.nivel
                );

            const objetivo =
                normalizarOportunidad(
                    habilidad.objetivo
                );

            if (
                nivel === "avanzado" ||
                nivel === "experto"
            ) {

                dominadas.push(
                    herramientaProyecto
                );
            }

            if (
                objetivo.includes("aprender") ||
                objetivo.includes("mejorar")
            ) {

                aprendizaje.push(
                    herramientaProyecto
                );
            }
        }
    );

    const totalHerramientas =
        Math.max(
            herramientasProyecto.length,
            1
        );

    const puntosExperiencia =
        (
            dominadas.length /
            totalHerramientas
        ) * 50;

    const puntosAprendizaje =
        (
            aprendizaje.length /
            totalHerramientas
        ) * 25;

    let puntosArea = 0;

    const areaPrincipal =
        normalizarOportunidad(
            perfil?.areaPrincipal
        );

    const areasInteres =
        normalizarOportunidad(
            perfil?.areasInteres
        );

    const areaProyecto =
        normalizarOportunidad(
            oportunidad.area
        );

    if (
        areaPrincipal === areaProyecto
    ) {

        puntosArea = 15;

        razones.push(
            "El proyecto coincide con tu área principal."
        );

    } else if (
        areasInteres.includes(
            areaProyecto
        )
    ) {

        puntosArea = 12;

        razones.push(
            "El área coincide con tus intereses."
        );
    }

    let puntosDisponibilidad = 0;

    const disponibilidadUsuario =
        Number(
            perfil?.disponibilidad || 0
        );

    const disponibilidadProyecto =
        Number(
            oportunidad.disponibilidad || 0
        );

    if (
        disponibilidadUsuario >=
        disponibilidadProyecto
    ) {

        puntosDisponibilidad = 10;

        razones.push(
            "Tu disponibilidad cubre el requerimiento."
        );

    } else if (
        disponibilidadUsuario > 0
    ) {

        puntosDisponibilidad = 5;

        razones.push(
            "Tu disponibilidad cubre parcialmente el requerimiento."
        );
    }

    dominadas.forEach(
        function (herramienta) {

            razones.push(
                "Tienes experiencia avanzada en " +
                herramienta +
                "."
            );
        }
    );

    aprendizaje.forEach(
        function (herramienta) {

            razones.push(
                "Quieres aprender o mejorar " +
                herramienta +
                "."
            );
        }
    );

    const compatibilidad =
        Math.min(
            100,
            Math.round(
                puntosExperiencia +
                puntosAprendizaje +
                puntosArea +
                puntosDisponibilidad
            )
        );

    let rol = "Contributor";

    if (
        dominadas.length > 0 &&
        perfil?.disponibleChampion !== false
    ) {

        rol = "Champion";

    } else if (
        aprendizaje.length > 0 &&
        perfil?.disponibleLearner !== false
    ) {

        rol = "Learner";
    }

    if (razones.length === 0) {

        razones.push(
            "Actualiza tus habilidades para mejorar la recomendación."
        );
    }

    return {

        oportunidad: oportunidad,

        compatibilidad: compatibilidad,

        rol: rol,

        razones: razones
    };
}


/*
==================================================
MOSTRAR OPORTUNIDADES
==================================================
*/

function mostrarOportunidades() {

    const contenedor =
        document.getElementById(
            "listaOportunidades"
        );

    if (!contenedor) {

        return;
    }

    const busqueda =
        normalizarOportunidad(
            document
                .getElementById(
                    "buscarOportunidad"
                )
                ?.value
        );

    const filtroRol =
        document
            .getElementById(
                "filtroRolOportunidad"
            )
            ?.value || "";

    const filtroArea =
        normalizarOportunidad(
            document
                .getElementById(
                    "filtroAreaOportunidad"
                )
                ?.value
        );

    const orden =
        document
            .getElementById(
                "ordenOportunidades"
            )
            ?.value || "compatibilidad";

    let resultados =
        recomendacionesCalculadas.filter(
            function (resultado) {

                const oportunidad =
                    resultado.oportunidad;

                const texto =
                    normalizarOportunidad(
                        [
                            oportunidad.titulo,
                            oportunidad.area,
                            ...(oportunidad.herramientas || [])
                        ].join(" ")
                    );

                return (
                    (
                        busqueda === "" ||
                        texto.includes(busqueda)
                    )
                    &&
                    (
                        filtroRol === "" ||
                        resultado.rol === filtroRol
                    )
                    &&
                    (
                        filtroArea === "" ||
                        normalizarOportunidad(
                            oportunidad.area
                        ) === filtroArea
                    )
                );
            }
        );

    resultados.sort(
        function (a, b) {

            if (orden === "nombre") {

                return String(
                    a.oportunidad.titulo
                ).localeCompare(
                    String(
                        b.oportunidad.titulo
                    ),
                    "es"
                );
            }

            if (orden === "recientes") {

                return (
                    new Date(
                        b.oportunidad.fechaPublicacion
                    ) -
                    new Date(
                        a.oportunidad.fechaPublicacion
                    )
                );
            }

            return (
                b.compatibilidad -
                a.compatibilidad
            );
        }
    );

    actualizarContadorOportunidades(
        resultados.length
    );

    if (resultados.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No se encontraron oportunidades.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        resultados
            .map(
                crearTarjetaOportunidad
            )
            .join("");
}


function crearTarjetaOportunidad(
    resultado
) {

    const oportunidad =
        resultado.oportunidad;

    const postulacion =
        obtenerPostulacionUsuario(
            oportunidad.id
        );

    const herramientas =
        (oportunidad.herramientas || [])
            .map(
                function (herramienta) {

                    return `
                        <span class="etiqueta-herramienta">
                            ${escaparOportunidad(
                                herramienta
                            )}
                        </span>
                    `;
                }
            )
            .join("");

    return `
        <article class="tarjeta-oportunidad">

            <div class="tarjeta-oportunidad-superior">

                <div>

                    <span class="codigo-oportunidad">
                        ${escaparOportunidad(
                            oportunidad.id
                        )}
                    </span>

                    <h3>
                        ${escaparOportunidad(
                            oportunidad.titulo
                        )}
                    </h3>

                </div>

                <div
                    class="
                        compatibilidad-circulo
                        ${obtenerClaseCompatibilidad(
                            resultado.compatibilidad
                        )}
                    "
                >
                    ${resultado.compatibilidad}%
                </div>

            </div>

            <div class="meta-oportunidad">

                <span>
                    ${escaparOportunidad(
                        oportunidad.area
                    )}
                </span>

                <span>
                    ${escaparOportunidad(
                        oportunidad.duracion
                    )}
                </span>

                <span>
                    ${oportunidad.disponibilidad} h/sem.
                </span>

            </div>

            <p class="descripcion-oportunidad">
                ${escaparOportunidad(
                    oportunidad.descripcion
                )}
            </p>

            <div class="etiquetas-herramientas">
                ${herramientas}
            </div>

            <div class="rol-recomendado">

                <span>
                    Rol recomendado
                </span>

                <strong class="rol-${resultado.rol.toLowerCase()}">
                    ${resultado.rol}
                </strong>

            </div>

            <div class="equipo-oportunidad">

                <span
                    class="${
                        oportunidad.championAsignado
                            ? "cubierto"
                            : "vacante"
                    }"
                >
                    ${
                        oportunidad.championAsignado
                            ? "Champion asignado"
                            : "Champion vacante"
                    }
                </span>

                <span
                    class="${
                        oportunidad.learnerAsignado
                            ? "cubierto"
                            : "vacante"
                    }"
                >
                    ${
                        oportunidad.learnerAsignado
                            ? "Learner asignado"
                            : "Learner vacante"
                    }
                </span>

            </div>

            <div class="tarjeta-oportunidad-acciones">

                <button
                    class="boton-principal"
                    type="button"
                    onclick="abrirOportunidad(
                        '${escaparAtributoOportunidad(
                            oportunidad.id
                        )}'
                    )"
                >
                    ${
                        postulacion
                            ? "Ver postulación"
                            : "Ver oportunidad"
                    }
                </button>

            </div>

        </article>
    `;
}


/*
==================================================
POSTULARSE
==================================================
*/

function postularseOportunidad() {

    if (!oportunidadSeleccionada) {

        return;
    }

    const correo =
        obtenerCorreoOportunidades();

    const postulaciones =
        obtenerPostulaciones();

    const existente =
        postulaciones.find(
            function (postulacion) {

                return (
                    postulacion.oportunidadId ===
                        oportunidadSeleccionada
                            .oportunidad
                            .id
                    &&
                    normalizarOportunidad(
                        postulacion.correo
                    ) === normalizarOportunidad(
                        correo
                    )
                );
            }
        );

    if (existente) {

        cerrarModalOportunidad();

        abrirDetallePostulacion(
            existente.id
        );

        return;
    }

    const nuevaPostulacion = {

        id:
            "AP-" + Date.now(),

        oportunidadId:
            oportunidadSeleccionada
                .oportunidad
                .id,

        proyecto:
            oportunidadSeleccionada
                .oportunidad
                .titulo,

        correo:
            correo,

        rolSolicitado:
            oportunidadSeleccionada.rol,

        compatibilidad:
            oportunidadSeleccionada
                .compatibilidad,

        estado:
            "Pendiente",

        comentarioGerente:
            "",

        fecha:
            new Date().toISOString()
    };

    postulaciones.push(
        nuevaPostulacion
    );

    localStorage.setItem(
        "octoflowPostulaciones",
        JSON.stringify(postulaciones)
    );

    cerrarModalOportunidad();

    mostrarNotificacion(
        "Postulación enviada como " +
        nuevaPostulacion.rolSolicitado +
        "."
    );

    actualizarPortalOportunidades();

    cambiarPestanaOportunidades(
        "postulaciones"
    );
}


/*
==================================================
MIS POSTULACIONES
==================================================
*/

function mostrarPostulaciones() {

    const tabla =
        document.getElementById(
            "tablaPostulaciones"
        );

    if (!tabla) {

        return;
    }

    const busqueda =
        normalizarOportunidad(
            document
                .getElementById(
                    "buscarPostulacion"
                )
                ?.value
        );

    const filtroEstado =
        normalizarOportunidad(
            document
                .getElementById(
                    "filtroEstadoPostulacion"
                )
                ?.value
        );

    const postulaciones =
        obtenerPostulacionesUsuario()
            .filter(
                function (postulacion) {

                    const texto =
                        normalizarOportunidad(
                            [
                                postulacion.proyecto,
                                postulacion.rolSolicitado
                            ].join(" ")
                        );

                    return (
                        (
                            busqueda === "" ||
                            texto.includes(busqueda)
                        )
                        &&
                        (
                            filtroEstado === "" ||
                            normalizarOportunidad(
                                postulacion.estado
                            ) === filtroEstado
                        )
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

    actualizarTextoOportunidad(
        "contadorPostulaciones",
        postulaciones.length === 1
            ? "1 postulación"
            : postulaciones.length +
              " postulaciones"
    );

    if (postulaciones.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="tabla-vacia"
                >
                    No se encontraron postulaciones.
                </td>
            </tr>
        `;

        return;
    }

    tabla.innerHTML =
        postulaciones
            .map(
                function (postulacion) {

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escaparOportunidad(
                                        postulacion.proyecto
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escaparOportunidad(
                                    postulacion.rolSolicitado
                                )}
                            </td>

                            <td>
                                ${Number(
                                    postulacion.compatibilidad || 0
                                )}%
                            </td>

                            <td>
                                ${formatearFechaPostulacion(
                                    postulacion.fecha
                                )}
                            </td>

                            <td>

                                <span
                                    class="
                                        estado-postulacion
                                        ${obtenerClaseEstadoPostulacion(
                                            postulacion.estado
                                        )}
                                    "
                                >
                                    ${escaparOportunidad(
                                        postulacion.estado
                                    )}
                                </span>

                            </td>

                            <td>

                                <button
                                    class="boton-tabla"
                                    type="button"
                                    onclick="abrirDetallePostulacion(
                                        '${escaparAtributoOportunidad(
                                            postulacion.id
                                        )}'
                                    )"
                                >
                                    Ver detalle
                                </button>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


function actualizarResumenPostulaciones() {

    const postulaciones =
        obtenerPostulacionesUsuario();

    const pendientes =
        postulaciones.filter(
            function (postulacion) {

                const estado =
                    normalizarOportunidad(
                        postulacion.estado
                    );

                return (
                    estado === "pendiente" ||
                    estado === "en revision" ||
                    estado === "preseleccionado"
                );
            }
        ).length;

    const aceptadas =
        postulaciones.filter(
            function (postulacion) {

                return normalizarOportunidad(
                    postulacion.estado
                ) === "aceptado";
            }
        ).length;

    const rechazadas =
        postulaciones.filter(
            function (postulacion) {

                const estado =
                    normalizarOportunidad(
                        postulacion.estado
                    );

                return (
                    estado === "no seleccionado" ||
                    estado === "cancelado"
                );
            }
        ).length;

    actualizarTextoOportunidad(
        "postulacionesTotal",
        postulaciones.length
    );

    actualizarTextoOportunidad(
        "postulacionesPendientes",
        pendientes
    );

    actualizarTextoOportunidad(
        "postulacionesAceptadas",
        aceptadas
    );

    actualizarTextoOportunidad(
        "postulacionesRechazadas",
        rechazadas
    );
}


function actualizarContadorPestana() {

    actualizarTextoOportunidad(
        "contadorPestanaPostulaciones",
        obtenerPostulacionesUsuario().length
    );
}


/*
==================================================
DETALLE DE OPORTUNIDAD
==================================================
*/

function configurarPanelOportunidad() {

    document
        .getElementById(
            "cerrarModalOportunidad"
        )
        ?.addEventListener(
            "click",
            cerrarModalOportunidad
        );

    document
        .getElementById(
            "cancelarModalOportunidad"
        )
        ?.addEventListener(
            "click",
            cerrarModalOportunidad
        );

    document
        .getElementById(
            "botonPostularse"
        )
        ?.addEventListener(
            "click",
            postularseOportunidad
        );

    document
        .getElementById(
            "modalOportunidad"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "modalOportunidad"
                ) {

                    cerrarModalOportunidad();
                }
            }
        );
}


function abrirOportunidad(id) {

    oportunidadSeleccionada =
        recomendacionesCalculadas.find(
            function (resultado) {

                return resultado
                    .oportunidad
                    .id === id;
            }
        );

    if (!oportunidadSeleccionada) {

        return;
    }

    const oportunidad =
        oportunidadSeleccionada.oportunidad;

    asignarTextoOportunidad(
        "detalleTituloOportunidad",
        oportunidad.titulo
    );

    asignarTextoOportunidad(
        "detalleCompatibilidad",
        oportunidadSeleccionada.compatibilidad +
        "%"
    );

    asignarTextoOportunidad(
        "detalleRolRecomendado",
        oportunidadSeleccionada.rol
    );

    asignarTextoOportunidad(
        "detalleAreaOportunidad",
        oportunidad.area
    );

    asignarTextoOportunidad(
        "detalleDuracionOportunidad",
        oportunidad.duracion
    );

    asignarTextoOportunidad(
        "detalleDisponibilidadOportunidad",
        oportunidad.disponibilidad +
        " horas por semana"
    );

    asignarTextoOportunidad(
        "detalleDificultadOportunidad",
        oportunidad.dificultad
    );

    asignarTextoOportunidad(
        "detalleDescripcionOportunidad",
        oportunidad.descripcion
    );

    asignarTextoOportunidad(
        "detalleEstadoEquipo",
        (
            oportunidad.championAsignado
                ? "Champion asignado"
                : "Champion vacante"
        ) +
        " · " +
        (
            oportunidad.learnerAsignado
                ? "Learner asignado"
                : "Learner vacante"
        )
    );

    const herramientas =
        document.getElementById(
            "detalleHerramientasOportunidad"
        );

    if (herramientas) {

        herramientas.innerHTML =
            (oportunidad.herramientas || [])
                .map(
                    function (herramienta) {

                        return `
                            <span class="etiqueta-herramienta">
                                ${escaparOportunidad(
                                    herramienta
                                )}
                            </span>
                        `;
                    }
                )
                .join("");
    }

    const razones =
        document.getElementById(
            "detalleRazonesOportunidad"
        );

    if (razones) {

        razones.innerHTML =
            oportunidadSeleccionada
                .razones
                .map(
                    function (razon) {

                        return `
                            <li>
                                ${escaparOportunidad(
                                    razon
                                )}
                            </li>
                        `;
                    }
                )
                .join("");
    }

    let responsabilidades =
        oportunidad
            .responsabilidadesContributor;

    if (
        oportunidadSeleccionada.rol ===
        "Champion"
    ) {

        responsabilidades =
            oportunidad
                .responsabilidadesChampion;
    }

    if (
        oportunidadSeleccionada.rol ===
        "Learner"
    ) {

        responsabilidades =
            oportunidad
                .responsabilidadesLearner;
    }

    asignarTextoOportunidad(
        "detalleResponsabilidadesOportunidad",
        responsabilidades
    );

    const postulacion =
        obtenerPostulacionUsuario(id);

    const boton =
        document.getElementById(
            "botonPostularse"
        );

    if (boton) {

        boton.textContent =
            postulacion
                ? "Ver mi postulación"
                : "Postularme como " +
                  oportunidadSeleccionada.rol;
    }

    abrirPanel(
        "modalOportunidad"
    );
}


function cerrarModalOportunidad() {

    cerrarPanel(
        "modalOportunidad"
    );

    oportunidadSeleccionada =
        null;
}


/*
==================================================
DETALLE DE POSTULACIÓN
==================================================
*/

function configurarPanelPostulacion() {

    document
        .getElementById(
            "cerrarDetallePostulacion"
        )
        ?.addEventListener(
            "click",
            cerrarDetallePostulacion
        );

    document
        .getElementById(
            "cerrarDetallePostulacionInferior"
        )
        ?.addEventListener(
            "click",
            cerrarDetallePostulacion
        );

    document
        .getElementById(
            "cancelarPostulacion"
        )
        ?.addEventListener(
            "click",
            cancelarPostulacionSeleccionada
        );

    document
        .getElementById(
            "panelDetallePostulacion"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "panelDetallePostulacion"
                ) {

                    cerrarDetallePostulacion();
                }
            }
        );
}


function abrirDetallePostulacion(id) {

    postulacionSeleccionada =
        obtenerPostulacionesUsuario()
            .find(
                function (postulacion) {

                    return postulacion.id === id;
                }
            );

    if (!postulacionSeleccionada) {

        return;
    }

    asignarTextoOportunidad(
        "detalleProyectoPostulacion",
        postulacionSeleccionada.proyecto
    );

    asignarTextoOportunidad(
        "detalleRolPostulacion",
        postulacionSeleccionada
            .rolSolicitado
    );

    asignarTextoOportunidad(
        "detalleCompatibilidadPostulacion",
        postulacionSeleccionada
            .compatibilidad +
        "%"
    );

    asignarTextoOportunidad(
        "detalleFechaPostulacion",
        formatearFechaPostulacion(
            postulacionSeleccionada.fecha
        )
    );

    asignarTextoOportunidad(
        "detalleEstadoPostulacion",
        postulacionSeleccionada.estado
    );

    asignarTextoOportunidad(
        "detalleComentarioPostulacion",
        postulacionSeleccionada
            .comentarioGerente ||
        "Todavía no hay comentarios del gerente."
    );

    asignarTextoOportunidad(
        "detalleProximoPasoPostulacion",
        obtenerProximoPasoPostulacion(
            postulacionSeleccionada.estado
        )
    );

    const botonCancelar =
        document.getElementById(
            "cancelarPostulacion"
        );

    if (botonCancelar) {

        const estado =
            normalizarOportunidad(
                postulacionSeleccionada.estado
            );

        const puedeCancelar =
            estado === "pendiente" ||
            estado === "en revision";

        botonCancelar.style.display =
            puedeCancelar
                ? "inline-block"
                : "none";
    }

    abrirPanel(
        "panelDetallePostulacion"
    );
}


function cerrarDetallePostulacion() {

    cerrarPanel(
        "panelDetallePostulacion"
    );

    postulacionSeleccionada =
        null;
}


function cancelarPostulacionSeleccionada() {

    if (!postulacionSeleccionada) {

        return;
    }

    const confirmar =
        window.confirm(
            "¿Deseas cancelar esta postulación?"
        );

    if (!confirmar) {

        return;
    }

    const postulaciones =
        obtenerPostulaciones();

    const postulacion =
        postulaciones.find(
            function (registro) {

                return registro.id ===
                    postulacionSeleccionada.id;
            }
        );

    if (!postulacion) {

        return;
    }

    postulacion.estado =
        "Cancelado";

    postulacion.fechaActualizacion =
        new Date().toISOString();

    localStorage.setItem(
        "octoflowPostulaciones",
        JSON.stringify(postulaciones)
    );

    cerrarDetallePostulacion();

    mostrarNotificacion(
        "Postulación cancelada."
    );

    actualizarPortalOportunidades();
}


/*
==================================================
FILTROS
==================================================
*/

function configurarFiltrosOportunidades() {

    [
        "buscarOportunidad",
        "filtroRolOportunidad",
        "filtroAreaOportunidad",
        "ordenOportunidades"
    ].forEach(
        function (id) {

            const elemento =
                document.getElementById(id);

            elemento?.addEventListener(
                id === "buscarOportunidad"
                    ? "input"
                    : "change",
                mostrarOportunidades
            );
        }
    );

    document
        .getElementById(
            "limpiarFiltrosOportunidades"
        )
        ?.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "buscarOportunidad"
                ).value = "";

                document.getElementById(
                    "filtroRolOportunidad"
                ).value = "";

                document.getElementById(
                    "filtroAreaOportunidad"
                ).value = "";

                document.getElementById(
                    "ordenOportunidades"
                ).value =
                    "compatibilidad";

                mostrarOportunidades();
            }
        );
}


function configurarFiltrosPostulaciones() {

    document
        .getElementById(
            "buscarPostulacion"
        )
        ?.addEventListener(
            "input",
            mostrarPostulaciones
        );

    document
        .getElementById(
            "filtroEstadoPostulacion"
        )
        ?.addEventListener(
            "change",
            mostrarPostulaciones
        );

    document
        .getElementById(
            "limpiarFiltrosPostulaciones"
        )
        ?.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "buscarPostulacion"
                ).value = "";

                document.getElementById(
                    "filtroEstadoPostulacion"
                ).value = "";

                mostrarPostulaciones();
            }
        );
}


function cargarAreasOportunidades() {

    const selector =
        document.getElementById(
            "filtroAreaOportunidad"
        );

    if (!selector) {

        return;
    }

    selector.innerHTML = `
        <option value="">
            Todas las áreas
        </option>
    `;

    const areas =
        [
            ...new Set(
                recomendacionesCalculadas
                    .map(
                        function (resultado) {

                            return resultado
                                .oportunidad
                                .area;
                        }
                    )
                    .filter(Boolean)
            )
        ].sort();

    areas.forEach(
        function (area) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                area;

            opcion.textContent =
                area;

            selector.appendChild(
                opcion
            );
        }
    );
}


/*
==================================================
RESÚMENES
==================================================
*/

function actualizarResumenOportunidades() {

    const postulaciones =
        obtenerPostulacionesUsuario();

    const champion =
        recomendacionesCalculadas.filter(
            function (resultado) {

                return resultado.rol ===
                    "Champion";
            }
        ).length;

    const learner =
        recomendacionesCalculadas.filter(
            function (resultado) {

                return resultado.rol ===
                    "Learner";
            }
        ).length;

    actualizarTextoOportunidad(
        "totalOportunidades",
        recomendacionesCalculadas.length
    );

    actualizarTextoOportunidad(
        "totalChampion",
        champion
    );

    actualizarTextoOportunidad(
        "totalLearner",
        learner
    );

    actualizarTextoOportunidad(
        "totalPostulaciones",
        postulaciones.length
    );
}


/*
==================================================
UTILIDADES
==================================================
*/

function mostrarAvisoPerfil(
    habilidades,
    perfil
) {

    const aviso =
        document.getElementById(
            "avisoPerfilIncompleto"
        );

    if (!aviso) {

        return;
    }

    aviso.classList.toggle(
        "oculto",
        habilidades.length > 0 &&
        Boolean(perfil)
    );
}


function obtenerPostulacionUsuario(
    oportunidadId
) {

    return obtenerPostulacionesUsuario()
        .find(
            function (postulacion) {

                return (
                    postulacion.oportunidadId ===
                    oportunidadId
                );
            }
        );
}


function obtenerProximoPasoPostulacion(
    estado
) {

    const valor =
        normalizarOportunidad(
            estado
        );

    if (valor === "pendiente") {

        return "La postulación está esperando revisión del gerente.";
    }

    if (valor === "en revision") {

        return "El gerente está evaluando tu perfil y disponibilidad.";
    }

    if (valor === "preseleccionado") {

        return "Tu perfil fue preseleccionado. El gerente definirá el equipo.";
    }

    if (valor === "aceptado") {

        return "Fuiste aceptado. El proyecto aparecerá en Mis proyectos cuando sea iniciado.";
    }

    if (valor === "no seleccionado") {

        return "No fuiste seleccionado para esta oportunidad.";
    }

    if (valor === "cancelado") {

        return "La postulación fue cancelada.";
    }

    return "Consulta con el gerente para conocer el siguiente paso.";
}


function obtenerClaseEstadoPostulacion(
    estado
) {

    const valor =
        normalizarOportunidad(
            estado
        );

    if (valor === "aceptado") {

        return "estado-postulacion-aceptada";
    }

    if (valor === "no seleccionado") {

        return "estado-postulacion-rechazada";
    }

    if (valor === "cancelado") {

        return "estado-postulacion-cancelada";
    }

    if (valor === "preseleccionado") {

        return "estado-postulacion-preseleccionada";
    }

    if (valor === "en revision") {

        return "estado-postulacion-revision";
    }

    return "estado-postulacion-pendiente";
}


function obtenerClaseCompatibilidad(
    porcentaje
) {

    if (porcentaje >= 75) {

        return "compatibilidad-alta";
    }

    if (porcentaje >= 45) {

        return "compatibilidad-media";
    }

    return "compatibilidad-baja";
}


function actualizarContadorOportunidades(
    cantidad
) {

    actualizarTextoOportunidad(
        "contadorOportunidades",
        cantidad === 1
            ? "1 oportunidad"
            : cantidad +
              " oportunidades"
    );
}


function formatearFechaPostulacion(
    fecha
) {

    const valor =
        new Date(fecha);

    if (
        Number.isNaN(
            valor.getTime()
        )
    ) {

        return "Sin fecha";
    }

    return valor.toLocaleDateString(
        "es-MX",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function abrirPanel(id) {

    const panel =
        document.getElementById(id);

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
}


function cerrarPanel(id) {

    const panel =
        document.getElementById(id);

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


function actualizarTextoOportunidad(
    id,
    texto
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            texto;
    }
}


function asignarTextoOportunidad(
    id,
    texto
) {

    actualizarTextoOportunidad(
        id,
        texto || "—"
    );
}


function normalizarOportunidad(
    texto
) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escaparOportunidad(
    texto
) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function escaparAtributoOportunidad(
    texto
) {

    return String(texto || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}