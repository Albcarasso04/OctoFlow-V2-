/*
==================================================
OCTOFLOW - REVISIÓN DE IDEAS
==================================================
*/

let ideaSeleccionadaGerente = null;


document.addEventListener(
    "DOMContentLoaded",
    iniciarRevisionIdeas
);


/*
==================================================
INICIAR MÓDULO
==================================================
*/

function iniciarRevisionIdeas() {

    configurarFiltrosRevisionIdeas();

    configurarPanelesRevision();

    actualizarRevisionIdeas();
}


/*
==================================================
ACTUALIZAR PÁGINA
==================================================
*/

function actualizarRevisionIdeas() {

    cargarAreasRevisionIdeas();

    actualizarResumenRevisionIdeas();

    mostrarRevisionIdeas();
}


/*
==================================================
DATOS
==================================================
*/

function obtenerIdeasRevision() {

    return leerColeccionRevision(
        "octoflowIdeas"
    );
}


function obtenerOportunidadesRevision() {

    return leerColeccionRevision(
        "octoflowOportunidades"
    );
}


function leerColeccionRevision(clave) {

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

function actualizarResumenRevisionIdeas() {

    const ideas =
        obtenerIdeasRevision();

    const enRevision =
        ideas.filter(
            function (idea) {

                return normalizarRevision(
                    idea.estado
                ) === "en revision";
            }
        ).length;

    const informacionRequerida =
        ideas.filter(
            function (idea) {

                return normalizarRevision(
                    idea.estado
                ) === "informacion requerida";
            }
        ).length;

    const aprobadas =
        ideas.filter(
            function (idea) {

                const estado =
                    normalizarRevision(
                        idea.estado
                    );

                return (
                    estado === "aprobada" ||
                    estado ===
                        "convertida en oportunidad"
                );
            }
        ).length;

    asignarTextoRevision(
        "totalIdeasRevision",
        ideas.length
    );

    asignarTextoRevision(
        "ideasEnRevision",
        enRevision
    );

    asignarTextoRevision(
        "ideasInformacionRequerida",
        informacionRequerida
    );

    asignarTextoRevision(
        "ideasAprobadasGerente",
        aprobadas
    );
}


/*
==================================================
MOSTRAR TABLA
==================================================
*/

function mostrarRevisionIdeas() {

    const tabla =
        document.getElementById(
            "tablaRevisionIdeas"
        );

    if (!tabla) {

        return;
    }

    const busqueda =
        normalizarRevision(
            document
                .getElementById(
                    "buscarIdeaGerente"
                )
                ?.value
        );

    const filtroEstado =
        normalizarRevision(
            document
                .getElementById(
                    "filtroEstadoIdeaGerente"
                )
                ?.value
        );

    const filtroArea =
        normalizarRevision(
            document
                .getElementById(
                    "filtroAreaIdeaGerente"
                )
                ?.value
        );

    const ideas =
        obtenerIdeasRevision()
            .filter(
                function (idea) {

                    const empleado =
                        convertirCorreoRevision(
                            idea.correo
                        );

                    const texto =
                        normalizarRevision(
                            [
                                idea.id,
                                idea.titulo,
                                idea.area,
                                idea.correo,
                                empleado
                            ].join(" ")
                        );

                    const coincideBusqueda =
                        busqueda === "" ||
                        texto.includes(busqueda);

                    const coincideEstado =
                        filtroEstado === "" ||
                        normalizarRevision(
                            idea.estado
                        ) === filtroEstado;

                    const coincideArea =
                        filtroArea === "" ||
                        normalizarRevision(
                            idea.area
                        ) === filtroArea;

                    return (
                        coincideBusqueda &&
                        coincideEstado &&
                        coincideArea
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        obtenerFechaRevision(b) -
                        obtenerFechaRevision(a)
                    );
                }
            );

    asignarTextoRevision(
        "contadorIdeasGerente",
        ideas.length === 1
            ? "1 idea"
            : ideas.length + " ideas"
    );

    if (ideas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="tabla-vacia"
                >
                    No se encontraron ideas.
                </td>
            </tr>
        `;

        return;
    }

    tabla.innerHTML =
        ideas
            .map(
                function (idea) {

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escaparRevision(
                                        idea.id ||
                                        "Sin ticket"
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escaparRevision(
                                    idea.titulo ||
                                    "Idea sin título"
                                )}
                            </td>

                            <td>
                                ${escaparRevision(
                                    convertirCorreoRevision(
                                        idea.correo
                                    )
                                )}
                            </td>

                            <td>
                                ${escaparRevision(
                                    idea.area ||
                                    "Sin área"
                                )}
                            </td>

                            <td>
                                ${escaparRevision(
                                    idea.fecha ||
                                    "Sin fecha"
                                )}
                            </td>

                            <td>

                                <span
                                    class="
                                        estado
                                        ${obtenerClaseEstadoRevision(
                                            idea.estado
                                        )}
                                    "
                                >
                                    ${escaparRevision(
                                        idea.estado ||
                                        "En revisión"
                                    )}
                                </span>

                            </td>

                            <td>

                                <button
                                    class="boton-tabla"
                                    type="button"
                                    onclick="abrirRevisionIdea(
                                        '${escaparAtributoRevision(
                                            idea.id
                                        )}'
                                    )"
                                >
                                    Revisar
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
CONFIGURAR PANELES Y BOTONES
==================================================
*/

function configurarPanelesRevision() {

    const panelRevision =
        document.getElementById(
            "panelRevisionIdea"
        );

    const panelPreguntas =
        document.getElementById(
            "panelSolicitarInformacion"
        );

    document
        .getElementById(
            "cerrarPanelRevisionIdea"
        )
        ?.addEventListener(
            "click",
            cerrarRevisionIdea
        );

    document
        .getElementById(
            "cerrarPanelRevisionIdeaInferior"
        )
        ?.addEventListener(
            "click",
            cerrarRevisionIdea
        );

    panelRevision?.addEventListener(
        "click",
        function (evento) {

            if (evento.target === panelRevision) {

                cerrarRevisionIdea();
            }
        }
    );

    document
        .getElementById(
            "botonSolicitarInformacion"
        )
        ?.addEventListener(
            "click",
            abrirPanelSolicitarInformacion
        );

    document
        .getElementById(
            "botonRechazarIdea"
        )
        ?.addEventListener(
            "click",
            eliminarIdeaRechazada
        );

    document
        .getElementById(
            "botonAprobarIdea"
        )
        ?.addEventListener(
            "click",
            aprobarIdea
        );

    document
        .getElementById(
            "botonPublicarOportunidad"
        )
        ?.addEventListener(
            "click",
            publicarOportunidadDesdeIdea
        );

    document
        .getElementById(
            "cerrarPanelSolicitarInformacion"
        )
        ?.addEventListener(
            "click",
            cerrarPanelSolicitarInformacion
        );

    document
        .getElementById(
            "cancelarSolicitudInformacion"
        )
        ?.addEventListener(
            "click",
            cerrarPanelSolicitarInformacion
        );

    document
        .getElementById(
            "enviarSolicitudInformacion"
        )
        ?.addEventListener(
            "click",
            guardarSolicitudInformacion
        );

    panelPreguntas?.addEventListener(
        "click",
        function (evento) {

            if (evento.target === panelPreguntas) {

                cerrarPanelSolicitarInformacion();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (evento.key !== "Escape") {

                return;
            }

            if (
                panelPreguntas?.classList.contains(
                    "visible"
                )
            ) {

                cerrarPanelSolicitarInformacion();

                return;
            }

            cerrarRevisionIdea();
        }
    );
}


/*
==================================================
ABRIR REVISIÓN
==================================================
*/

function abrirRevisionIdea(id) {

    ideaSeleccionadaGerente =
        obtenerIdeasRevision()
            .find(
                function (idea) {

                    return idea.id === id;
                }
            );

    if (!ideaSeleccionadaGerente) {

        mostrarNotificacion(
            "No fue posible encontrar la idea."
        );

        return;
    }

    const idea =
        ideaSeleccionadaGerente;

    asignarTextoRevision(
        "detalleTicketIdea",
        idea.id || "Sin ticket"
    );

    asignarTextoRevision(
        "detalleTituloIdea",
        idea.titulo || "Sin título"
    );

    asignarTextoRevision(
        "detalleEstadoIdea",
        idea.estado || "En revisión"
    );

    asignarTextoRevision(
        "detalleEmpleadoIdea",
        convertirCorreoRevision(
            idea.correo
        )
    );

    asignarTextoRevision(
        "detalleAreaIdea",
        idea.area || "Sin área"
    );

    asignarTextoRevision(
        "detalleFechaIdea",
        idea.fecha || "Sin fecha"
    );

    asignarTextoRevision(
        "detalleFrecuenciaIdea",
        idea.frecuencia ||
        "No especificada"
    );

    asignarTextoRevision(
        "detalleHorasIdea",
        idea.horas
            ? idea.horas + " horas"
            : "No especificadas"
    );

    asignarTextoRevision(
        "detalleImplementacionIdea",
        idea.implementacion ||
        "No especificada"
    );

    asignarTextoRevision(
        "detalleDescripcionIdea",
        idea.descripcion ||
        "Sin descripción"
    );

    asignarTextoRevision(
        "detalleProblemaIdea",
        idea.problema ||
        "Sin información"
    );

    asignarTextoRevision(
        "detalleSolucionIdea",
        idea.solucion ||
        "Sin solución sugerida"
    );

    const comentario =
        document.getElementById(
            "comentarioGerenteIdea"
        );

    if (comentario) {

        comentario.value =
            idea.comentarioGerente || "";
    }

    mostrarPreguntasGuardadas(
        idea
    );

    actualizarVisibilidadConversion(
        idea.estado
    );

    abrirPanelRevision(
        "panelRevisionIdea"
    );
}


/*
==================================================
CERRAR REVISIÓN
==================================================
*/

function cerrarRevisionIdea() {

    cerrarPanelRevision(
        "panelRevisionIdea"
    );

    cerrarPanelRevision(
        "panelSolicitarInformacion"
    );

    ideaSeleccionadaGerente =
        null;

    document.body.classList.remove(
        "modal-abierto"
    );
}


/*
==================================================
MOSTRAR PREGUNTAS GUARDADAS
==================================================
*/

function mostrarPreguntasGuardadas(idea) {

    const seccion =
        document.getElementById(
            "seccionPreguntasGuardadas"
        );

    const preguntas =
        String(
            idea.preguntasGerente || ""
        ).trim();

    if (!seccion) {

        return;
    }

    seccion.classList.toggle(
        "oculto",
        preguntas === ""
    );

    asignarTextoRevision(
        "detallePreguntasEnviadas",
        preguntas || "—"
    );

    asignarTextoRevision(
        "detalleFechaLimiteRespuesta",
        formatearFechaRevision(
            idea.fechaLimiteRespuesta
        )
    );

    const contenedorRespuesta =
        document.getElementById(
            "contenedorRespuestaEmpleado"
        );

    const respuesta =
        String(
            idea.respuestaEmpleado || ""
        ).trim();

    contenedorRespuesta?.classList.toggle(
        "oculto",
        respuesta === ""
    );

    asignarTextoRevision(
        "detalleRespuestaEmpleado",
        respuesta || "—"
    );
}


/*
==================================================
APROBAR IDEA
==================================================
*/

function aprobarIdea() {

    if (!ideaSeleccionadaGerente) {

        return;
    }

    const ideas =
        obtenerIdeasRevision();

    const idea =
        ideas.find(
            function (registro) {

                return registro.id ===
                    ideaSeleccionadaGerente.id;
            }
        );

    if (!idea) {

        return;
    }

    const comentario =
        document
            .getElementById(
                "comentarioGerenteIdea"
            )
            ?.value
            .trim() || "";

    idea.estado =
        "Aprobada";

    idea.comentarioGerente =
        comentario;

    idea.fechaRevision =
        new Date().toISOString();

    idea.revisadoPor =
        localStorage.getItem(
            "octoflowCorreo"
        ) || "";

    localStorage.setItem(
        "octoflowIdeas",
        JSON.stringify(ideas)
    );

    ideaSeleccionadaGerente =
        idea;

    asignarTextoRevision(
        "detalleEstadoIdea",
        "Aprobada"
    );

    actualizarVisibilidadConversion(
        "Aprobada"
    );

    actualizarRevisionIdeas();

    mostrarNotificacion(
        "La idea fue aprobada."
    );
}


/*
==================================================
RECHAZAR Y ELIMINAR IDEA
==================================================
*/

function eliminarIdeaRechazada() {

    if (!ideaSeleccionadaGerente) {

        return;
    }

    const titulo =
        ideaSeleccionadaGerente.titulo ||
        ideaSeleccionadaGerente.id ||
        "esta idea";

    const confirmar =
        window.confirm(
            '¿Deseas rechazar y eliminar definitivamente "' +
            titulo +
            '"?\n\nEsta acción no se puede deshacer.'
        );

    if (!confirmar) {

        return;
    }

    const idIdea =
        ideaSeleccionadaGerente.id;

    const ideasActualizadas =
        obtenerIdeasRevision()
            .filter(
                function (idea) {

                    return idea.id !== idIdea;
                }
            );

    localStorage.setItem(
        "octoflowIdeas",
        JSON.stringify(
            ideasActualizadas
        )
    );

    const oportunidadesActualizadas =
        obtenerOportunidadesRevision()
            .filter(
                function (oportunidad) {

                    return oportunidad.ideaId !== idIdea;
                }
            );

    localStorage.setItem(
        "octoflowOportunidades",
        JSON.stringify(
            oportunidadesActualizadas
        )
    );

    cerrarRevisionIdea();

    actualizarRevisionIdeas();

    mostrarNotificacion(
        "La idea fue rechazada y eliminada."
    );
}


/*
==================================================
ABRIR PANEL PARA PEDIR INFORMACIÓN
==================================================
*/

function abrirPanelSolicitarInformacion() {

    if (!ideaSeleccionadaGerente) {

        return;
    }

    asignarTextoRevision(
        "ideaSolicitudInformacion",
        ideaSeleccionadaGerente.titulo ||
        ideaSeleccionadaGerente.id
    );

    asignarTextoRevision(
        "empleadoSolicitudInformacion",
        convertirCorreoRevision(
            ideaSeleccionadaGerente.correo
        )
    );

    const preguntas =
        document.getElementById(
            "preguntasGerenteIdea"
        );

    if (preguntas) {

        preguntas.value =
            ideaSeleccionadaGerente
                .preguntasGerente || "";
    }

    const fecha =
        document.getElementById(
            "fechaLimiteRespuestaIdea"
        );

    if (fecha) {

        fecha.value =
            ideaSeleccionadaGerente
                .fechaLimiteRespuesta || "";
    }

    cerrarPanelRevision(
        "panelRevisionIdea"
    );

    abrirPanelRevision(
        "panelSolicitarInformacion"
    );

    setTimeout(
        function () {

            preguntas?.focus();

        },
        300
    );
}


/*
==================================================
CERRAR PANEL DE PREGUNTAS
==================================================
*/

function cerrarPanelSolicitarInformacion() {

    cerrarPanelRevision(
        "panelSolicitarInformacion"
    );

    if (ideaSeleccionadaGerente) {

        abrirPanelRevision(
            "panelRevisionIdea"
        );

    } else {

        document.body.classList.remove(
            "modal-abierto"
        );
    }
}


/*
==================================================
GUARDAR SOLICITUD DE INFORMACIÓN
==================================================
*/

function guardarSolicitudInformacion() {

    if (!ideaSeleccionadaGerente) {

        return;
    }

    const preguntas =
        document
            .getElementById(
                "preguntasGerenteIdea"
            )
            ?.value
            .trim() || "";

    const fechaLimite =
        document
            .getElementById(
                "fechaLimiteRespuestaIdea"
            )
            ?.value || "";

    if (preguntas === "") {

        mostrarMensajePreguntas(
            "Escribe al menos una pregunta.",
            "error"
        );

        return;
    }

    const ideas =
        obtenerIdeasRevision();

    const idea =
        ideas.find(
            function (registro) {

                return registro.id ===
                    ideaSeleccionadaGerente.id;
            }
        );

    if (!idea) {

        mostrarMensajePreguntas(
            "No fue posible encontrar la idea.",
            "error"
        );

        return;
    }

    idea.estado =
        "Información requerida";

    idea.preguntasGerente =
        preguntas;

    idea.fechaLimiteRespuesta =
        fechaLimite;

    idea.fechaSolicitudInformacion =
        new Date().toISOString();

    idea.solicitadoPor =
        localStorage.getItem(
            "octoflowCorreo"
        ) || "";

    /*
    Mantenemos una respuesta previa si ya existía.
    */

    idea.respuestaEmpleado =
        idea.respuestaEmpleado || "";

    idea.fechaRespuestaEmpleado =
        idea.fechaRespuestaEmpleado || "";

    localStorage.setItem(
        "octoflowIdeas",
        JSON.stringify(ideas)
    );

    ideaSeleccionadaGerente =
        idea;

    mostrarMensajePreguntas(
        "Las preguntas fueron enviadas correctamente.",
        "exito"
    );

    setTimeout(
        function () {

            cerrarPanelRevision(
                "panelSolicitarInformacion"
            );

            asignarTextoRevision(
                "detalleEstadoIdea",
                "Información requerida"
            );

            mostrarPreguntasGuardadas(
                idea
            );

            actualizarVisibilidadConversion(
                "Información requerida"
            );

            actualizarRevisionIdeas();

            abrirPanelRevision(
                "panelRevisionIdea"
            );

            mostrarNotificacion(
                "La solicitud fue enviada al empleado."
            );

        },
        700
    );
}


/*
==================================================
MOSTRAR U OCULTAR CONVERSIÓN
==================================================
*/

function actualizarVisibilidadConversion(
    estado
) {

    const seccion =
        document.getElementById(
            "seccionConvertirOportunidad"
        );

    if (!seccion) {

        return;
    }

    const mostrar =
        normalizarRevision(estado) ===
        "aprobada";

    seccion.classList.toggle(
        "oculto",
        !mostrar
    );
}


/*
==================================================
PUBLICAR OPORTUNIDAD
==================================================
*/

function publicarOportunidadDesdeIdea() {

    if (!ideaSeleccionadaGerente) {

        return;
    }

    const herramientasTexto =
        document
            .getElementById(
                "herramientasNuevaOportunidad"
            )
            ?.value
            .trim() || "";

    const herramientas =
        herramientasTexto
            .split(",")
            .map(
                function (herramienta) {

                    return herramienta.trim();
                }
            )
            .filter(Boolean);

    if (herramientas.length === 0) {

        mostrarNotificacion(
            "Agrega al menos una herramienta."
        );

        return;
    }

    const oportunidades =
        obtenerOportunidadesRevision();

    const yaExiste =
        oportunidades.some(
            function (oportunidad) {

                return oportunidad.ideaId ===
                    ideaSeleccionadaGerente.id;
            }
        );

    if (yaExiste) {

        mostrarNotificacion(
            "Esta idea ya fue convertida en oportunidad."
        );

        return;
    }

    const nuevaOportunidad = {

        id:
            generarIdOportunidad(),

        ideaId:
            ideaSeleccionadaGerente.id,

        titulo:
            ideaSeleccionadaGerente.titulo,

        area:
            ideaSeleccionadaGerente.area,

        descripcion:
            ideaSeleccionadaGerente.solucion ||
            ideaSeleccionadaGerente.descripcion,

        herramientas:
            herramientas,

        duracion:
            document
                .getElementById(
                    "duracionNuevaOportunidad"
                )
                .value,

        disponibilidad:
            Number(
                document
                    .getElementById(
                        "disponibilidadNuevaOportunidad"
                    )
                    .value
            ),

        dificultad:
            document
                .getElementById(
                    "dificultadNuevaOportunidad"
                )
                .value,

        estado:
            "Publicada",

        championAsignado:
            false,

        learnerAsignado:
            false,

        responsabilidadesChampion:
            document
                .getElementById(
                    "responsabilidadChampion"
                )
                .value
                .trim() ||
            "Diseñar la solución y orientar técnicamente al equipo.",

        responsabilidadesLearner:
            document
                .getElementById(
                    "responsabilidadLearner"
                )
                .value
                .trim() ||
            "Participar en tareas supervisadas, pruebas y documentación.",

        responsabilidadesContributor:
            document
                .getElementById(
                    "responsabilidadContributor"
                )
                .value
                .trim() ||
            "Apoyar en validaciones, datos y pruebas.",

        fechaPublicacion:
            new Date().toISOString(),

        publicadaPor:
            localStorage.getItem(
                "octoflowCorreo"
            ) || ""
    };

    oportunidades.push(
        nuevaOportunidad
    );

    localStorage.setItem(
        "octoflowOportunidades",
        JSON.stringify(oportunidades)
    );

    const ideas =
        obtenerIdeasRevision();

    const idea =
        ideas.find(
            function (registro) {

                return registro.id ===
                    ideaSeleccionadaGerente.id;
            }
        );

    if (idea) {

        idea.estado =
            "Convertida en oportunidad";

        idea.oportunidadId =
            nuevaOportunidad.id;

        idea.fechaConversion =
            new Date().toISOString();

        localStorage.setItem(
            "octoflowIdeas",
            JSON.stringify(ideas)
        );
    }

    cerrarRevisionIdea();

    actualizarRevisionIdeas();

    mostrarNotificacion(
        "La oportunidad fue publicada correctamente."
    );
}


/*
==================================================
FILTROS
==================================================
*/

function configurarFiltrosRevisionIdeas() {

    document
        .getElementById(
            "buscarIdeaGerente"
        )
        ?.addEventListener(
            "input",
            mostrarRevisionIdeas
        );

    document
        .getElementById(
            "filtroEstadoIdeaGerente"
        )
        ?.addEventListener(
            "change",
            mostrarRevisionIdeas
        );

    document
        .getElementById(
            "filtroAreaIdeaGerente"
        )
        ?.addEventListener(
            "change",
            mostrarRevisionIdeas
        );

    document
        .getElementById(
            "limpiarFiltrosIdeasGerente"
        )
        ?.addEventListener(
            "click",
            function () {

                const buscar =
                    document.getElementById(
                        "buscarIdeaGerente"
                    );

                const estado =
                    document.getElementById(
                        "filtroEstadoIdeaGerente"
                    );

                const area =
                    document.getElementById(
                        "filtroAreaIdeaGerente"
                    );

                if (buscar) {
                    buscar.value = "";
                }

                if (estado) {
                    estado.value = "";
                }

                if (area) {
                    area.value = "";
                }

                mostrarRevisionIdeas();
            }
        );
}


function cargarAreasRevisionIdeas() {

    const selector =
        document.getElementById(
            "filtroAreaIdeaGerente"
        );

    if (!selector) {

        return;
    }

    const valorActual =
        selector.value;

    selector.innerHTML = `
        <option value="">
            Todas las áreas
        </option>
    `;

    const areas =
        [
            ...new Set(
                obtenerIdeasRevision()
                    .map(
                        function (idea) {

                            return idea.area;
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

function obtenerClaseEstadoRevision(
    estado
) {

    const valor =
        normalizarRevision(estado);

    if (
        valor === "aprobada" ||
        valor ===
            "convertida en oportunidad"
    ) {

        return "estado-aprobado";
    }

    if (
        valor ===
        "informacion requerida"
    ) {

        return "estado-informacion";
    }

    if (
        valor ===
        "respuesta recibida"
    ) {

        return "estado-respuesta";
    }

    return "estado-revision";
}


function generarIdOportunidad() {

    const oportunidades =
        obtenerOportunidadesRevision();

    let mayor = 1000;

    oportunidades.forEach(
        function (oportunidad) {

            const numero =
                Number(
                    String(
                        oportunidad.id || ""
                    ).replace(
                        "OP-",
                        ""
                    )
                );

            if (
                !Number.isNaN(numero) &&
                numero > mayor
            ) {

                mayor = numero;
            }
        }
    );

    return "OP-" + (mayor + 1);
}


function obtenerFechaRevision(idea) {

    const fecha =
        new Date(
            idea.fechaISO || 0
        );

    return Number.isNaN(
        fecha.getTime()
    )
        ? new Date(0)
        : fecha;
}


function formatearFechaRevision(fecha) {

    if (!fecha) {

        return "Sin fecha límite";
    }

    const partes =
        String(fecha).split("-");

    if (partes.length === 3) {

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }

    return fecha;
}


function convertirCorreoRevision(correo) {

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


function abrirPanelRevision(id) {

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


function cerrarPanelRevision(id) {

    const panel =
        document.getElementById(id);

    panel?.classList.remove(
        "visible"
    );

    panel?.setAttribute(
        "aria-hidden",
        "true"
    );
}


function mostrarMensajePreguntas(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajeSolicitudInformacion"
        );

    if (!mensaje) {

        return;
    }

    mensaje.className =
        "mensaje-formulario " + tipo;

    mensaje.textContent =
        texto;

    if (tipo === "exito") {

        setTimeout(
            function () {

                mensaje.className =
                    "mensaje-formulario";

                mensaje.textContent =
                    "";

            },
            2500
        );
    }
}


function asignarTextoRevision(
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


function normalizarRevision(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escaparRevision(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function escaparAtributoRevision(texto) {

    return String(texto || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}