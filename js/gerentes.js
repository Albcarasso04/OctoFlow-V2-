/*
==================================================
OCTOFLOW - DASHBOARD DEL GERENTE
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarPortalGerente
);


function iniciarPortalGerente() {

    actualizarIndicadoresGerente();

    actualizarMetricasGerente();

    mostrarIdeasPendientesGerente();

    mostrarPostulacionesGerente();

    mostrarProyectosGerente();
}


/*
==================================================
DATOS
==================================================
*/

function obtenerIdeasGerente() {

    return leerColeccionGerente(
        "octoflowIdeas"
    );
}


function obtenerOportunidadesGerente() {

    return leerColeccionGerente(
        "octoflowOportunidades"
    );
}


function obtenerPostulacionesGerente() {

    return leerColeccionGerente(
        "octoflowPostulaciones"
    );
}


function obtenerProyectosGerente() {

    return leerColeccionGerente(
        "octoflowProyectos"
    );
}


function leerColeccionGerente(
    clave
) {

    const datos =
        localStorage.getItem(clave);

    if (!datos) {

        return [];
    }

    try {

        const resultado =
            JSON.parse(datos);

        return Array.isArray(resultado)
            ? resultado
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
INDICADORES
==================================================
*/

function actualizarIndicadoresGerente() {

    const ideas =
        obtenerIdeasGerente();

    const oportunidades =
        obtenerOportunidadesGerente();

    const postulaciones =
        obtenerPostulacionesGerente();

    const proyectos =
        obtenerProyectosGerente();


    const ideasPendientes =
        ideas.filter(
            function (idea) {

                return normalizarGerente(
                    idea.estado
                ) === "en revision";
            }
        );


    const oportunidadesPublicadas =
        oportunidades.filter(
            function (oportunidad) {

                return normalizarGerente(
                    oportunidad.estado
                ) === "publicada";
            }
        );


    const postulacionesPendientes =
        postulaciones.filter(
            function (postulacion) {

                const estado =
                    normalizarGerente(
                        postulacion.estado
                    );

                return (
                    estado === "pendiente" ||
                    estado === "en revision" ||
                    estado === "preseleccionado"
                );
            }
        );


    const proyectosActivos =
        proyectos.filter(
            function (proyecto) {

                const estado =
                    normalizarGerente(
                        proyecto.estado
                    );

                return (
                    !estado.includes("complet") &&
                    !estado.includes("cerrad")
                );
            }
        );


    asignarTextoGerente(
        "numeroIdeasPendientes",
        ideasPendientes.length
    );

    asignarTextoGerente(
        "detalleIdeasPendientes",
        construirCantidadGerente(
            ideasPendientes.length,
            "propuesta pendiente",
            "propuestas pendientes"
        )
    );


    asignarTextoGerente(
        "numeroOportunidadesGerente",
        oportunidadesPublicadas.length
    );

    asignarTextoGerente(
        "detalleOportunidadesGerente",
        construirCantidadGerente(
            oportunidadesPublicadas.length,
            "oportunidad publicada",
            "oportunidades publicadas"
        )
    );


    asignarTextoGerente(
        "numeroPostulacionesPendientes",
        postulacionesPendientes.length
    );

    asignarTextoGerente(
        "detallePostulacionesPendientes",
        construirCantidadGerente(
            postulacionesPendientes.length,
            "postulación pendiente",
            "postulaciones pendientes"
        )
    );


    asignarTextoGerente(
        "numeroProyectosActivosGerente",
        proyectosActivos.length
    );

    asignarTextoGerente(
        "detalleProyectosActivosGerente",
        construirCantidadGerente(
            proyectosActivos.length,
            "proyecto activo",
            "proyectos activos"
        )
    );
}


/*
==================================================
MÉTRICAS
==================================================
*/

function actualizarMetricasGerente() {

    const proyectos =
        obtenerProyectosGerente();

    const completados =
        proyectos.filter(
            function (proyecto) {

                const estado =
                    normalizarGerente(
                        proyecto.estado
                    );

                return (
                    estado.includes("complet") ||
                    estado.includes("cerrad")
                );
            }
        );


    const horasAhorradas =
        completados.reduce(
            function (total, proyecto) {

                return (
                    total +
                    Number(
                        proyecto.horasAhorradasAnuales ||
                        proyecto.horasAhorradas ||
                        0
                    )
                );
            },
            0
        );


    const participantes =
        proyectos.flatMap(
            function (proyecto) {

                return Array.isArray(
                    proyecto.participantes
                )
                    ? proyecto.participantes
                    : [];
            }
        );


    const learners =
        obtenerCorreosUnicosGerente(
            participantes.filter(
                function (participante) {

                    return participante.rol ===
                        "Learner";
                }
            )
        );


    const champions =
        obtenerCorreosUnicosGerente(
            participantes.filter(
                function (participante) {

                    return participante.rol ===
                        "Champion";
                }
            )
        );


    asignarTextoGerente(
        "horasAhorradasGerente",
        Math.round(horasAhorradas) +
        " h"
    );

    asignarTextoGerente(
        "proyectosCompletadosGerente",
        completados.length
    );

    asignarTextoGerente(
        "learnersParticipantesGerente",
        learners.length
    );

    asignarTextoGerente(
        "championsActivosGerente",
        champions.length
    );
}


function obtenerCorreosUnicosGerente(
    participantes
) {

    return [
        ...new Set(
            participantes
                .map(
                    function (participante) {

                        return normalizarGerente(
                            participante.correo
                        );
                    }
                )
                .filter(Boolean)
        )
    ];
}


/*
==================================================
IDEAS PENDIENTES
==================================================
*/

function mostrarIdeasPendientesGerente() {

    const tabla =
        document.getElementById(
            "tablaIdeasPendientesGerente"
        );

    if (!tabla) {

        return;
    }


    const ideas =
        obtenerIdeasGerente()
            .filter(
                function (idea) {

                    return normalizarGerente(
                        idea.estado
                    ) === "en revision";
                }
            )
            .sort(
                function (a, b) {

                    return (
                        obtenerFechaGerente(b) -
                        obtenerFechaGerente(a)
                    );
                }
            )
            .slice(0, 5);


    if (ideas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="tabla-vacia"
                >
                    No hay ideas pendientes.
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
                                    ${escaparGerente(
                                        idea.id ||
                                        "Sin ticket"
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escaparGerente(
                                    idea.titulo ||
                                    "Propuesta sin título"
                                )}
                            </td>

                            <td>
                                ${escaparGerente(
                                    idea.area ||
                                    "Sin área"
                                )}
                            </td>

                            <td>
                                ${escaparGerente(
                                    idea.fecha ||
                                    "Sin fecha"
                                )}
                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/*
==================================================
POSTULACIONES
==================================================
*/

function mostrarPostulacionesGerente() {

    const contenedor =
        document.getElementById(
            "listaPostulacionesGerente"
        );

    if (!contenedor) {

        return;
    }


    const postulaciones =
        obtenerPostulacionesGerente()
            .filter(
                function (postulacion) {

                    const estado =
                        normalizarGerente(
                            postulacion.estado
                        );

                    return (
                        estado === "pendiente" ||
                        estado === "en revision" ||
                        estado === "preseleccionado"
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
            )
            .slice(0, 4);


    if (postulaciones.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay postulaciones pendientes.
            </div>
        `;

        return;
    }


    contenedor.innerHTML =
        postulaciones
            .map(
                function (postulacion) {

                    const nombre =
                        convertirCorreoGerente(
                            postulacion.correo
                        );

                    return `
                        <article class="postulacion-gerente">

                            <div
                                class="avatar avatar-equipo"
                            >
                                ${obtenerInicialesGerente(
                                    nombre
                                )}
                            </div>

                            <div
                                class="postulacion-gerente-datos"
                            >

                                <strong>
                                    ${escaparGerente(
                                        nombre
                                    )}
                                </strong>

                                <span>
                                    ${escaparGerente(
                                        postulacion.proyecto ||
                                        "Proyecto"
                                    )}
                                </span>

                                <small>
                                    ${escaparGerente(
                                        postulacion.rolSolicitado ||
                                        "Contributor"
                                    )}
                                    ·
                                    ${Number(
                                        postulacion.compatibilidad ||
                                        0
                                    )}%
                                </small>

                            </div>

                            <span
                                class="
                                    estado-postulacion
                                    estado-postulacion-pendiente
                                "
                            >
                                ${escaparGerente(
                                    postulacion.estado
                                )}
                            </span>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
PROYECTOS
==================================================
*/

function mostrarProyectosGerente() {

    const contenedor =
        document.getElementById(
            "listaProyectosGerente"
        );

    if (!contenedor) {

        return;
    }


    const proyectos =
        obtenerProyectosGerente()
            .filter(
                function (proyecto) {

                    const estado =
                        normalizarGerente(
                            proyecto.estado
                        );

                    return (
                        !estado.includes("complet") &&
                        !estado.includes("cerrad")
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        Number(b.avance || 0) -
                        Number(a.avance || 0)
                    );
                }
            )
            .slice(0, 4);


    if (proyectos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Todavía no hay proyectos activos.
            </div>
        `;

        return;
    }


    contenedor.innerHTML =
        proyectos
            .map(
                function (proyecto) {

                    const avance =
                        limitarPorcentajeGerente(
                            proyecto.avance
                        );

                    const participantes =
                        Array.isArray(
                            proyecto.participantes
                        )
                            ? proyecto.participantes
                            : [];

                    const champion =
                        participantes.some(
                            function (participante) {

                                return participante.rol ===
                                    "Champion";
                            }
                        );

                    const learner =
                        participantes.some(
                            function (participante) {

                                return participante.rol ===
                                    "Learner";
                            }
                        );

                    return `
                        <article class="proyecto-gerente">

                            <div class="proyecto-superior">

                                <div>

                                    <span class="codigo-oportunidad">
                                        ${escaparGerente(
                                            proyecto.id ||
                                            "Proyecto"
                                        )}
                                    </span>

                                    <strong>
                                        ${escaparGerente(
                                            proyecto.nombre ||
                                            proyecto.titulo ||
                                            "Proyecto sin nombre"
                                        )}
                                    </strong>

                                    <small>
                                        ${escaparGerente(
                                            proyecto.area ||
                                            "Sin área"
                                        )}
                                    </small>

                                </div>

                                <span class="porcentaje">
                                    ${avance}%
                                </span>

                            </div>

                            <div class="barra-progreso">

                                <span
                                    style="width: ${avance}%"
                                ></span>

                            </div>

                            <div class="equipo-oportunidad">

                                <span
                                    class="${
                                        champion
                                            ? "cubierto"
                                            : "vacante"
                                    }"
                                >
                                    ${
                                        champion
                                            ? "Champion asignado"
                                            : "Sin Champion"
                                    }
                                </span>

                                <span
                                    class="${
                                        learner
                                            ? "cubierto"
                                            : "vacante"
                                    }"
                                >
                                    ${
                                        learner
                                            ? "Learner asignado"
                                            : "Sin Learner"
                                    }
                                </span>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
NOTIFICACIONES
==================================================
*/

function mostrarNotificacionGerente() {

    const ideasPendientes =
        obtenerIdeasGerente()
            .filter(
                function (idea) {

                    return normalizarGerente(
                        idea.estado
                    ) === "en revision";
                }
            )
            .length;

    const postulacionesPendientes =
        obtenerPostulacionesGerente()
            .filter(
                function (postulacion) {

                    const estado =
                        normalizarGerente(
                            postulacion.estado
                        );

                    return (
                        estado === "pendiente" ||
                        estado === "en revision"
                    );
                }
            )
            .length;

    mostrarNotificacion(
        ideasPendientes +
        " ideas y " +
        postulacionesPendientes +
        " postulaciones requieren atención."
    );
}


/*
==================================================
UTILIDADES
==================================================
*/

function construirCantidadGerente(
    cantidad,
    singular,
    plural
) {

    return cantidad === 1
        ? "1 " + singular
        : cantidad + " " + plural;
}


function obtenerFechaGerente(
    registro
) {

    if (registro.fechaISO) {

        const fecha =
            new Date(
                registro.fechaISO
            );

        if (
            !Number.isNaN(
                fecha.getTime()
            )
        ) {

            return fecha;
        }
    }

    return new Date(0);
}


function convertirCorreoGerente(
    correo
) {

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


function obtenerInicialesGerente(
    nombre
) {

    return String(nombre || "Usuario")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            function (palabra) {

                return palabra.charAt(0);
            }
        )
        .join("")
        .toUpperCase();
}


function limitarPorcentajeGerente(
    valor
) {

    const numero =
        Number(valor);

    if (Number.isNaN(numero)) {

        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(numero)
        )
    );
}


function asignarTextoGerente(
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


function normalizarGerente(
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


function escaparGerente(
    texto
) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}