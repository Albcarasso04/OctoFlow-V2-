/*
==================================================
OCTOFLOW - PROYECTOS DEL GERENTE
==================================================
*/

let oportunidadProyectoSeleccionada = null;
let proyectoGerenteSeleccionado = null;

document.addEventListener(
    "DOMContentLoaded",
    iniciarProyectosGerente
);


/*
==================================================
INICIO
==================================================
*/

function iniciarProyectosGerente() {

    configurarPestanasProyecto();

    configurarPanelesProyecto();

    actualizarModuloProyectos();
}


/*
==================================================
ALMACENAMIENTO
==================================================
*/

function leerColeccionProyecto(clave) {

    try {

        const datos =
            JSON.parse(
                localStorage.getItem(clave) ||
                "[]"
            );

        return Array.isArray(datos)
            ? datos
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer " + clave,
            error
        );

        return [];
    }
}


function guardarColeccionProyecto(
    clave,
    datos
) {

    localStorage.setItem(
        clave,
        JSON.stringify(datos)
    );
}


function obtenerProyectosGerente() {

    return leerColeccionProyecto(
        "octoflowProyectos"
    );
}


function obtenerOportunidadesProyecto() {

    return leerColeccionProyecto(
        "octoflowOportunidades"
    );
}


function obtenerPostulacionesProyecto() {

    return leerColeccionProyecto(
        "octoflowPostulaciones"
    );
}


/*
==================================================
SESIÓN
==================================================
*/

function obtenerCorreoGerente() {

    return sessionStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


function obtenerNombreGerente() {

    return (
        sessionStorage.getItem(
            "octoflowNombreCompleto"
        ) ||
        convertirCorreoEnNombre(
            obtenerCorreoGerente()
        )
    );
}


/*
==================================================
ACTUALIZAR MÓDULO
==================================================
*/

function actualizarModuloProyectos() {

    actualizarIndicadoresProyecto();

    mostrarEquiposPendientesProyecto();

    mostrarProyectosActivosGerente();

    mostrarHistorialProyectosGerente();
}


/*
==================================================
OPORTUNIDADES Y POSTULACIONES
==================================================
*/

function obtenerIdOportunidadPostulacion(
    postulacion
) {

    return (
        postulacion.oportunidadId ||
        postulacion.idOportunidad ||
        postulacion.proyectoId ||
        ""
    );
}


function obtenerCandidatosAceptados(
    oportunidadId
) {

    return obtenerPostulacionesProyecto()
        .filter(
            function (postulacion) {

                return (
                    String(
                        obtenerIdOportunidadPostulacion(
                            postulacion
                        )
                    ) === String(
                        oportunidadId
                    )
                    &&
                    normalizarProyecto(
                        postulacion.estado
                    ) === "aceptado"
                );
            }
        );
}


function existeProyectoParaOportunidad(
    oportunidadId
) {

    return obtenerProyectosGerente()
        .some(
            function (proyecto) {

                return (
                    String(
                        proyecto.oportunidadId
                    ) === String(
                        oportunidadId
                    )
                );
            }
        );
}


function obtenerOportunidadesPendientes() {

    return obtenerOportunidadesProyecto()
        .filter(
            function (oportunidad) {

                return (
                    obtenerCandidatosAceptados(
                        oportunidad.id
                    ).length > 0
                    &&
                    !existeProyectoParaOportunidad(
                        oportunidad.id
                    )
                );
            }
        );
}


/*
==================================================
EQUIPOS PENDIENTES
==================================================
*/

function mostrarEquiposPendientesProyecto() {

    const contenedor =
        document.getElementById(
            "listaPendientesProyecto"
        );

    if (!contenedor) {
        return;
    }

    const oportunidades =
        obtenerOportunidadesPendientes();

    if (oportunidades.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay equipos pendientes de confirmación.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        oportunidades
            .map(
                function (oportunidad) {

                    const candidatos =
                        obtenerCandidatosAceptados(
                            oportunidad.id
                        );

                    const champion =
                        candidatos.find(
                            function (candidato) {

                                return normalizarProyecto(
                                    candidato.rolAsignado ||
                                    candidato.rolSolicitado ||
                                    candidato.rol
                                ) === "champion";
                            }
                        );

                    const learner =
                        candidatos.find(
                            function (candidato) {

                                return normalizarProyecto(
                                    candidato.rolAsignado ||
                                    candidato.rolSolicitado ||
                                    candidato.rol
                                ) === "learner";
                            }
                        );

                    return `
                        <article class="tarjeta-proyecto-gerente">

                            <div class="cabecera-proyecto-gerente">

                                <div>

                                    <span class="codigo-proyecto">
                                        ${escaparProyecto(
                                            oportunidad.id
                                        )}
                                    </span>

                                    <h3>
                                        ${escaparProyecto(
                                            oportunidad.titulo ||
                                            oportunidad.nombre ||
                                            "Oportunidad"
                                        )}
                                    </h3>

                                </div>

                                <span class="estado">
                                    Equipo pendiente
                                </span>

                            </div>

                            <div class="etiquetas-proyecto">

                                <span>
                                    ${escaparProyecto(
                                        oportunidad.area ||
                                        "Sin área"
                                    )}
                                </span>

                                <span>
                                    ${candidatos.length}
                                    candidatos
                                </span>

                            </div>

                            <div class="resumen-equipo">

                                <article>

                                    <span>
                                        Champion
                                    </span>

                                    <strong>
                                        ${
                                            champion
                                                ? escaparProyecto(
                                                    obtenerNombreCandidato(
                                                        champion
                                                    )
                                                )
                                                : "Vacante"
                                        }
                                    </strong>

                                </article>

                                <article>

                                    <span>
                                        Learner
                                    </span>

                                    <strong>
                                        ${
                                            learner
                                                ? escaparProyecto(
                                                    obtenerNombreCandidato(
                                                        learner
                                                    )
                                                )
                                                : "Opcional"
                                        }
                                    </strong>

                                </article>

                                <article>

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ${candidatos.length}
                                    </strong>

                                </article>

                            </div>

                            <button
                                class="boton-principal boton-ancho"
                                type="button"
                                onclick="
                                    event.stopPropagation();
                                    abrirConfirmarProyecto(
                                        '${escaparAtributoProyecto(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Confirmar equipo
                            </button>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
PROYECTOS ACTIVOS E HISTORIAL
==================================================
*/

function mostrarProyectosActivosGerente() {

    const contenedor =
        document.getElementById(
            "listaActivosProyecto"
        );

    if (!contenedor) {
        return;
    }

    const proyectos =
        obtenerProyectosGerente()
            .filter(
                function (proyecto) {

                    const estado =
                        normalizarProyecto(
                            proyecto.estado
                        );

                    return (
                        estado !== "completado" &&
                        estado !== "cancelado"
                    );
                }
            );

    mostrarTarjetasProyecto(
        contenedor,
        proyectos,
        true
    );
}


function mostrarHistorialProyectosGerente() {

    const contenedor =
        document.getElementById(
            "listaHistorialProyecto"
        );

    if (!contenedor) {
        return;
    }

    const proyectos =
        obtenerProyectosGerente()
            .filter(
                function (proyecto) {

                    const estado =
                        normalizarProyecto(
                            proyecto.estado
                        );

                    return (
                        estado === "completado" ||
                        estado === "cancelado"
                    );
                }
            );

    mostrarTarjetasProyecto(
        contenedor,
        proyectos,
        false
    );
}


function mostrarTarjetasProyecto(
    contenedor,
    proyectos,
    editable
) {

    if (proyectos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay proyectos en esta sección.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        proyectos
            .map(
                function (proyecto) {

                    const hitos =
                        Array.isArray(
                            proyecto.hitos
                        )
                            ? proyecto.hitos
                            : [];

                    const hitosAbiertos =
                        hitos.filter(
                            function (hito) {

                                return (
                                    obtenerEstadoVisualHito(
                                        hito
                                    ) !== "Completado"
                                );
                            }
                        ).length;

                    const verificaciones =
                        hitos.filter(
                            function (hito) {

                                return normalizarProyecto(
                                    hito.estado
                                ) ===
                                "pendiente de verificacion";
                            }
                        ).length;

                    const avance =
                        limitarAvanceProyecto(
                            proyecto.avance
                        );

                    return `
                        <article
                            class="tarjeta-proyecto-gerente"
                            onclick="abrirSeguimientoProyecto(
                                '${escaparAtributoProyecto(
                                    proyecto.id
                                )}'
                            )"
                        >

                            <div class="cabecera-proyecto-gerente">

                                <div>

                                    <span class="codigo-proyecto">
                                        ${escaparProyecto(
                                            proyecto.id
                                        )}
                                    </span>

                                    <h3>
                                        ${escaparProyecto(
                                            proyecto.titulo ||
                                            proyecto.nombre ||
                                            "Proyecto"
                                        )}
                                    </h3>

                                </div>

                                <span class="estado">
                                    ${escaparProyecto(
                                        proyecto.estado ||
                                        "Activo"
                                    )}
                                </span>

                            </div>

                            <div class="etiquetas-proyecto">

                                <span>
                                    ${escaparProyecto(
                                        proyecto.area ||
                                        "Sin área"
                                    )}
                                </span>

                                <span>
                                    ${hitosAbiertos}
                                    hitos abiertos
                                </span>

                                ${
                                    verificaciones > 0
                                        ? `
                                            <span>
                                                ${verificaciones}
                                                por verificar
                                            </span>
                                        `
                                        : ""
                                }

                            </div>

                            <div class="fila-avance">

                                <span>
                                    Desarrollo
                                </span>

                                <strong>
                                    ${avance}%
                                </strong>

                            </div>

                            <div class="barra-avance-proyecto">

                                <span
                                    style="width: ${avance}%"
                                ></span>

                            </div>

                            <button
                                class="boton-principal boton-ancho"
                                type="button"
                                onclick="
                                    event.stopPropagation();
                                    abrirSeguimientoProyecto(
                                        '${escaparAtributoProyecto(
                                            proyecto.id
                                        )}'
                                    );
                                "
                            >
                                ${
                                    editable
                                        ? "Ver y administrar"
                                        : "Ver historial"
                                }
                            </button>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
ABRIR CONFIRMACIÓN
==================================================
*/

function abrirConfirmarProyecto(
    oportunidadId
) {

    oportunidadProyectoSeleccionada =
        obtenerOportunidadesProyecto()
            .find(
                function (oportunidad) {

                    return (
                        String(
                            oportunidad.id
                        ) === String(
                            oportunidadId
                        )
                    );
                }
            ) || null;

    if (!oportunidadProyectoSeleccionada) {

        mostrarNotificacion(
            "No fue posible encontrar la oportunidad."
        );

        return;
    }

    asignarTextoProyecto(
        "tituloPanelConfirmarProyecto",
        oportunidadProyectoSeleccionada.titulo ||
        oportunidadProyectoSeleccionada.nombre ||
        "Proyecto"
    );

    mostrarCandidatosProyecto(
        oportunidadId
    );

    const hoy =
        new Date();

    const objetivo =
        new Date();

    objetivo.setMonth(
        objetivo.getMonth() + 2
    );

    asignarValorProyecto(
        "fechaInicioProyecto",
        hoy.toISOString().split("T")[0]
    );

    asignarValorProyecto(
        "fechaObjetivoProyecto",
        objetivo.toISOString().split("T")[0]
    );

    asignarValorProyecto(
        "objetivoProyecto",
        oportunidadProyectoSeleccionada
            .descripcion || ""
    );

    asignarValorProyecto(
        "entregableProyecto",
        ""
    );

    limpiarMensajeProyecto(
        "mensajeConfirmarProyecto"
    );

    abrirPanelProyecto(
        "panelConfirmarProyecto"
    );
}


function mostrarCandidatosProyecto(
    oportunidadId
) {

    const contenedor =
        document.getElementById(
            "listaCandidatosProyecto"
        );

    if (!contenedor) {
        return;
    }

    const candidatos =
        obtenerCandidatosAceptados(
            oportunidadId
        );

    if (candidatos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay candidatos aceptados.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        candidatos
            .map(
                function (candidato) {

                    const id =
                        candidato.id ||
                        candidato.postulacionId ||
                        generarIdentificadorUnico();

                    const rol =
                        candidato.rolAsignado ||
                        candidato.rolSolicitado ||
                        candidato.rol ||
                        "Contributor";

                    return `
                        <article class="candidato-proyecto">

                            <input
                                class="seleccionar-candidato-proyecto"
                                type="checkbox"
                                checked
                                data-id="${escaparProyecto(
                                    id
                                )}"
                            >

                            <div class="datos-candidato">

                                <strong>
                                    ${escaparProyecto(
                                        obtenerNombreCandidato(
                                            candidato
                                        )
                                    )}
                                </strong>

                                <span>
                                    ${escaparProyecto(
                                        candidato.correo ||
                                        candidato.email ||
                                        ""
                                    )}
                                </span>

                            </div>

                            <select
                                class="rol-candidato-proyecto"
                                data-id="${escaparProyecto(
                                    id
                                )}"
                            >

                                <option
                                    value="Champion"
                                    ${
                                        normalizarProyecto(
                                            rol
                                        ) === "champion"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Champion
                                </option>

                                <option
                                    value="Learner"
                                    ${
                                        normalizarProyecto(
                                            rol
                                        ) === "learner"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Learner
                                </option>

                                <option
                                    value="Contributor"
                                    ${
                                        normalizarProyecto(
                                            rol
                                        ) === "contributor"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Contributor
                                </option>

                            </select>

                        </article>
                    `;
                }
            )
            .join("");
}


function obtenerParticipantesSeleccionados() {

    const postulaciones =
        obtenerPostulacionesProyecto();

    return [
        ...document.querySelectorAll(
            ".seleccionar-candidato-proyecto:checked"
        )
    ]
        .map(
            function (checkbox) {

                const id =
                    checkbox.dataset.id;

                const postulacion =
                    postulaciones.find(
                        function (registro) {

                            return (
                                String(
                                    registro.id ||
                                    registro.postulacionId
                                ) === String(id)
                            );
                        }
                    );

                if (!postulacion) {
                    return null;
                }

                const selector =
                    [
                        ...document.querySelectorAll(
                            ".rol-candidato-proyecto"
                        )
                    ]
                        .find(
                            function (elemento) {

                                return (
                                    String(
                                        elemento.dataset.id
                                    ) === String(id)
                                );
                            }
                        );

                return {

                    postulacionId:
                        id,

                    correo:
                        postulacion.correo ||
                        postulacion.email ||
                        "",

                    nombre:
                        obtenerNombreCandidato(
                            postulacion
                        ),

                    rol:
                        selector?.value ||
                        "Contributor",

                    fechaAsignacion:
                        new Date().toISOString()

                };
            }
        )
        .filter(Boolean);
}


/*
==================================================
INICIAR PROYECTO
==================================================
*/

function iniciarProyectoGerente() {

    if (!oportunidadProyectoSeleccionada) {
        return;
    }

    const participantes =
        obtenerParticipantesSeleccionados();

    const champions =
        participantes.filter(
            function (participante) {

                return participante.rol ===
                    "Champion";
            }
        );

    const learners =
        participantes.filter(
            function (participante) {

                return participante.rol ===
                    "Learner";
            }
        );

    if (participantes.length === 0) {

        mostrarMensajeProyecto(
            "mensajeConfirmarProyecto",
            "Selecciona al menos un integrante.",
            "error"
        );

        return;
    }

    if (champions.length !== 1) {

        mostrarMensajeProyecto(
            "mensajeConfirmarProyecto",
            "Selecciona exactamente un Champion.",
            "error"
        );

        return;
    }

    if (learners.length > 1) {

        mostrarMensajeProyecto(
            "mensajeConfirmarProyecto",
            "Solo puede existir un Learner.",
            "error"
        );

        return;
    }

    const fechaInicio =
        obtenerValorProyecto(
            "fechaInicioProyecto"
        );

    const fechaObjetivo =
        obtenerValorProyecto(
            "fechaObjetivoProyecto"
        );

    const objetivo =
        obtenerValorProyecto(
            "objetivoProyecto"
        );

    const entregable =
        obtenerValorProyecto(
            "entregableProyecto"
        );

    if (
        !fechaInicio ||
        !fechaObjetivo ||
        !objetivo ||
        !entregable
    ) {

        mostrarMensajeProyecto(
            "mensajeConfirmarProyecto",
            "Completa fechas, objetivo y entregable.",
            "error"
        );

        return;
    }

    if (
        new Date(
            fechaObjetivo +
            "T00:00:00"
        ) <
        new Date(
            fechaInicio +
            "T00:00:00"
        )
    ) {

        mostrarMensajeProyecto(
            "mensajeConfirmarProyecto",
            "La fecha objetivo no puede ser anterior a la fecha de inicio.",
            "error"
        );

        return;
    }

    const proyectos =
        obtenerProyectosGerente();

    const ahora =
        new Date().toISOString();

    const nuevoProyecto = {

        id:
            generarIdProyecto(
                proyectos
            ),

        oportunidadId:
            oportunidadProyectoSeleccionada.id,

        ideaId:
            oportunidadProyectoSeleccionada.ideaId ||
            "",

        titulo:
            oportunidadProyectoSeleccionada.titulo ||
            oportunidadProyectoSeleccionada.nombre ||
            "Proyecto",

        area:
            oportunidadProyectoSeleccionada.area ||
            "",

        descripcion:
            oportunidadProyectoSeleccionada.descripcion ||
            "",

        herramientas:
            oportunidadProyectoSeleccionada.herramientas ||
            [],

        objetivo:
            objetivo,

        entregablePrincipal:
            entregable,

        fechaInicio:
            fechaInicio,

        fechaObjetivo:
            fechaObjetivo,

        estado:
            "Activo",

        avance:
            0,

        participantes:
            participantes,

        hitos:
            [],

        actualizaciones: [
            {
                id:
                    generarIdentificadorUnico(),

                tipo:
                    "proyecto",

                fecha:
                    ahora,

                comentario:
                    "El proyecto fue iniciado.",

                estado:
                    "Activo",

                avance:
                    0,

                autor:
                    obtenerCorreoGerente(),

                autorNombre:
                    obtenerNombreGerente()
            }
        ],

        horasAhorradasAnuales:
            0,

        resultadoFinal:
            "",

        fechaCreacion:
            ahora,

        creadoPor:
            obtenerCorreoGerente()

    };

    proyectos.push(
        nuevoProyecto
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    const oportunidades =
        obtenerOportunidadesProyecto();

    const oportunidad =
        oportunidades.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        nuevoProyecto.oportunidadId
                    )
                );
            }
        );

    if (oportunidad) {

        oportunidad.estado =
            "En proyecto";

        oportunidad.proyectoId =
            nuevoProyecto.id;

        guardarColeccionProyecto(
            "octoflowOportunidades",
            oportunidades
        );
    }

    cerrarPanelProyecto(
        "panelConfirmarProyecto"
    );

    oportunidadProyectoSeleccionada =
        null;

    actualizarModuloProyectos();

    abrirSeguimientoProyecto(
        nuevoProyecto.id
    );

    mostrarNotificacion(
        "Proyecto iniciado correctamente."
    );
}


/*
==================================================
ABRIR SEGUIMIENTO
==================================================
*/

function abrirSeguimientoProyecto(
    proyectoId
) {

    proyectoGerenteSeleccionado =
        obtenerProyectosGerente()
            .find(
                function (proyecto) {

                    return (
                        String(
                            proyecto.id
                        ) === String(
                            proyectoId
                        )
                    );
                }
            ) || null;

    if (!proyectoGerenteSeleccionado) {

        mostrarNotificacion(
            "No fue posible encontrar el proyecto."
        );

        return;
    }

    asegurarIdsHistorial(
        proyectoGerenteSeleccionado
    );

    const proyecto =
        proyectoGerenteSeleccionado;

    const avance =
        limitarAvanceProyecto(
            proyecto.avance
        );

    asignarTextoProyecto(
        "tituloSeguimientoProyecto",
        proyecto.titulo ||
        proyecto.nombre ||
        "Proyecto"
    );

    asignarTextoProyecto(
        "codigoDesarrolloProyecto",
        proyecto.id
    );

    asignarTextoProyecto(
        "areaDesarrolloProyecto",
        proyecto.area ||
        "Sin área"
    );

    asignarTextoProyecto(
        "estadoActualDesarrolloProyecto",
        proyecto.estado ||
        "Activo"
    );

    asignarTextoProyecto(
        "avanceActualDesarrolloProyecto",
        avance + "%"
    );

    const barra =
        document.getElementById(
            "barraAvanceDesarrolloProyecto"
        );

    if (barra) {

        barra.style.width =
            avance + "%";
    }

    asignarTextoProyecto(
        "objetivoDesarrolloProyecto",
        proyecto.objetivo ||
        "No registrado"
    );

    asignarTextoProyecto(
        "entregableDesarrolloProyecto",
        proyecto.entregablePrincipal ||
        "No registrado"
    );

    asignarTextoProyecto(
        "fechaInicioDesarrolloProyecto",
        formatearFechaProyecto(
            proyecto.fechaInicio
        )
    );

    asignarTextoProyecto(
        "fechaObjetivoDesarrolloProyecto",
        formatearFechaProyecto(
            proyecto.fechaObjetivo
        )
    );

    mostrarEquipoProyecto(
        proyecto
    );

    cargarResponsablesHito(
        proyecto.participantes
    );

    mostrarHitosProyectoGerente(
        proyecto
    );

    mostrarHistorialEditable(
        proyecto
    );

    asignarValorProyecto(
        "estadoSeguimientoProyecto",
        proyecto.estado ||
        "Activo"
    );

    asignarValorProyecto(
        "avanceSeguimientoProyecto",
        avance
    );

    asignarValorProyecto(
        "comentarioSeguimientoProyecto",
        ""
    );

    asignarValorProyecto(
        "horasAhorradasProyecto",
        proyecto.horasAhorradasAnuales ||
        ""
    );

    asignarValorProyecto(
        "resultadoFinalProyecto",
        proyecto.resultadoFinal ||
        ""
    );

    limpiarFormularioHito();

    limpiarMensajeProyecto(
        "mensajeSeguimientoProyecto"
    );

    abrirPanelProyecto(
        "panelSeguimientoProyecto"
    );
}


/*
==================================================
EQUIPO
==================================================
*/

function mostrarEquipoProyecto(
    proyecto
) {

    const contenedor =
        document.getElementById(
            "equipoDesarrolloProyecto"
        );

    if (!contenedor) {
        return;
    }

    const participantes =
        Array.isArray(
            proyecto.participantes
        )
            ? proyecto.participantes
            : [];

    if (participantes.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay integrantes registrados.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        participantes
            .map(
                function (participante) {

                    const nombre =
                        participante.nombre ||
                        convertirCorreoEnNombre(
                            participante.correo
                        );

                    return `
                        <article class="integrante-desarrollo-proyecto">

                            <div class="avatar-desarrollo-proyecto">
                                ${obtenerIniciales(
                                    nombre
                                )}
                            </div>

                            <div>

                                <strong>
                                    ${escaparProyecto(
                                        nombre
                                    )}
                                </strong>

                                <span>
                                    ${escaparProyecto(
                                        participante.rol ||
                                        "Contributor"
                                    )}
                                </span>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


function cargarResponsablesHito(
    participantes
) {

    const selector =
        document.getElementById(
            "responsableHitoProyecto"
        );

    if (!selector) {
        return;
    }

    selector.innerHTML = `
        <option value="">
            Selecciona un responsable
        </option>
    `;

    const equipo =
        Array.isArray(participantes)
            ? participantes
            : [];

    equipo.forEach(
        function (participante) {

            const nombre =
                participante.nombre ||
                convertirCorreoEnNombre(
                    participante.correo
                );

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                participante.correo ||
                nombre;

            opcion.textContent =
                nombre +
                " · " +
                (
                    participante.rol ||
                    "Contributor"
                );

            selector.appendChild(
                opcion
            );
        }
    );
}


/*
==================================================
CREAR HITO
==================================================
*/

function agregarHitoProyecto() {

    if (!proyectoGerenteSeleccionado) {
        return;
    }

    const titulo =
        obtenerValorProyecto(
            "tituloHitoProyecto"
        );

    const fecha =
        obtenerValorProyecto(
            "fechaHitoProyecto"
        );

    const avanceEsperado =
        Number(
            obtenerValorProyecto(
                "avanceHitoProyecto"
            )
        );

    const responsable =
        obtenerValorProyecto(
            "responsableHitoProyecto"
        );

    const descripcion =
        obtenerValorProyecto(
            "descripcionHitoProyecto"
        );

    if (
        !titulo ||
        !fecha ||
        !responsable ||
        !descripcion ||
        Number.isNaN(
            avanceEsperado
        )
    ) {

        mostrarMensajeProyecto(
            "mensajeHitoProyecto",
            "Completa todos los campos del hito.",
            "error"
        );

        return;
    }

    if (
        avanceEsperado < 0 ||
        avanceEsperado > 100
    ) {

        mostrarMensajeProyecto(
            "mensajeHitoProyecto",
            "El avance esperado debe estar entre 0 y 100.",
            "error"
        );

        return;
    }

    const proyectos =
        obtenerProyectosGerente();

    const proyecto =
        proyectos.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        proyectoGerenteSeleccionado.id
                    )
                );
            }
        );

    if (!proyecto) {
        return;
    }

    if (!Array.isArray(
        proyecto.hitos
    )) {

        proyecto.hitos = [];
    }

    const participante =
        (
            Array.isArray(
                proyecto.participantes
            )
                ? proyecto.participantes
                : []
        )
            .find(
                function (registro) {

                    return (
                        normalizarProyecto(
                            registro.correo
                        ) ===
                        normalizarProyecto(
                            responsable
                        )
                    );
                }
            );

    const nuevoHito = {

        id:
            generarIdHito(
                proyecto.hitos
            ),

        titulo:
            titulo,

        fecha:
            fecha,

        avanceEsperado:
            limitarAvanceProyecto(
                avanceEsperado
            ),

        responsable:
            responsable,

        nombreResponsable:
            participante?.nombre ||
            convertirCorreoEnNombre(
                responsable
            ),

        descripcion:
            descripcion,

        estado:
            "Pendiente",

        comentarios:
            [],

        solicitudCompletado:
            null,

        verificacion:
            null,

        fechaCreacion:
            new Date().toISOString(),

        creadoPor:
            obtenerCorreoGerente()
    };

    proyecto.hitos.push(
        nuevoHito
    );

    registrarEventoProyecto(
        proyecto,
        "hito",
        'Se creó el hito "' +
        titulo +
        '" con fecha compromiso ' +
        formatearFechaProyecto(
            fecha
        ) +
        ".",
        "Pendiente",
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Hito agregado correctamente."
    );

    limpiarFormularioHito();
}


/*
==================================================
ESTADO DEL HITO
==================================================
*/

function obtenerEstadoVisualHito(
    hito
) {

    const estado =
        normalizarProyecto(
            hito.estado
        );

    if (estado === "completado") {

        return "Completado";
    }

    if (
        estado ===
        "pendiente de verificacion"
    ) {

        return "Pendiente de verificación";
    }

    if (estado === "en proceso") {

        return "En proceso";
    }

    if (
        fechaHitoVencida(
            hito.fecha
        )
    ) {

        return "Vencido";
    }

    return "Pendiente";
}


function fechaHitoVencida(
    fecha
) {

    if (!fecha) {
        return false;
    }

    const hoy =
        new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );

    const compromiso =
        new Date(
            fecha +
            "T00:00:00"
        );

    return (
        !Number.isNaN(
            compromiso.getTime()
        )
        &&
        compromiso.getTime() <
        hoy.getTime()
    );
}


/*
==================================================
MOSTRAR HITOS
==================================================
*/

function mostrarHitosProyectoGerente(
    proyecto
) {

    const contenedor =
        document.getElementById(
            "listaHitosProyecto"
        );

    if (!contenedor) {
        return;
    }

    const hitos =
        Array.isArray(
            proyecto.hitos
        )
            ? [...proyecto.hitos]
            : [];

    asignarTextoProyecto(
        "contadorHitosProyecto",
        hitos.length === 1
            ? "1 hito"
            : hitos.length +
              " hitos"
    );

    if (hitos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Todavía no se han definido hitos.
            </div>
        `;

        return;
    }

    hitos.sort(
        function (a, b) {

            return (
                new Date(a.fecha) -
                new Date(b.fecha)
            );
        }
    );

    contenedor.innerHTML =
        hitos
            .map(
                function (hito) {

                    const estado =
                        obtenerEstadoVisualHito(
                            hito
                        );

                    const clase =
                        normalizarProyecto(
                            estado
                        )
                            .replace(
                                /\s+/g,
                                "-"
                            );

                    const comentarios =
                        Array.isArray(
                            hito.comentarios
                        )
                            ? hito.comentarios
                            : [];

                    return `
                        <article
                            class="
                                hito-card
                                ${clase}
                            "
                        >

                            <div class="cabecera-hito">

                                <h4>
                                    ${escaparProyecto(
                                        hito.titulo
                                    )}
                                </h4>

                                <span
                                    class="
                                        estado-hito
                                        ${clase}
                                    "
                                >
                                    ${escaparProyecto(
                                        estado
                                    )}
                                </span>

                            </div>

                            <div class="meta-hito">

                                <span>
                                    Fecha:
                                    ${formatearFechaProyecto(
                                        hito.fecha
                                    )}
                                </span>

                                <span>
                                    Avance esperado:
                                    ${limitarAvanceProyecto(
                                        hito.avanceEsperado
                                    )}%
                                </span>

                                <span>
                                    Responsable:
                                    ${escaparProyecto(
                                        hito.nombreResponsable ||
                                        convertirCorreoEnNombre(
                                            hito.responsable
                                        )
                                    )}
                                </span>

                            </div>

                            <p>
                                ${escaparProyecto(
                                    hito.descripcion ||
                                    ""
                                )}
                            </p>

                            ${
                                hito.solicitudCompletado
                                    ? `
                                        <div class="solicitud-hito">

                                            <strong>
                                                Solicitud del colaborador
                                            </strong>

                                            <p>
                                                ${escaparProyecto(
                                                    hito
                                                        .solicitudCompletado
                                                        .comentario ||
                                                    ""
                                                )}
                                            </p>

                                            <small>
                                                ${formatearFechaHoraProyecto(
                                                    hito
                                                        .solicitudCompletado
                                                        .fecha
                                                )}
                                                ·
                                                ${escaparProyecto(
                                                    hito
                                                        .solicitudCompletado
                                                        .nombre ||
                                                    convertirCorreoEnNombre(
                                                        hito
                                                            .solicitudCompletado
                                                            .correo
                                                    )
                                                )}
                                            </small>

                                        </div>
                                    `
                                    : ""
                            }

                            ${
                                hito.verificacion
                                    ? `
                                        <div class="verificacion-hito">

                                            <strong>
                                                Verificación del gerente
                                            </strong>

                                            <p>
                                                ${escaparProyecto(
                                                    hito.verificacion
                                                        .comentario ||
                                                    ""
                                                )}
                                            </p>

                                            <small>
                                                ${formatearFechaHoraProyecto(
                                                    hito.verificacion
                                                        .fecha
                                                )}
                                            </small>

                                        </div>
                                    `
                                    : ""
                            }

                            ${
                                comentarios.length > 0
                                    ? `
                                        <div class="comentarios-lista">

                                            ${comentarios
                                                .map(
                                                    function (
                                                        comentario
                                                    ) {

                                                        return `
                                                            <div class="comentario-item">

                                                                <strong>
                                                                    ${escaparProyecto(
                                                                        comentario
                                                                            .autorNombre ||
                                                                        convertirCorreoEnNombre(
                                                                            comentario
                                                                                .autor
                                                                        )
                                                                    )}
                                                                </strong>

                                                                <span>
                                                                    ${escaparProyecto(
                                                                        comentario.texto
                                                                    )}
                                                                </span>

                                                                <time>
                                                                    ${formatearFechaHoraProyecto(
                                                                        comentario.fecha
                                                                    )}
                                                                </time>

                                                            </div>
                                                        `;
                                                    }
                                                )
                                                .join("")
                                            }

                                        </div>
                                    `
                                    : ""
                            }

                            <div class="acciones-hito">

                                ${
                                    normalizarProyecto(
                                        hito.estado
                                    ) ===
                                    "pendiente de verificacion"
                                        ? `
                                            <button
                                                class="btn-aprobar-hito"
                                                type="button"
                                                onclick="
                                                    event.stopPropagation();
                                                    aprobarHitoProyecto(
                                                        '${escaparAtributoProyecto(
                                                            hito.id
                                                        )}'
                                                    );
                                                "
                                            >
                                                Aprobar completado
                                            </button>

                                            <button
                                                class="btn-rechazar-hito"
                                                type="button"
                                                onclick="
                                                    event.stopPropagation();
                                                    rechazarHitoProyecto(
                                                        '${escaparAtributoProyecto(
                                                            hito.id
                                                        )}'
                                                    );
                                                "
                                            >
                                                Rechazar solicitud
                                            </button>
                                        `
                                        : ""
                                }

                                <button
                                    class="btn-primario-hito"
                                    type="button"
                                    onclick="
                                        event.stopPropagation();
                                        editarHitoProyecto(
                                            '${escaparAtributoProyecto(
                                                hito.id
                                            )}'
                                        );
                                    "
                                >
                                    Editar hito
                                </button>

                                <button
                                    class="btn-primario-hito"
                                    type="button"
                                    onclick="
                                        event.stopPropagation();
                                        comentarHitoGerente(
                                            '${escaparAtributoProyecto(
                                                hito.id
                                            )}'
                                        );
                                    "
                                >
                                    Agregar comentario
                                </button>

                                ${
                                    normalizarProyecto(
                                        hito.estado
                                    ) === "completado"
                                        ? `
                                            <button
                                                class="btn-primario-hito"
                                                type="button"
                                                onclick="
                                                    event.stopPropagation();
                                                    reabrirHitoProyecto(
                                                        '${escaparAtributoProyecto(
                                                            hito.id
                                                        )}'
                                                    );
                                                "
                                            >
                                                Reabrir
                                            </button>
                                        `
                                        : ""
                                }

                                <button
                                    class="btn-eliminar-hito"
                                    type="button"
                                    onclick="
                                        event.stopPropagation();
                                        eliminarHitoProyecto(
                                            '${escaparAtributoProyecto(
                                                hito.id
                                            )}'
                                        );
                                    "
                                >
                                    Eliminar hito
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
BUSCAR PROYECTO E HITO
==================================================
*/

function obtenerProyectoEHito(
    hitoId
) {

    const proyectos =
        obtenerProyectosGerente();

    const proyecto =
        proyectos.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        proyectoGerenteSeleccionado?.id
                    )
                );
            }
        );

    const hito =
        proyecto?.hitos?.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        hitoId
                    )
                );
            }
        );

    return {
        proyectos,
        proyecto,
        hito
    };
}


/*
==================================================
EDITAR HITO
==================================================
*/

function editarHitoProyecto(
    hitoId
) {

    const {
        proyectos,
        proyecto,
        hito
    } =
        obtenerProyectoEHito(
            hitoId
        );

    if (!proyecto || !hito) {

        mostrarNotificacion(
            "No fue posible encontrar el hito."
        );

        return;
    }

    const nuevoTitulo =
        window.prompt(
            "Nombre del hito:",
            hito.titulo || ""
        );

    if (nuevoTitulo === null) {
        return;
    }

    if (!nuevoTitulo.trim()) {

        window.alert(
            "El nombre del hito no puede quedar vacío."
        );

        return;
    }

    const nuevaFecha =
        window.prompt(
            "Fecha compromiso en formato AAAA-MM-DD:",
            hito.fecha || ""
        );

    if (nuevaFecha === null) {
        return;
    }

    if (
        !validarFechaHitoProyecto(
            nuevaFecha
        )
    ) {

        window.alert(
            "La fecha debe tener el formato AAAA-MM-DD."
        );

        return;
    }

    const nuevoAvanceTexto =
        window.prompt(
            "Avance esperado entre 0 y 100:",
            String(
                hito.avanceEsperado ??
                0
            )
        );

    if (nuevoAvanceTexto === null) {
        return;
    }

    const nuevoAvance =
        Number(
            nuevoAvanceTexto
        );

    if (
        Number.isNaN(
            nuevoAvance
        ) ||
        nuevoAvance < 0 ||
        nuevoAvance > 100
    ) {

        window.alert(
            "El avance esperado debe estar entre 0 y 100."
        );

        return;
    }

    const nuevaDescripcion =
        window.prompt(
            "Descripción del hito:",
            hito.descripcion || ""
        );

    if (nuevaDescripcion === null) {
        return;
    }

    if (!nuevaDescripcion.trim()) {

        window.alert(
            "La descripción no puede quedar vacía."
        );

        return;
    }

    const tituloAnterior =
        hito.titulo;

    hito.titulo =
        nuevoTitulo.trim();

    hito.fecha =
        nuevaFecha;

    hito.avanceEsperado =
        nuevoAvance;

    hito.descripcion =
        nuevaDescripcion.trim();

    hito.fechaEdicion =
        new Date().toISOString();

    hito.editadoPor =
        obtenerCorreoGerente();

    registrarEventoProyecto(
        proyecto,
        "hito",
        'El hito "' +
        tituloAnterior +
        '" fue editado.',
        obtenerEstadoVisualHito(
            hito
        ),
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Hito editado correctamente."
    );
}


function validarFechaHitoProyecto(
    fecha
) {

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            String(fecha || "")
        )
    ) {

        return false;
    }

    const valor =
        new Date(
            fecha +
            "T00:00:00"
        );

    return !Number.isNaN(
        valor.getTime()
    );
}


/*
==================================================
APROBAR / RECHAZAR HITO
==================================================
*/

function aprobarHitoProyecto(
    hitoId
) {

    const comentario =
        window.prompt(
            "Comentario de verificación obligatorio:"
        );

    if (
        comentario === null ||
        !comentario.trim()
    ) {

        return;
    }

    const {
        proyectos,
        proyecto,
        hito
    } =
        obtenerProyectoEHito(
            hitoId
        );

    if (!proyecto || !hito) {
        return;
    }

    hito.estado =
        "Completado";

    hito.fechaCompletado =
        new Date().toISOString();

    hito.completadoPor =
        obtenerCorreoGerente();

    hito.verificacion = {

        resultado:
            "Aprobado",

        fecha:
            new Date().toISOString(),

        gerente:
            obtenerCorreoGerente(),

        gerenteNombre:
            obtenerNombreGerente(),

        comentario:
            comentario.trim()
    };

    registrarEventoProyecto(
        proyecto,
        "hito",
        'El hito "' +
        hito.titulo +
        '" fue aprobado y completado. ' +
        comentario.trim(),
        "Completado",
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Hito aprobado."
    );
}


function rechazarHitoProyecto(
    hitoId
) {

    const comentario =
        window.prompt(
            "Motivo del rechazo obligatorio:"
        );

    if (
        comentario === null ||
        !comentario.trim()
    ) {

        return;
    }

    const {
        proyectos,
        proyecto,
        hito
    } =
        obtenerProyectoEHito(
            hitoId
        );

    if (!proyecto || !hito) {
        return;
    }

    hito.estado =
        "En proceso";

    hito.verificacion = {

        resultado:
            "Rechazado",

        fecha:
            new Date().toISOString(),

        gerente:
            obtenerCorreoGerente(),

        gerenteNombre:
            obtenerNombreGerente(),

        comentario:
            comentario.trim()
    };

    hito.solicitudCompletado =
        null;

    registrarEventoProyecto(
        proyecto,
        "hito",
        'Se rechazó la solicitud de cierre del hito "' +
        hito.titulo +
        '". ' +
        comentario.trim(),
        "En proceso",
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Solicitud rechazada."
    );
}


/*
==================================================
REABRIR HITO
==================================================
*/

function reabrirHitoProyecto(
    hitoId
) {

    const {
        proyectos,
        proyecto,
        hito
    } =
        obtenerProyectoEHito(
            hitoId
        );

    if (!proyecto || !hito) {
        return;
    }

    const confirmar =
        window.confirm(
            '¿Deseas reabrir el hito "' +
            hito.titulo +
            '"?'
        );

    if (!confirmar) {
        return;
    }

    hito.estado =
        "En proceso";

    hito.solicitudCompletado =
        null;

    hito.verificacion =
        null;

    hito.fechaCompletado =
        "";

    hito.completadoPor =
        "";

    registrarEventoProyecto(
        proyecto,
        "hito",
        'Se reabrió el hito "' +
        hito.titulo +
        '".',
        "En proceso",
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Hito reabierto."
    );
}


/*
==================================================
COMENTARIO DEL GERENTE
==================================================
*/

function comentarHitoGerente(
    hitoId
) {

    const texto =
        window.prompt(
            "Escribe el comentario:"
        );

    if (
        texto === null ||
        !texto.trim()
    ) {

        return;
    }

    const {
        proyectos,
        proyecto,
        hito
    } =
        obtenerProyectoEHito(
            hitoId
        );

    if (!proyecto || !hito) {
        return;
    }

    if (!Array.isArray(
        hito.comentarios
    )) {

        hito.comentarios = [];
    }

    hito.comentarios.unshift({

        id:
            generarIdentificadorUnico(),

        texto:
            texto.trim(),

        fecha:
            new Date().toISOString(),

        autor:
            obtenerCorreoGerente(),

        autorNombre:
            obtenerNombreGerente(),

        rol:
            "gerente"
    });

    registrarEventoProyecto(
        proyecto,
        "hito",
        'Se agregó un comentario al hito "' +
        hito.titulo +
        '".',
        obtenerEstadoVisualHito(
            hito
        ),
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Comentario agregado."
    );
}


/*
==================================================
ELIMINAR HITO
==================================================
*/

function eliminarHitoProyecto(
    hitoId
) {

    const {
        proyectos,
        proyecto,
        hito
    } =
        obtenerProyectoEHito(
            hitoId
        );

    if (!proyecto || !hito) {

        mostrarNotificacion(
            "No fue posible encontrar el hito."
        );

        return;
    }

    const confirmar =
        window.confirm(
            '¿Deseas eliminar el hito "' +
            (
                hito.titulo ||
                hito.id
            ) +
            '"?'
        );

    if (!confirmar) {
        return;
    }

    proyecto.hitos =
        proyecto.hitos.filter(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) !== String(
                        hitoId
                    )
                );
            }
        );

    registrarEventoProyecto(
        proyecto,
        "hito",
        'Se eliminó el hito "' +
        (
            hito.titulo ||
            hito.id
        ) +
        '".',
        "Eliminado",
        proyecto.avance
    );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    refrescarProyectoSeleccionado(
        proyecto,
        "Hito eliminado correctamente."
    );
}


function refrescarProyectoSeleccionado(
    proyecto,
    mensaje
) {

    proyectoGerenteSeleccionado =
        proyecto;

    mostrarHitosProyectoGerente(
        proyecto
    );

    mostrarHistorialEditable(
        proyecto
    );

    actualizarModuloProyectos();

    if (mensaje) {

        mostrarNotificacion(
            mensaje
        );
    }
}


/*
==================================================
GUARDAR AVANCE GENERAL
==================================================
*/

function guardarSeguimientoProyectoGerente() {

    if (!proyectoGerenteSeleccionado) {
        return;
    }

    const proyectos =
        obtenerProyectosGerente();

    const proyecto =
        proyectos.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        proyectoGerenteSeleccionado.id
                    )
                );
            }
        );

    if (!proyecto) {
        return;
    }

    const estadoAnterior =
        proyecto.estado;

    const avanceAnterior =
        Number(
            proyecto.avance ||
            0
        );

    const estado =
        obtenerValorProyecto(
            "estadoSeguimientoProyecto"
        );

    let avance =
        limitarAvanceProyecto(
            obtenerValorProyecto(
                "avanceSeguimientoProyecto"
            )
        );

    const comentario =
        obtenerValorProyecto(
            "comentarioSeguimientoProyecto"
        );

    const horas =
        Number(
            obtenerValorProyecto(
                "horasAhorradasProyecto"
            )
        ) || 0;

    const resultado =
        obtenerValorProyecto(
            "resultadoFinalProyecto"
        );

    if (
        estado === "Completado" &&
        !resultado
    ) {

        mostrarMensajeProyecto(
            "mensajeSeguimientoProyecto",
            "Agrega el resultado final antes de completar el proyecto.",
            "error"
        );

        return;
    }

    if (estado === "Completado") {

        avance = 100;
    }

    const huboCambio =
        avance !== avanceAnterior ||
        estado !== estadoAnterior;

    if (
        huboCambio &&
        !comentario
    ) {

        mostrarMensajeProyecto(
            "mensajeSeguimientoProyecto",
            "Describe el avance antes de guardar.",
            "error"
        );

        return;
    }

    proyecto.estado =
        estado;

    proyecto.avance =
        avance;

    proyecto.horasAhorradasAnuales =
        horas;

    proyecto.resultadoFinal =
        resultado;

    proyecto.fechaActualizacion =
        new Date().toISOString();

    if (
        comentario ||
        huboCambio
    ) {

        registrarEventoProyecto(
            proyecto,
            "proyecto",
            comentario ||
            "Actualización de estado.",
            estado,
            avance
        );
    }

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    proyectoGerenteSeleccionado =
        proyecto;

    actualizarModuloProyectos();

    abrirSeguimientoProyecto(
        proyecto.id
    );

    mostrarMensajeProyecto(
        "mensajeSeguimientoProyecto",
        "El avance fue registrado correctamente.",
        "exito"
    );

    mostrarNotificacion(
        "Seguimiento actualizado."
    );
}


/*
==================================================
REGISTRAR EVENTO
==================================================
*/

function registrarEventoProyecto(
    proyecto,
    tipo,
    comentario,
    estado,
    avance
) {

    if (!Array.isArray(
        proyecto.actualizaciones
    )) {

        proyecto.actualizaciones = [];
    }

    proyecto.actualizaciones.unshift({

        id:
            generarIdentificadorUnico(),

        tipo:
            tipo,

        fecha:
            new Date().toISOString(),

        comentario:
            comentario,

        estado:
            estado,

        avance:
            limitarAvanceProyecto(
                avance
            ),

        autor:
            obtenerCorreoGerente(),

        autorNombre:
            obtenerNombreGerente()
    });
}


/*
==================================================
ASIGNAR IDS A REGISTROS ANTIGUOS
==================================================
*/

function asegurarIdsHistorial(
    proyecto
) {

    if (!Array.isArray(
        proyecto.actualizaciones
    )) {

        proyecto.actualizaciones = [];

        return;
    }

    let huboCambios =
        false;

    proyecto.actualizaciones.forEach(
        function (registro) {

            if (!registro.id) {

                registro.id =
                    generarIdentificadorUnico();

                huboCambios =
                    true;
            }
        }
    );

    if (!huboCambios) {
        return;
    }

    const proyectos =
        obtenerProyectosGerente();

    const indice =
        proyectos.findIndex(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        proyecto.id
                    )
                );
            }
        );

    if (indice !== -1) {

        proyectos[indice] =
            proyecto;

        guardarColeccionProyecto(
            "octoflowProyectos",
            proyectos
        );
    }
}


/*
==================================================
HISTORIAL EDITABLE
==================================================
*/

function mostrarHistorialEditable(
    proyecto
) {

    /*
    Soporta ambos posibles IDs usados
    anteriormente en el HTML.
    */

    const contenedor =
        document.getElementById(
            "historialProyectoGerente"
        ) ||
        document.getElementById(
            "historialDesarrolloProyecto"
        );

    if (!contenedor) {

        console.warn(
            "No se encontró el contenedor del historial."
        );

        return;
    }

    asegurarIdsHistorial(
        proyecto
    );

    const registros =
        Array.isArray(
            proyecto.actualizaciones
        )
            ? [...proyecto.actualizaciones]
            : [];

    asignarTextoProyectoMultiple(
        [
            "contadorHistorialProyecto",
            "contadorDesarrolloProyecto"
        ],
        registros.length === 1
            ? "1 registro"
            : registros.length +
              " registros"
    );

    if (registros.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No existen registros en el historial.
            </div>
        `;

        return;
    }

    registros.sort(
        function (a, b) {

            return (
                new Date(b.fecha) -
                new Date(a.fecha)
            );
        }
    );

    contenedor.innerHTML =
        registros
            .map(
                function (registro) {

                    const esHito =
                        normalizarProyecto(
                            registro.tipo
                        ) === "hito";

                    return `
                        <article class="registro-historial">

                            <div class="registro-historial-header">

                                <strong>
                                    ${
                                        esHito
                                            ? "Hito"
                                            : "Proyecto"
                                    }
                                </strong>

                                <small>
                                    ${formatearFechaHoraProyecto(
                                        registro.fecha
                                    )}
                                </small>

                            </div>

                            <p>
                                ${escaparProyecto(
                                    registro.comentario ||
                                    "Sin comentario"
                                )}
                            </p>

                            <small>
                                ${escaparProyecto(
                                    registro.estado ||
                                    "Sin estado"
                                )}
                                ·
                                ${limitarAvanceProyecto(
                                    registro.avance
                                )}%
                                ·
                                ${escaparProyecto(
                                    registro.autorNombre ||
                                    convertirCorreoEnNombre(
                                        registro.autor
                                    )
                                )}
                            </small>

                            ${
                                registro.editado
                                    ? `
                                        <div class="registro-editado">
                                            Editado el
                                            ${formatearFechaHoraProyecto(
                                                registro.fechaEdicion
                                            )}
                                            por
                                            ${escaparProyecto(
                                                registro.editadoPorNombre ||
                                                convertirCorreoEnNombre(
                                                    registro.editadoPor
                                                )
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="acciones-historial">

                                <button
                                    class="btn-primario-hito"
                                    type="button"
                                    onclick="
                                        event.stopPropagation();
                                        editarRegistroHistorial(
                                            '${escaparAtributoProyecto(
                                                registro.id
                                            )}'
                                        );
                                    "
                                >
                                    Editar
                                </button>

                                <button
                                    class="btn-eliminar-hito"
                                    type="button"
                                    onclick="
                                        event.stopPropagation();
                                        eliminarRegistroHistorial(
                                            '${escaparAtributoProyecto(
                                                registro.id
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
EDITAR REGISTRO DEL HISTORIAL
==================================================
*/

function editarRegistroHistorial(
    registroId
) {

    if (!proyectoGerenteSeleccionado) {

        mostrarNotificacion(
            "No hay un proyecto seleccionado."
        );

        return;
    }

    const proyectos =
        obtenerProyectosGerente();

    const proyecto =
        proyectos.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        proyectoGerenteSeleccionado.id
                    )
                );
            }
        );

    if (!proyecto) {

        mostrarNotificacion(
            "No fue posible encontrar el proyecto."
        );

        return;
    }

    asegurarIdsHistorial(
        proyecto
    );

    const registro =
        proyecto.actualizaciones
            .find(
                function (elemento) {

                    return (
                        String(
                            elemento.id
                        ) === String(
                            registroId
                        )
                    );
                }
            );

    if (!registro) {

        mostrarNotificacion(
            "No fue posible encontrar el registro."
        );

        return;
    }

    const nuevoComentario =
        window.prompt(
            "Editar comentario del historial:",
            registro.comentario ||
            ""
        );

    if (nuevoComentario === null) {
        return;
    }

    if (!nuevoComentario.trim()) {

        window.alert(
            "El comentario no puede quedar vacío."
        );

        return;
    }

    registro.comentario =
        nuevoComentario.trim();

    registro.editado =
        true;

    registro.fechaEdicion =
        new Date().toISOString();

    registro.editadoPor =
        obtenerCorreoGerente();

    registro.editadoPorNombre =
        obtenerNombreGerente();

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    proyectoGerenteSeleccionado =
        proyecto;

    mostrarHistorialEditable(
        proyecto
    );

    mostrarNotificacion(
        "Registro editado correctamente."
    );
}


/*
==================================================
ELIMINAR REGISTRO DEL HISTORIAL
==================================================
*/

function eliminarRegistroHistorial(
    registroId
) {

    if (!proyectoGerenteSeleccionado) {

        mostrarNotificacion(
            "No hay un proyecto seleccionado."
        );

        return;
    }

    const proyectos =
        obtenerProyectosGerente();

    const proyecto =
        proyectos.find(
            function (registro) {

                return (
                    String(
                        registro.id
                    ) === String(
                        proyectoGerenteSeleccionado.id
                    )
                );
            }
        );

    if (!proyecto) {

        mostrarNotificacion(
            "No fue posible encontrar el proyecto."
        );

        return;
    }

    asegurarIdsHistorial(
        proyecto
    );

    const registro =
        proyecto.actualizaciones
            .find(
                function (elemento) {

                    return (
                        String(
                            elemento.id
                        ) === String(
                            registroId
                        )
                    );
                }
            );

    if (!registro) {

        mostrarNotificacion(
            "No fue posible encontrar el registro."
        );

        return;
    }

    const confirmar =
        window.confirm(
            "¿Deseas eliminar este registro del historial?\n\n" +
            (
                registro.comentario ||
                "Registro sin comentario"
            )
        );

    if (!confirmar) {
        return;
    }

    proyecto.actualizaciones =
        proyecto.actualizaciones
            .filter(
                function (elemento) {

                    return (
                        String(
                            elemento.id
                        ) !== String(
                            registroId
                        )
                    );
                }
            );

    guardarColeccionProyecto(
        "octoflowProyectos",
        proyectos
    );

    proyectoGerenteSeleccionado =
        proyecto;

    mostrarHistorialEditable(
        proyecto
    );

    mostrarNotificacion(
        "Registro eliminado correctamente."
    );
}


/*
==================================================
INDICADORES
==================================================
*/

function actualizarIndicadoresProyecto() {

    const proyectos =
        obtenerProyectosGerente();

    const verificaciones =
        proyectos.reduce(
            function (
                total,
                proyecto
            ) {

                const hitos =
                    Array.isArray(
                        proyecto.hitos
                    )
                        ? proyecto.hitos
                        : [];

                return (
                    total +
                    hitos.filter(
                        function (hito) {

                            return normalizarProyecto(
                                hito.estado
                            ) ===
                            "pendiente de verificacion";
                        }
                    ).length
                );
            },
            0
        );

    asignarTextoProyecto(
        "totalListosProyecto",
        obtenerOportunidadesPendientes()
            .length
    );

    asignarTextoProyecto(
        "totalActivosProyecto",
        proyectos.filter(
            function (proyecto) {

                return normalizarProyecto(
                    proyecto.estado
                ) === "activo";
            }
        ).length
    );

    asignarTextoProyectoMultiple(
        [
            "totalVerificacionesProyecto",
            "totalPausaProyecto"
        ],
        verificaciones
    );

    asignarTextoProyecto(
        "totalCompletadosProyecto",
        proyectos.filter(
            function (proyecto) {

                return normalizarProyecto(
                    proyecto.estado
                ) === "completado";
            }
        ).length
    );
}


/*
==================================================
PESTAÑAS
==================================================
*/

function configurarPestanasProyecto() {

    document
        .querySelectorAll(
            "[data-vista-proyecto]"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const vista =
                            boton.dataset
                                .vistaProyecto;

                        document
                            .querySelectorAll(
                                "[data-vista-proyecto]"
                            )
                            .forEach(
                                function (
                                    otroBoton
                                ) {

                                    otroBoton
                                        .classList
                                        .toggle(
                                            "activa",
                                            otroBoton
                                                .dataset
                                                .vistaProyecto ===
                                                vista
                                        );
                                }
                            );

                        document
                            .getElementById(
                                "vistaPendientesProyecto"
                            )
                            ?.classList
                            .toggle(
                                "oculto",
                                vista !==
                                "pendientes"
                            );

                        document
                            .getElementById(
                                "vistaActivosProyecto"
                            )
                            ?.classList
                            .toggle(
                                "oculto",
                                vista !==
                                "activos"
                            );

                        document
                            .getElementById(
                                "vistaHistorialProyecto"
                            )
                            ?.classList
                            .toggle(
                                "oculto",
                                vista !==
                                "historial"
                            );
                    }
                );
            }
        );
}


/*
==================================================
PANELES Y BOTONES
==================================================
*/

function configurarPanelesProyecto() {

    document
        .getElementById(
            "cerrarPanelConfirmarProyecto"
        )
        ?.addEventListener(
            "click",
            function () {

                cerrarPanelProyecto(
                    "panelConfirmarProyecto"
                );
            }
        );

    document
        .getElementById(
            "cerrarPanelSeguimientoProyecto"
        )
        ?.addEventListener(
            "click",
            function () {

                cerrarPanelProyecto(
                    "panelSeguimientoProyecto"
                );
            }
        );

    document
        .getElementById(
            "iniciarProyecto"
        )
        ?.addEventListener(
            "click",
            iniciarProyectoGerente
        );

    document
        .getElementById(
            "agregarHitoProyecto"
        )
        ?.addEventListener(
            "click",
            agregarHitoProyecto
        );

    document
        .getElementById(
            "guardarSeguimientoProyecto"
        )
        ?.addEventListener(
            "click",
            guardarSeguimientoProyectoGerente
        );

    [
        "panelConfirmarProyecto",
        "panelSeguimientoProyecto"
    ].forEach(
        function (id) {

            const panel =
                document.getElementById(id);

            panel?.addEventListener(
                "click",
                function (evento) {

                    if (
                        evento.target === panel
                    ) {

                        cerrarPanelProyecto(
                            id
                        );
                    }
                }
            );
        }
    );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (evento.key === "Escape") {

                cerrarPanelProyecto(
                    "panelConfirmarProyecto"
                );

                cerrarPanelProyecto(
                    "panelSeguimientoProyecto"
                );
            }
        }
    );
}


function abrirPanelProyecto(
    id
) {

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


function cerrarPanelProyecto(
    id
) {

    const panel =
        document.getElementById(id);

    panel?.classList.remove(
        "visible"
    );

    panel?.setAttribute(
        "aria-hidden",
        "true"
    );

    const algunPanelAbierto =
        document.querySelector(
            ".panel-lateral-proyecto.visible"
        );

    if (!algunPanelAbierto) {

        document.body.classList.remove(
            "modal-abierto"
        );
    }
}


/*
==================================================
UTILIDADES
==================================================
*/

function limpiarFormularioHito() {

    [
        "tituloHitoProyecto",
        "fechaHitoProyecto",
        "avanceHitoProyecto",
        "responsableHitoProyecto",
        "descripcionHitoProyecto"
    ].forEach(
        function (id) {

            asignarValorProyecto(
                id,
                ""
            );
        }
    );

    limpiarMensajeProyecto(
        "mensajeHitoProyecto"
    );
}


function generarIdProyecto(
    proyectos
) {

    let mayor =
        1000;

    proyectos.forEach(
        function (proyecto) {

            const numero =
                Number(
                    String(
                        proyecto.id ||
                        ""
                    ).replace(
                        "PR-",
                        ""
                    )
                );

            if (
                !Number.isNaN(
                    numero
                ) &&
                numero > mayor
            ) {

                mayor =
                    numero;
            }
        }
    );

    return "PR-" +
        (mayor + 1);
}


function generarIdHito(
    hitos
) {

    let mayor =
        0;

    hitos.forEach(
        function (hito) {

            const numero =
                Number(
                    String(
                        hito.id ||
                        ""
                    ).replace(
                        "H-",
                        ""
                    )
                );

            if (
                !Number.isNaN(
                    numero
                ) &&
                numero > mayor
            ) {

                mayor =
                    numero;
            }
        }
    );

    return "H-" +
        (mayor + 1);
}


function generarIdentificadorUnico() {

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


function obtenerNombreCandidato(
    candidato
) {

    return (
        candidato.nombre ||
        candidato.nombreCompleto ||
        convertirCorreoEnNombre(
            candidato.correo ||
            candidato.email ||
            ""
        )
    );
}


function limitarAvanceProyecto(
    valor
) {

    return Math.min(
        100,
        Math.max(
            0,
            Number(valor) ||
            0
        )
    );
}


function obtenerValorProyecto(
    id
) {

    return String(
        document
            .getElementById(id)
            ?.value ||
        ""
    ).trim();
}


function asignarValorProyecto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.value =
            valor ?? "";
    }
}


function asignarTextoProyecto(
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


function asignarTextoProyectoMultiple(
    ids,
    texto
) {

    ids.forEach(
        function (id) {

            asignarTextoProyecto(
                id,
                texto
            );
        }
    );
}


function mostrarMensajeProyecto(
    id,
    texto,
    tipo
) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.className =
        "mensaje-proyecto " +
        tipo;

    elemento.textContent =
        texto;
}


function limpiarMensajeProyecto(
    id
) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.className =
        "mensaje-proyecto";

    elemento.textContent =
        "";
}


function normalizarProyecto(
    texto
) {

    return String(
        texto ||
        ""
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


function convertirCorreoEnNombre(
    correo
) {

    return String(
        correo ||
        "Usuario"
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


function obtenerIniciales(
    nombre
) {

    const partes =
        String(
            nombre ||
            "Usuario"
        )
            .split(" ")
            .filter(Boolean);

    if (partes.length === 1) {

        return partes[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        partes[0].charAt(0) +
        partes[
            partes.length - 1
        ].charAt(0)
    ).toUpperCase();
}


function formatearFechaProyecto(
    fecha
) {

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


function formatearFechaHoraProyecto(
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

    return valor.toLocaleString(
        "es-MX",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );
}


function escaparProyecto(
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


function escaparAtributoProyecto(
    texto
) {

    return String(
        texto ||
        ""
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