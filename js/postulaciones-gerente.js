/*
==================================================
OCTOFLOW - POSTULACIONES DEL GERENTE
==================================================
*/

let postulacionSeleccionadaGerente = null;


document.addEventListener(
    "DOMContentLoaded",
    iniciarPostulacionesGerente
);


/*
==================================================
INICIAR
==================================================
*/

function iniciarPostulacionesGerente() {

    configurarFiltrosPostulacionesGerente();

    configurarPanelPostulacionGerente();

    actualizarModuloPostulacionesGerente();
}


/*
==================================================
ACTUALIZAR
==================================================
*/

function actualizarModuloPostulacionesGerente() {

    cargarProyectosFiltroGerente();

    actualizarResumenPostulacionesGerente();

    mostrarPostulacionesGerenteCompleto();
}


/*
==================================================
DATOS
==================================================
*/

function obtenerPostulacionesGerenteCompleto() {

    return leerColeccionPostulaciones(
        "octoflowPostulaciones"
    );
}


function obtenerOportunidadesPostulaciones() {

    return leerColeccionPostulaciones(
        "octoflowOportunidades"
    );
}


function obtenerHabilidadesPostulaciones() {

    return leerColeccionPostulaciones(
        "octoflowHabilidades"
    );
}


function obtenerPerfilesPostulaciones() {

    return leerColeccionPostulaciones(
        "octoflowPerfilesHabilidades"
    );
}


function leerColeccionPostulaciones(clave) {

    const datos =
        localStorage.getItem(clave);

    if (!datos) {

        return [];
    }

    try {

        const coleccion =
            JSON.parse(datos);

        return Array.isArray(coleccion)
            ? coleccion
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer " + clave,
            error
        );

        return [];
    }
}


/*
==================================================
RESUMEN
==================================================
*/

function actualizarResumenPostulacionesGerente() {

    const postulaciones =
        obtenerPostulacionesGerenteCompleto();

    const pendientes =
        postulaciones.filter(
            function (postulacion) {

                const estado =
                    normalizarPostulacionGerente(
                        postulacion.estado
                    );

                return (
                    estado === "pendiente" ||
                    estado === "en revision"
                );
            }
        ).length;

    const preseleccionadas =
        postulaciones.filter(
            function (postulacion) {

                return normalizarPostulacionGerente(
                    postulacion.estado
                ) === "preseleccionado";
            }
        ).length;

    const aceptadas =
        postulaciones.filter(
            function (postulacion) {

                return normalizarPostulacionGerente(
                    postulacion.estado
                ) === "aceptado";
            }
        ).length;

    asignarTextoPostulacionGerente(
        "totalPostulacionesGerente",
        postulaciones.length
    );

    asignarTextoPostulacionGerente(
        "postulacionesPendientesGerente",
        pendientes
    );

    asignarTextoPostulacionGerente(
        "postulacionesPreseleccionadasGerente",
        preseleccionadas
    );

    asignarTextoPostulacionGerente(
        "postulacionesAceptadasGerente",
        aceptadas
    );
}


/*
==================================================
MOSTRAR TABLA
==================================================
*/

function mostrarPostulacionesGerenteCompleto() {

    const tabla =
        document.getElementById(
            "tablaPostulacionesGerente"
        );

    if (!tabla) {

        return;
    }

    const busqueda =
        normalizarPostulacionGerente(
            document
                .getElementById(
                    "buscarPostulacionGerente"
                )
                ?.value
        );

    const filtroProyecto =
        document
            .getElementById(
                "filtroProyectoPostulacionGerente"
            )
            ?.value || "";

    const filtroEstado =
        normalizarPostulacionGerente(
            document
                .getElementById(
                    "filtroEstadoPostulacionGerente"
                )
                ?.value
        );

    const filtroRol =
        document
            .getElementById(
                "filtroRolPostulacionGerente"
            )
            ?.value || "";

    const postulaciones =
        obtenerPostulacionesGerenteCompleto()
            .filter(
                function (postulacion) {

                    const nombre =
                        convertirCorreoPostulacion(
                            postulacion.correo
                        );

                    const texto =
                        normalizarPostulacionGerente(
                            [
                                nombre,
                                postulacion.correo,
                                postulacion.proyecto,
                                postulacion.rolSolicitado
                            ].join(" ")
                        );

                    const coincideBusqueda =
                        busqueda === "" ||
                        texto.includes(busqueda);

                    const coincideProyecto =
                        filtroProyecto === "" ||
                        postulacion.oportunidadId ===
                            filtroProyecto;

                    const coincideEstado =
                        filtroEstado === "" ||
                        normalizarPostulacionGerente(
                            postulacion.estado
                        ) === filtroEstado;

                    const coincideRol =
                        filtroRol === "" ||
                        postulacion.rolSolicitado ===
                            filtroRol;

                    return (
                        coincideBusqueda &&
                        coincideProyecto &&
                        coincideEstado &&
                        coincideRol
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(b.fecha || 0) -
                        new Date(a.fecha || 0)
                    );
                }
            );

    asignarTextoPostulacionGerente(
        "contadorPostulacionesGerente",
        postulaciones.length === 1
            ? "1 postulación"
            : postulaciones.length +
              " postulaciones"
    );

    if (postulaciones.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="7"
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

                    const nombre =
                        convertirCorreoPostulacion(
                            postulacion.correo
                        );

                    return `
                        <tr>

                            <td>

                                <strong>
                                    ${escaparPostulacionGerente(
                                        nombre
                                    )}
                                </strong>

                                <small class="correo-tabla">
                                    ${escaparPostulacionGerente(
                                        postulacion.correo
                                    )}
                                </small>

                            </td>

                            <td>
                                ${escaparPostulacionGerente(
                                    postulacion.proyecto ||
                                    "Proyecto"
                                )}
                            </td>

                            <td>

                                <span
                                    class="
                                        etiqueta-rol
                                        ${obtenerClaseRolPostulacion(
                                            postulacion.rolAsignado ||
                                            postulacion.rolSolicitado
                                        )}
                                    "
                                >
                                    ${escaparPostulacionGerente(
                                        postulacion.rolAsignado ||
                                        postulacion.rolSolicitado ||
                                        "Contributor"
                                    )}
                                </span>

                            </td>

                            <td>
                                <strong>
                                    ${Number(
                                        postulacion.compatibilidad ||
                                        0
                                    )}%
                                </strong>
                            </td>

                            <td>
                                ${formatearFechaPostulacionGerente(
                                    postulacion.fecha
                                )}
                            </td>

                            <td>

                                <span
                                    class="
                                        estado-postulacion
                                        ${obtenerClaseEstadoPostulacionGerente(
                                            postulacion.estado
                                        )}
                                    "
                                >
                                    ${escaparPostulacionGerente(
                                        postulacion.estado ||
                                        "Pendiente"
                                    )}
                                </span>

                            </td>

                            <td>

                                <button
                                    class="boton-tabla"
                                    type="button"
                                    onclick="abrirPostulacionGerente(
                                        '${escaparAtributoPostulacionGerente(
                                            postulacion.id
                                        )}'
                                    )"
                                >
                                    Evaluar
                                </button>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/*
==================================================
PANEL LATERAL
==================================================
*/

function configurarPanelPostulacionGerente() {

    const panel =
        document.getElementById(
            "panelPostulacionGerente"
        );

    document
        .getElementById(
            "cerrarPanelPostulacionGerente"
        )
        ?.addEventListener(
            "click",
            cerrarPostulacionGerente
        );

    document
        .getElementById(
            "cerrarPanelPostulacionGerenteInferior"
        )
        ?.addEventListener(
            "click",
            cerrarPostulacionGerente
        );

    document
        .getElementById(
            "guardarEvaluacionPostulacion"
        )
        ?.addEventListener(
            "click",
            guardarEvaluacionPostulacion
        );

    panel?.addEventListener(
        "click",
        function (evento) {

            if (evento.target === panel) {

                cerrarPostulacionGerente();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (evento.key === "Escape") {

                cerrarPostulacionGerente();
            }
        }
    );
}


function abrirPostulacionGerente(id) {

    postulacionSeleccionadaGerente =
        obtenerPostulacionesGerenteCompleto()
            .find(
                function (postulacion) {

                    return postulacion.id === id;
                }
            );

    if (!postulacionSeleccionadaGerente) {

        mostrarNotificacion(
            "No fue posible encontrar la postulación."
        );

        return;
    }

    const postulacion =
        postulacionSeleccionadaGerente;

    const perfil =
        obtenerPerfilCandidato(
            postulacion.correo
        );

    const oportunidad =
        obtenerOportunidadCandidato(
            postulacion.oportunidadId
        );

    const nombre =
        convertirCorreoPostulacion(
            postulacion.correo
        );

    asignarTextoPostulacionGerente(
        "detalleCandidatoPostulacion",
        nombre
    );

    asignarTextoPostulacionGerente(
        "detalleCompatibilidadCandidato",
        Number(
            postulacion.compatibilidad || 0
        ) + "%"
    );

    asignarTextoPostulacionGerente(
        "detalleProyectoCandidato",
        postulacion.proyecto ||
        oportunidad?.titulo ||
        "Proyecto"
    );

    asignarTextoPostulacionGerente(
        "detalleEstadoCandidato",
        postulacion.estado ||
        "Pendiente"
    );

    asignarTextoPostulacionGerente(
        "detalleCorreoCandidato",
        postulacion.correo
    );

    asignarTextoPostulacionGerente(
        "detalleFechaCandidato",
        formatearFechaPostulacionGerente(
            postulacion.fecha
        )
    );

    asignarTextoPostulacionGerente(
        "detalleRolSolicitadoCandidato",
        postulacion.rolSolicitado ||
        "Contributor"
    );

    asignarTextoPostulacionGerente(
        "detalleDisponibilidadCandidato",
        perfil?.disponibilidad
            ? perfil.disponibilidad +
              " horas por semana"
            : "No especificada"
    );

    asignarTextoPostulacionGerente(
        "detalleAreaPrincipalCandidato",
        perfil?.areaPrincipal ||
        "No especificada"
    );

    asignarTextoPostulacionGerente(
        "detalleAreasInteresCandidato",
        perfil?.areasInteres ||
        "No especificadas"
    );

    const rolAsignado =
        document.getElementById(
            "rolAsignadoPostulacion"
        );

    if (rolAsignado) {

        rolAsignado.value =
            postulacion.rolAsignado ||
            postulacion.rolSolicitado ||
            "Contributor";
    }

    const estado =
        document.getElementById(
            "estadoPostulacionGerente"
        );

    if (estado) {

        const estadoActual =
            postulacion.estado === "Pendiente"
                ? "En revisión"
                : postulacion.estado;

        const estadosPermitidos = [
            "En revisión",
            "Preseleccionado",
            "Aceptado",
            "No seleccionado"
        ];

        estado.value =
            estadosPermitidos.includes(
                estadoActual
            )
                ? estadoActual
                : "En revisión";
    }

    const comentario =
        document.getElementById(
            "comentarioPostulacionGerente"
        );

    if (comentario) {

        comentario.value =
            postulacion.comentarioGerente ||
            "";
    }

    mostrarEstadoEquipoOportunidad(
        oportunidad
    );

    mostrarHabilidadesCandidato(
        postulacion.correo
    );

    abrirPanelPostulacionGerente();
}


function abrirPanelPostulacionGerente() {

    const panel =
        document.getElementById(
            "panelPostulacionGerente"
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
}


function cerrarPostulacionGerente() {

    const panel =
        document.getElementById(
            "panelPostulacionGerente"
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

    postulacionSeleccionadaGerente =
        null;
}


/*
==================================================
HABILIDADES DEL CANDIDATO
==================================================
*/

function mostrarHabilidadesCandidato(correo) {

    const contenedor =
        document.getElementById(
            "listaHabilidadesCandidato"
        );

    if (!contenedor) {

        return;
    }

    const habilidades =
        obtenerHabilidadesPostulaciones()
            .filter(
                function (habilidad) {

                    return normalizarPostulacionGerente(
                        habilidad.correo
                    ) === normalizarPostulacionGerente(
                        correo
                    );
                }
            )
            .sort(
                function (a, b) {

                    return String(
                        a.herramienta || ""
                    ).localeCompare(
                        String(
                            b.herramienta || ""
                        ),
                        "es"
                    );
                }
            );

    asignarTextoPostulacionGerente(
        "contadorHabilidadesCandidato",
        habilidades.length === 1
            ? "1 herramienta"
            : habilidades.length +
              " herramientas"
    );

    if (habilidades.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                El candidato no ha registrado habilidades.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        habilidades
            .map(
                function (habilidad) {

                    return `
                        <article class="habilidad-candidato">

                            <div>

                                <strong>
                                    ${escaparPostulacionGerente(
                                        habilidad.herramienta
                                    )}
                                </strong>

                                <span>
                                    ${escaparPostulacionGerente(
                                        habilidad.nivel ||
                                        "Sin experiencia"
                                    )}
                                </span>

                            </div>

                            <small>
                                ${escaparPostulacionGerente(
                                    habilidad.objetivo ||
                                    "Sin objetivo"
                                )}
                            </small>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
ESTADO DEL EQUIPO
==================================================
*/

function mostrarEstadoEquipoOportunidad(
    oportunidad
) {

    asignarTextoPostulacionGerente(
        "estadoChampionOportunidad",
        oportunidad?.championAsignado
            ? oportunidad.championNombre ||
              "Asignado"
            : "Vacante"
    );

    asignarTextoPostulacionGerente(
        "estadoLearnerOportunidad",
        oportunidad?.learnerAsignado
            ? oportunidad.learnerNombre ||
              "Asignado"
            : "Vacante"
    );
}


/*
==================================================
GUARDAR EVALUACIÓN
==================================================
*/

function guardarEvaluacionPostulacion() {

    if (!postulacionSeleccionadaGerente) {

        return;
    }

    const rol =
        document
            .getElementById(
                "rolAsignadoPostulacion"
            )
            ?.value || "Contributor";

    const estado =
        document
            .getElementById(
                "estadoPostulacionGerente"
            )
            ?.value || "En revisión";

    const comentario =
        document
            .getElementById(
                "comentarioPostulacionGerente"
            )
            ?.value
            .trim() || "";

    if (
        estado === "No seleccionado" &&
        comentario === ""
    ) {

        mostrarMensajeEvaluacion(
            "Agrega un comentario explicando la decisión.",
            "error"
        );

        return;
    }

    const postulaciones =
        obtenerPostulacionesGerenteCompleto();

    const postulacion =
        postulaciones.find(
            function (registro) {

                return registro.id ===
                    postulacionSeleccionadaGerente.id;
            }
        );

    if (!postulacion) {

        mostrarMensajeEvaluacion(
            "No fue posible encontrar la postulación.",
            "error"
        );

        return;
    }

    postulacion.rolAsignado =
        rol;

    postulacion.estado =
        estado;

    postulacion.comentarioGerente =
        comentario;

    postulacion.fechaActualizacion =
        new Date().toISOString();

    postulacion.revisadoPor =
        localStorage.getItem(
            "octoflowCorreo"
        ) || "";

    localStorage.setItem(
        "octoflowPostulaciones",
        JSON.stringify(postulaciones)
    );

    /*
    Si fue aceptado, actualizamos la vacante
    dentro de la oportunidad.
    */

    actualizarEquipoOportunidad(
        postulacion,
        rol,
        estado
    );

    postulacionSeleccionadaGerente =
        postulacion;

    asignarTextoPostulacionGerente(
        "detalleEstadoCandidato",
        estado
    );

    mostrarMensajeEvaluacion(
        "La evaluación fue guardada correctamente.",
        "exito"
    );

    actualizarModuloPostulacionesGerente();

    setTimeout(
        function () {

            cerrarPostulacionGerente();

            mostrarNotificacion(
                "La postulación fue actualizada a " +
                estado +
                "."
            );

        },
        800
    );
}


/*
==================================================
ACTUALIZAR EQUIPO DE LA OPORTUNIDAD
==================================================
*/

function actualizarEquipoOportunidad(
    postulacion,
    rol,
    estado
) {

    const oportunidades =
        obtenerOportunidadesPostulaciones();

    const oportunidad =
        oportunidades.find(
            function (registro) {

                return registro.id ===
                    postulacion.oportunidadId;
            }
        );

    if (!oportunidad) {

        return;
    }

    const nombre =
        convertirCorreoPostulacion(
            postulacion.correo
        );

    /*
    Solo se ocupa formalmente la vacante
    cuando el candidato es aceptado.
    */

    if (estado === "Aceptado") {

        if (rol === "Champion") {

            oportunidad.championAsignado =
                true;

            oportunidad.championCorreo =
                postulacion.correo;

            oportunidad.championNombre =
                nombre;
        }

        if (rol === "Learner") {

            oportunidad.learnerAsignado =
                true;

            oportunidad.learnerCorreo =
                postulacion.correo;

            oportunidad.learnerNombre =
                nombre;
        }
    }

    localStorage.setItem(
        "octoflowOportunidades",
        JSON.stringify(oportunidades)
    );
}


/*
==================================================
PERFIL Y OPORTUNIDAD
==================================================
*/

function obtenerPerfilCandidato(correo) {

    return obtenerPerfilesPostulaciones()
        .find(
            function (perfil) {

                return normalizarPostulacionGerente(
                    perfil.correo
                ) === normalizarPostulacionGerente(
                    correo
                );
            }
        ) || null;
}


function obtenerOportunidadCandidato(id) {

    return obtenerOportunidadesPostulaciones()
        .find(
            function (oportunidad) {

                return oportunidad.id === id;
            }
        ) || null;
}


/*
==================================================
FILTROS
==================================================
*/

function configurarFiltrosPostulacionesGerente() {

    document
        .getElementById(
            "buscarPostulacionGerente"
        )
        ?.addEventListener(
            "input",
            mostrarPostulacionesGerenteCompleto
        );

    document
        .getElementById(
            "filtroProyectoPostulacionGerente"
        )
        ?.addEventListener(
            "change",
            mostrarPostulacionesGerenteCompleto
        );

    document
        .getElementById(
            "filtroEstadoPostulacionGerente"
        )
        ?.addEventListener(
            "change",
            mostrarPostulacionesGerenteCompleto
        );

    document
        .getElementById(
            "filtroRolPostulacionGerente"
        )
        ?.addEventListener(
            "change",
            mostrarPostulacionesGerenteCompleto
        );

    document
        .getElementById(
            "limpiarFiltrosPostulacionesGerente"
        )
        ?.addEventListener(
            "click",
            function () {

                const buscar =
                    document.getElementById(
                        "buscarPostulacionGerente"
                    );

                const proyecto =
                    document.getElementById(
                        "filtroProyectoPostulacionGerente"
                    );

                const estado =
                    document.getElementById(
                        "filtroEstadoPostulacionGerente"
                    );

                const rol =
                    document.getElementById(
                        "filtroRolPostulacionGerente"
                    );

                if (buscar) {
                    buscar.value = "";
                }

                if (proyecto) {
                    proyecto.value = "";
                }

                if (estado) {
                    estado.value = "";
                }

                if (rol) {
                    rol.value = "";
                }

                mostrarPostulacionesGerenteCompleto();
            }
        );
}


function cargarProyectosFiltroGerente() {

    const selector =
        document.getElementById(
            "filtroProyectoPostulacionGerente"
        );

    if (!selector) {

        return;
    }

    const valorActual =
        selector.value;

    selector.innerHTML = `
        <option value="">
            Todos los proyectos
        </option>
    `;

    const proyectos = [
        ...new Map(
            obtenerPostulacionesGerenteCompleto()
                .map(
                    function (postulacion) {

                        return [
                            postulacion.oportunidadId,
                            postulacion.proyecto
                        ];
                    }
                )
                .filter(
                    function (registro) {

                        return Boolean(
                            registro[0]
                        );
                    }
                )
        ).entries()
    ];

    proyectos
        .sort(
            function (a, b) {

                return String(a[1])
                    .localeCompare(
                        String(b[1]),
                        "es"
                    );
            }
        )
        .forEach(
            function (proyecto) {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    proyecto[0];

                opcion.textContent =
                    proyecto[1] ||
                    proyecto[0];

                selector.appendChild(
                    opcion
                );
            }
        );

    if (
        [...selector.options].some(
            function (opcion) {

                return opcion.value ===
                    valorActual;
            }
        )
    ) {

        selector.value =
            valorActual;
    }
}


/*
==================================================
UTILIDADES
==================================================
*/

function obtenerClaseRolPostulacion(rol) {

    const valor =
        normalizarPostulacionGerente(
            rol
        );

    if (valor === "champion") {

        return "champion";
    }

    if (valor === "learner") {

        return "learner";
    }

    return "contributor";
}


function obtenerClaseEstadoPostulacionGerente(
    estado
) {

    const valor =
        normalizarPostulacionGerente(
            estado
        );

    if (valor === "aceptado") {

        return "estado-postulacion-aceptada";
    }

    if (
        valor === "no seleccionado"
    ) {

        return "estado-postulacion-rechazada";
    }

    if (valor === "cancelado") {

        return "estado-postulacion-cancelada";
    }

    if (
        valor === "preseleccionado"
    ) {

        return "estado-postulacion-preseleccionada";
    }

    if (valor === "en revision") {

        return "estado-postulacion-revision";
    }

    return "estado-postulacion-pendiente";
}


function convertirCorreoPostulacion(correo) {

    return String(correo || "Usuario")
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(
            function (palabra) {

                return (
                    palabra.charAt(0).toUpperCase() +
                    palabra.slice(1)
                );
            }
        )
        .join(" ");
}


function formatearFechaPostulacionGerente(fecha) {

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


function mostrarMensajeEvaluacion(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajePostulacionGerente"
        );

    if (!mensaje) {

        return;
    }

    mensaje.className =
        "mensaje-formulario " + tipo;

    mensaje.textContent =
        texto;
}


function asignarTextoPostulacionGerente(
    id,
    texto
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            texto ?? "—";
    }
}


function normalizarPostulacionGerente(
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


function escaparPostulacionGerente(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function escaparAtributoPostulacionGerente(
    texto
) {

    return String(texto || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}