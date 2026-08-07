/*
==================================================
OCTOFLOW - MIS IDEAS
==================================================
*/

let ideaSeleccionadaEmpleado = null;


document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloIdeas
);


/*
==================================================
INICIAR
==================================================
*/

function iniciarModuloIdeas() {

    configurarFormularioIdeas();

    configurarFiltrosIdeas();

    configurarPanelIdeaEmpleado();

    actualizarModuloIdeas();
}


/*
==================================================
ACTUALIZAR PÁGINA
==================================================
*/

function actualizarModuloIdeas() {

    actualizarResumenIdeasEmpleado();

    mostrarAvisoPreguntasPendientes();

    mostrarIdeasEmpleado();
}


/*
==================================================
DATOS DE SESIÓN
==================================================
*/

function obtenerCorreoIdeas() {

    /*
    La sesión pertenece a cada pestaña.
    */

    return sessionStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


/*
==================================================
DATOS COMPARTIDOS DE IDEAS
==================================================
*/

function obtenerTodasLasIdeas() {

    /*
    Las ideas permanecen en localStorage para que
    colaborador y gerente vean la misma información
    dentro de esta computadora.
    */

    const datos =
        localStorage.getItem(
            "octoflowIdeas"
        );

    if (!datos) {

        return [];
    }

    try {

        const ideas =
            JSON.parse(datos);

        return Array.isArray(ideas)
            ? ideas
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer las ideas.",
            error
        );

        return [];
    }
}


function guardarTodasLasIdeas(ideas) {

    localStorage.setItem(
        "octoflowIdeas",
        JSON.stringify(ideas)
    );
}


function obtenerIdeasEmpleado() {

    const correo =
        normalizarIdea(
            obtenerCorreoIdeas()
        );

    return obtenerTodasLasIdeas()
        .filter(
            function (idea) {

                return normalizarIdea(
                    idea.correo
                ) === correo;
            }
        );
}


/*
==================================================
FORMULARIO
==================================================
*/

function configurarFormularioIdeas() {

    const formulario =
        document.getElementById(
            "formularioIdea"
        );

    const botonNueva =
        document.getElementById(
            "botonNuevaIdea"
        );

    const botonCerrar =
        document.getElementById(
            "cerrarFormularioIdea"
        );

    const botonCancelar =
        document.getElementById(
            "cancelarNuevaIdea"
        );

    botonNueva?.addEventListener(
        "click",
        mostrarFormularioIdea
    );

    botonCerrar?.addEventListener(
        "click",
        ocultarFormularioIdea
    );

    botonCancelar?.addEventListener(
        "click",
        ocultarFormularioIdea
    );

    formulario?.addEventListener(
        "submit",
        guardarNuevaIdea
    );
}


function mostrarFormularioIdea() {

    const seccion =
        document.getElementById(
            "seccionFormularioIdea"
        );

    seccion?.classList.remove(
        "oculto"
    );

    seccion?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(
        function () {

            document
                .getElementById(
                    "tituloIdea"
                )
                ?.focus();

        },
        350
    );
}


function ocultarFormularioIdea() {

    const seccion =
        document.getElementById(
            "seccionFormularioIdea"
        );

    const formulario =
        document.getElementById(
            "formularioIdea"
        );

    seccion?.classList.add(
        "oculto"
    );

    formulario?.reset();

    limpiarMensajeFormularioIdea();
}


/*
==================================================
GUARDAR NUEVA IDEA
==================================================
*/

function guardarNuevaIdea(evento) {

    evento.preventDefault();

    const correo =
        obtenerCorreoIdeas();

    if (!correo) {

        mostrarMensajeFormularioIdea(
            "No se encontró una sesión activa. Cierra esta pestaña e inicia sesión nuevamente.",
            "error"
        );

        return;
    }

    const titulo =
        obtenerValorIdea(
            "tituloIdea"
        );

    const area =
        obtenerValorIdea(
            "areaIdea"
        );

    const frecuencia =
        obtenerValorIdea(
            "frecuenciaIdea"
        );

    const horas =
        Number(
            obtenerValorIdea(
                "horasIdea"
            )
        );

    const implementacion =
        obtenerValorIdea(
            "implementacionIdea"
        );

    const descripcion =
        obtenerValorIdea(
            "descripcionIdea"
        );

    const problema =
        obtenerValorIdea(
            "problemaIdea"
        );

    const solucion =
        obtenerValorIdea(
            "solucionIdea"
        );

    if (
        !titulo ||
        !area ||
        !frecuencia ||
        !horas ||
        horas <= 0 ||
        !descripcion ||
        !problema ||
        !solucion
    ) {

        mostrarMensajeFormularioIdea(
            "Completa todos los campos obligatorios.",
            "error"
        );

        return;
    }

    const ideas =
        obtenerTodasLasIdeas();

    const ahora =
        new Date();

    const nuevaIdea = {

        id:
            generarIdIdea(
                ideas
            ),

        correo:
            correo,

        nombreColaborador:
            sessionStorage.getItem(
                "octoflowNombreCompleto"
            ) || "",

        titulo:
            titulo,

        area:
            area,

        frecuencia:
            frecuencia,

        horas:
            horas,

        implementacion:
            implementacion,

        descripcion:
            descripcion,

        problema:
            problema,

        solucion:
            solucion,

        estado:
            "En revisión",

        fecha:
            ahora.toLocaleDateString(
                "es-MX",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            ),

        fechaISO:
            ahora.toISOString(),

        comentarioGerente:
            "",

        preguntasGerente:
            "",

        fechaLimiteRespuesta:
            "",

        respuestaEmpleado:
            "",

        fechaRespuestaEmpleado:
            ""

    };

    ideas.push(
        nuevaIdea
    );

    guardarTodasLasIdeas(
        ideas
    );

    mostrarMensajeFormularioIdea(
        "La idea fue registrada correctamente.",
        "exito"
    );

    setTimeout(
        function () {

            ocultarFormularioIdea();

            actualizarModuloIdeas();

            mostrarNotificacion(
                "Idea registrada con el ticket " +
                nuevaIdea.id +
                "."
            );
                    },
        700
    );
}


/*
==================================================
RESUMEN
==================================================
*/

function actualizarResumenIdeasEmpleado() {

    const ideas =
        obtenerIdeasEmpleado();

    const revision =
        ideas.filter(
            function (idea) {

                return normalizarIdea(
                    idea.estado
                ) === "en revision";
            }
        ).length;

    const pendientesRespuesta =
        ideas.filter(
            function (idea) {

                return (
                    normalizarIdea(
                        idea.estado
                    ) ===
                        "informacion requerida"
                    &&
                    !String(
                        idea.respuestaEmpleado || ""
                    ).trim()
                );
            }
        ).length;

    const aprobadas =
        ideas.filter(
            function (idea) {

                const estado =
                    normalizarIdea(
                        idea.estado
                    );

                return (
                    estado === "aprobada" ||
                    estado ===
                        "convertida en oportunidad"
                );
            }
        ).length;

    asignarTextoIdeaMultiple(
        [
            "totalIdeasEmpleado",
            "totalIdeasColaborador",
            "totalIdeascolaborador"
        ],
        ideas.length
    );

    asignarTextoIdeaMultiple(
        [
            "ideasRevisionEmpleado",
            "ideasRevisionColaborador"
        ],
        revision
    );

    asignarTextoIdea(
        "ideasRespuestaPendiente",
        pendientesRespuesta
    );

    asignarTextoIdeaMultiple(
        [
            "ideasAprobadasEmpleado",
            "ideasAprobadasColaborador"
        ],
        aprobadas
    );
}


/*
==================================================
AVISO DE PREGUNTAS
==================================================
*/

function mostrarAvisoPreguntasPendientes() {

    const aviso =
        document.getElementById(
            "avisoPreguntasPendientes"
        );

    const boton =
        document.getElementById(
            "botonVerPreguntasPendientes"
        );

    const texto =
        document.getElementById(
            "textoAvisoPreguntas"
        );

    const pendientes =
        obtenerIdeasEmpleado()
            .filter(
                function (idea) {

                    return (
                        normalizarIdea(
                            idea.estado
                        ) ===
                            "informacion requerida"
                        &&
                        !String(
                            idea.respuestaEmpleado || ""
                        ).trim()
                    );
                }
            );

    aviso?.classList.toggle(
        "oculto",
        pendientes.length === 0
    );

    if (texto) {

        texto.textContent =
            pendientes.length === 1
                ? "Un gerente necesita información adicional sobre una de tus propuestas."
                : pendientes.length +
                  " propuestas requieren información adicional.";
    }

    if (boton) {

        boton.onclick =
            pendientes.length > 0
                ? function () {

                    abrirDetalleIdeaEmpleado(
                        pendientes[0].id
                    );
                }
                : null;
    }
}


/*
==================================================
MOSTRAR TABLA
==================================================
*/

function mostrarIdeasEmpleado() {

    const tabla =
        document.getElementById(
            "tablaIdeasEmpleado"
        ) ||
        document.getElementById(
            "tablaIdeasColaborador"
        );

    if (!tabla) {

        return;
    }

    const busqueda =
        normalizarIdea(
            obtenerValorPrimerElementoIdea(
                [
                    "buscarIdeaEmpleado",
                    "buscarIdeaColaborador"
                ]
            )
        );

    const filtroEstado =
        normalizarIdea(
            obtenerValorPrimerElementoIdea(
                [
                    "filtroEstadoIdeaEmpleado",
                    "filtroEstadoIdeaColaborador"
                ]
            )
        );

    const ideas =
        obtenerIdeasEmpleado()
            .filter(
                function (idea) {

                    const texto =
                        normalizarIdea(
                            [
                                idea.id,
                                idea.titulo,
                                idea.area
                            ].join(" ")
                        );

                    const coincideBusqueda =
                        busqueda === "" ||
                        texto.includes(
                            busqueda
                        );

                    const coincideEstado =
                        filtroEstado === "" ||
                        normalizarIdea(
                            idea.estado
                        ) === filtroEstado;

                    return (
                        coincideBusqueda &&
                        coincideEstado
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        obtenerFechaIdea(b) -
                        obtenerFechaIdea(a)
                    );
                }
            );

    asignarTextoIdeaMultiple(
        [
            "contadorIdeasEmpleado",
            "contadorIdeasColaborador"
        ],
        ideas.length === 1
            ? "1 idea"
            : ideas.length + " ideas"
    );

    if (ideas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="6"
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

                    const requiereRespuesta =
                        normalizarIdea(
                            idea.estado
                        ) ===
                            "informacion requerida"
                        &&
                        !String(
                            idea.respuestaEmpleado || ""
                        ).trim();

                    return `
                        <tr
                            class="${
                                requiereRespuesta
                                    ? "fila-requiere-respuesta"
                                    : ""
                            }"
                        >

                            <td>
                                <strong>
                                    ${escaparIdea(
                                        idea.id
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escaparIdea(
                                    idea.titulo
                                )}
                            </td>

                            <td>
                                ${escaparIdea(
                                    idea.area
                                )}
                            </td>

                            <td>
                                ${escaparIdea(
                                    idea.fecha ||
                                    "Sin fecha"
                                )}
                            </td>

                            <td>

                                <span
                                    class="
                                        estado
                                        ${obtenerClaseEstadoIdeaEmpleado(
                                            idea.estado
                                        )}
                                    "
                                >
                                    ${escaparIdea(
                                        idea.estado ||
                                        "En revisión"
                                    )}
                                </span>

                            </td>

                            <td>

                                <button
                                    class="
                                        boton-tabla
                                        ${
                                            requiereRespuesta
                                                ? "boton-responder-idea"
                                                : ""
                                        }
                                    "
                                    type="button"
                                    onclick="abrirDetalleIdeaEmpleado(
                                        '${escaparAtributoIdea(
                                            idea.id
                                        )}'
                                    )"
                                >
                                    ${
                                        requiereRespuesta
                                            ? "Responder"
                                            : "Ver detalle"
                                    }
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

function configurarPanelIdeaEmpleado() {

    const panel =
        document.getElementById(
            "panelDetalleIdeaColaborador"
        );

    document
        .querySelectorAll(
            "#cerrarDetalleIdeaColaborador"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    cerrarDetalleIdeaEmpleado
                );
            }
        );

    document
        .getElementById(
            "enviarRespuestaColaborador"
        )
        ?.addEventListener(
            "click",
            enviarRespuestaEmpleadoIdea
        );

    panel?.addEventListener(
        "click",
        function (evento) {

            if (evento.target === panel) {

                cerrarDetalleIdeaEmpleado();
            }
        }
    );

    document.addEventListener(
                "keydown",
        function (evento) {

            if (evento.key === "Escape") {

                cerrarDetalleIdeaEmpleado();
            }
        }
    );
}


function abrirDetalleIdeaEmpleado(id) {

    ideaSeleccionadaEmpleado =
        obtenerIdeasEmpleado()
            .find(
                function (idea) {

                    return idea.id === id;
                }
            );

    if (!ideaSeleccionadaEmpleado) {

        mostrarNotificacion(
            "No fue posible encontrar la idea."
        );

        return;
    }

    const idea =
        ideaSeleccionadaEmpleado;

    asignarTextoIdea(
        "detalleTicketIdeaColaborador",
        idea.id
    );

    asignarTextoIdea(
        "detalleTituloIdeaColaborador",
        idea.titulo
    );

    asignarTextoIdea(
        "detalleEstadoIdeaColaborador",
        idea.estado || "En revisión"
    );

    asignarTextoIdea(
        "detalleAreaIdeaColaborador",
        idea.area || "Sin área"
    );

    asignarTextoIdea(
        "detalleFechaIdeaColaborador",
        idea.fecha || "Sin fecha"
    );

    asignarTextoIdea(
        "detalleFrecuenciaIdeaColaborador",
        idea.frecuencia ||
        "No especificada"
    );

    asignarTextoIdea(
        "detalleHorasIdeaColaborador",
        idea.horas
            ? idea.horas + " horas"
            : "No especificadas"
    );

    asignarTextoIdea(
        "detalleImplementacionIdeaColaborador",
        idea.implementacion ||
        "No especificada"
    );

    asignarTextoIdea(
        "detalleDescripcionIdeaColaborador",
        idea.descripcion ||
        "Sin descripción"
    );

    asignarTextoIdea(
        "detalleProblemaIdeaColaborador",
        idea.problema ||
        "Sin información"
    );

    asignarTextoIdea(
        "detalleSolucionIdeaColaborador",
        idea.solucion ||
        "Sin solución sugerida"
    );

    mostrarPreguntasYRespuestaEmpleado(
        idea
    );

    mostrarComentarioGerenteEmpleado(
        idea
    );

    abrirPanelIdea(
        "panelDetalleIdeaColaborador"
    );
}


function cerrarDetalleIdeaEmpleado() {

    cerrarPanelIdea(
        "panelDetalleIdeaColaborador"
    );

    ideaSeleccionadaEmpleado =
        null;

    document.body.classList.remove(
        "modal-abierto"
    );
}


/*
==================================================
PREGUNTAS Y RESPUESTA
==================================================
*/

function mostrarPreguntasYRespuestaEmpleado(
    idea
) {

    const preguntas =
        String(
            idea.preguntasGerente || ""
        ).trim();

    const respuesta =
        String(
            idea.respuestaEmpleado || ""
        ).trim();

    const seccionPreguntas =
        document.getElementById(
            "seccionPreguntasColaborador"
        );

    const seccionRespuesta =
        document.getElementById(
            "seccionRespuestaEnviada"
        );

    const campoRespuesta =
        document.getElementById(
            "respuestaColaboradorIdea"
        );

    seccionPreguntas?.classList.toggle(
        "oculto",
        preguntas === "" ||
        respuesta !== ""
    );

    seccionRespuesta?.classList.toggle(
        "oculto",
        respuesta === ""
    );

    asignarTextoIdea(
        "preguntasGerenteColaborador",
        preguntas || "—"
    );

    asignarTextoIdea(
        "fechaLimiteColaborador",
        idea.fechaLimiteRespuesta
            ? "Responder antes del " +
              formatearFechaIdea(
                  idea.fechaLimiteRespuesta
              )
            : "Sin fecha límite"
    );

    if (campoRespuesta) {

        campoRespuesta.value =
            respuesta;
    }

    asignarTextoIdea(
        "respuestaEnviadaColaborador",
        respuesta || "—"
    );

    asignarTextoIdea(
        "fechaRespuestaColaborador",
        idea.fechaRespuestaEmpleado
            ? "Enviada el " +
              formatearFechaHoraIdea(
                  idea.fechaRespuestaEmpleado
              )
            : ""
    );

    const contenedorComentario =
        document.getElementById(
            "comentarioGerenteColaboradorContenedor"
        );

    const comentario =
        String(
            idea.comentarioGerente || ""
        ).trim();

    contenedorComentario?.classList.toggle(
        "oculto",
        comentario === ""
    );

    asignarTextoIdea(
        "comentarioGerenteColaborador",
        comentario || "—"
    );
}


function enviarRespuestaEmpleadoIdea() {

    if (!ideaSeleccionadaEmpleado) {

        return;
    }

    const respuesta =
        document
            .getElementById(
                "respuestaColaboradorIdea"
            )
            ?.value
            .trim() || "";

    if (respuesta === "") {

        mostrarMensajeRespuestaEmpleado(
            "Escribe una respuesta antes de enviarla.",
            "error"
        );

        return;
    }

    const ideas =
        obtenerTodasLasIdeas();

    const idea =
        ideas.find(
            function (registro) {

                return registro.id ===
                    ideaSeleccionadaEmpleado.id;
            }
        );

    if (!idea) {

        mostrarMensajeRespuestaEmpleado(
            "No fue posible encontrar la idea.",
            "error"
        );

        return;
    }

    idea.respuestaEmpleado =
        respuesta;

    idea.fechaRespuestaEmpleado =
        new Date().toISOString();

    idea.estado =
        "Respuesta recibida";

    guardarTodasLasIdeas(
        ideas
    );

    ideaSeleccionadaEmpleado =
        idea;

    mostrarMensajeRespuestaEmpleado(
        "Tu respuesta fue enviada al gerente.",
        "exito"
    );

    setTimeout(
        function () {

            asignarTextoIdea(
                "detalleEstadoIdeaColaborador",
                "Respuesta recibida"
            );

            mostrarPreguntasYRespuestaEmpleado(
                idea
            );

            actualizarModuloIdeas();

            mostrarNotificacion(
                "El gerente recibió tu respuesta."
            );

        },
        700
    );
}


/*
==================================================
COMENTARIOS DEL GERENTE
==================================================
*/

function mostrarComentarioGerenteEmpleado(
    idea
) {

    const seccion =
        document.getElementById(
            "seccionComentarioGerenteColaborador"
        );

    const comentario =
        String(
            idea.comentarioGerente || ""
        ).trim();

    const estado =
        normalizarIdea(
            idea.estado
        );

    const mostrar =
        comentario !== "" &&
        estado !== "informacion requerida";

    seccion?.classList.toggle(
        "oculto",
        !mostrar
    );

    asignarTextoIdea(
        "comentarioFinalGerenteColaborador",
        comentario || "—"
    );
}


/*
==================================================
FILTROS
==================================================
*/

function configurarFiltrosIdeas() {

    [
        "buscarIdeaEmpleado",
        "buscarIdeaColaborador"
    ].forEach(
        function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "input",
                    mostrarIdeasEmpleado
                );
        }
    );

    [
        "filtroEstadoIdeaEmpleado",
        "filtroEstadoIdeaColaborador"
    ].forEach(
        function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "change",
                    mostrarIdeasEmpleado
                );
        }
    );

    [
        "limpiarFiltrosIdeasEmpleado",
        "limpiarFiltrosIdeasColaborador"
    ].forEach(
        function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "click",
                    limpiarFiltrosIdeas
                );
        }
    );
}


function limpiarFiltrosIdeas() {

    [
        "buscarIdeaEmpleado",
        "buscarIdeaColaborador"
    ].forEach(
        function (id) {

            const elemento =
                document.getElementById(id);

            if (elemento) {
                                elemento.value = "";
            }
        }
    );

    [
        "filtroEstadoIdeaEmpleado",
        "filtroEstadoIdeaColaborador"
    ].forEach(
        function (id) {

            const elemento =
                document.getElementById(id);

            if (elemento) {

                elemento.value = "";
            }
        }
    );

    mostrarIdeasEmpleado();
}


/*
==================================================
UTILIDADES
==================================================
*/

function generarIdIdea(ideas) {

    let mayor = 1000;

    ideas.forEach(
        function (idea) {

            const numero =
                Number(
                    String(
                        idea.id || ""
                    )
                        .replace(
                            "QW-",
                            ""
                        )
                        .replace(
                            "ID-",
                            ""
                        )
                );

            if (
                !Number.isNaN(numero) &&
                numero > mayor
            ) {

                mayor =
                    numero;
            }
        }
    );

    return "QW-" +
        (mayor + 1);
}


function obtenerClaseEstadoIdeaEmpleado(
    estado
) {

    const valor =
        normalizarIdea(
            estado
        );

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


function obtenerFechaIdea(idea) {

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


function formatearFechaIdea(fecha) {

    if (!fecha) {

        return "Sin fecha";
    }

    const partes =
        String(fecha)
            .split("-");

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


function formatearFechaHoraIdea(fecha) {

    const valor =
        new Date(fecha);

    if (
        Number.isNaN(
            valor.getTime()
        )
    ) {

        return "Sin fecha";
    }

    return valor.toLocaleString(
        "es-MX",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function abrirPanelIdea(id) {

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


function cerrarPanelIdea(id) {

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


function mostrarMensajeFormularioIdea(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajeFormularioIdea"
        );

    if (!mensaje) {

        return;
    }

    mensaje.className =
        "mensaje-formulario " +
        tipo;

    mensaje.textContent =
        texto;
}


function limpiarMensajeFormularioIdea() {

    const mensaje =
        document.getElementById(
            "mensajeFormularioIdea"
        );

    if (!mensaje) {

        return;
    }

    mensaje.className =
        "mensaje-formulario";

    mensaje.textContent =
        "";
}


function mostrarMensajeRespuestaEmpleado(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajeRespuestaColaborador"
        );

    if (!mensaje) {

        return;
    }

    mensaje.className =
        "mensaje-formulario " +
        tipo;

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


function obtenerValorIdea(id) {

    const elemento =
        document.getElementById(id);

    return elemento
        ? String(
            elemento.value || ""
        ).trim()
        : "";
}


function obtenerValorPrimerElementoIdea(
    ids
) {

    for (
        let indice = 0;
        indice < ids.length;
        indice += 1
    ) {

        const elemento =
            document.getElementById(
                ids[indice]
            );

        if (elemento) {

            return String(
                elemento.value || ""
            ).trim();
        }
    }

    return "";
}


function asignarTextoIdea(
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


function asignarTextoIdeaMultiple(
    ids,
    texto
) {

    ids.forEach(
        function (id) {

            asignarTextoIdea(
                id,
                texto
            );
        }
    );
}


function normalizarIdea(texto) {

    return String(
        texto || ""
    )
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escaparIdea(texto) {

    const elemento =
        document.createElement(
            "div"
        );

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function escaparAtributoIdea(texto) {

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
        );
}
