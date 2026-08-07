/*
==================================================
OCTOFLOW
DASHBOARD DEL EMPLEADO
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarPortalEmpleado
);


/*
==================================================
INICIAR DASHBOARD
==================================================
*/

function iniciarPortalEmpleado(actualizarOportunidadesEmpleado();) {

    actualizarIndicadoresEmpleado();

    mostrarIdeasRecientesEmpleado();

    mostrarProyectosEmpleado();
       
    actualizarOportunidadesEmpleado();
}


/*
==================================================
OBTENER IDEAS DEL EMPLEADO
==================================================
*/

function obtenerIdeasEmpleado() {

    const correo =
        localStorage.getItem(
            "octoflowCorreo"
        );

    const datos =
        localStorage.getItem(
            "octoflowIdeas"
        );

    if (!correo || !datos) {

        return [];
    }

    try {

        const ideas =
            JSON.parse(datos);

        if (!Array.isArray(ideas)) {

            return [];
        }

        return ideas.filter(
            function (idea) {

                return (
                    String(
                        idea.correo || ""
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    correo
                        .trim()
                        .toLowerCase()
                );
            }
        );

    } catch (error) {

        console.error(
            "No fue posible leer las ideas.",
            error
        );

        return [];
    }
}


/*
==================================================
OBTENER PROYECTOS DEL EMPLEADO
==================================================
*/

function obtenerProyectosEmpleado() {

    const correo =
        localStorage.getItem(
            "octoflowCorreo"
        );

    const datos =
        localStorage.getItem(
            "octoflowProyectos"
        );

    if (!correo || !datos) {

        return [];
    }

    try {

        const proyectos =
            JSON.parse(datos);

        if (!Array.isArray(proyectos)) {

            return [];
        }

        return proyectos.filter(
            function (proyecto) {

                const responsable =
                    proyecto.correoResponsable ||
                    proyecto.correo ||
                    "";

                return (
                    String(responsable)
                        .trim()
                        .toLowerCase()
                    ===
                    correo
                        .trim()
                        .toLowerCase()
                );
            }
        );

    } catch (error) {

        console.error(
            "No fue posible leer los proyectos.",
            error
        );

        return [];
    }
}


/*
==================================================
ACTUALIZAR INDICADORES
==================================================
*/

function actualizarIndicadoresEmpleado() {

    const ideas =
        obtenerIdeasEmpleado();

    const proyectos =
        obtenerProyectosEmpleado();

    const ideasAprobadas =
        ideas.filter(
            function (idea) {

                const estado =
                    normalizarTexto(
                        idea.estado
                    );

                return estado.includes(
                    "aprob"
                );
            }
        ).length;


    /*
    Cada idea registrada genera inicialmente
    un ticket. Se considera abierto mientras
    no esté cerrado o completado.
    */

    const ticketsAbiertos =
        ideas.filter(
            function (idea) {

                const estado =
                    normalizarTexto(
                        idea.estado
                    );

                return (
                    !estado.includes("cerrad") &&
                    !estado.includes("complet")
                );
            }
        ).length;


    const proyectosActivos =
        proyectos.filter(
            function (proyecto) {

                const estado =
                    normalizarTexto(
                        proyecto.estado
                    );

                return (
                    !estado.includes("cerrad") &&
                    !estado.includes("complet")
                );
            }
        ).length;


    actualizarTextoEmpleado(
        "numeroIdeasEmpleado",
        ideas.length
    );


    actualizarTextoEmpleado(
        "detalleIdeasEmpleado",
        construirTextoCantidad(
            ideasAprobadas,
            "idea aprobada",
            "ideas aprobadas"
        )
    );


    actualizarTextoEmpleado(
        "numeroTicketsEmpleado",
        ticketsAbiertos
    );


    actualizarTextoEmpleado(
        "detalleTicketsEmpleado",
        construirTextoCantidad(
            ticketsAbiertos,
            "ticket abierto",
            "tickets abiertos"
        )
    );


    actualizarTextoEmpleado(
        "numeroProyectosEmpleado",
        proyectosActivos
    );


    actualizarTextoEmpleado(
        "detalleProyectosEmpleado",
        proyectosActivos === 0
            ? "Sin proyectos asignados"
            : construirTextoCantidad(
                proyectosActivos,
                "proyecto actualmente activo",
                "proyectos actualmente activos"
            )
    );
}


/*
==================================================
MOSTRAR IDEAS RECIENTES
==================================================
*/

function mostrarIdeasRecientesEmpleado() {

    const tabla =
        document.getElementById(
            "tablaIdeasRecientes"
        );

    if (!tabla) {

        return;
    }


    const ideas =
        obtenerIdeasEmpleado()
            .sort(
                function (ideaA, ideaB) {

                    const fechaA =
                        obtenerFechaComparable(
                            ideaA
                        );

                    const fechaB =
                        obtenerFechaComparable(
                            ideaB
                        );

                    return fechaB - fechaA;
                }
            )
            .slice(0, 3);


    if (ideas.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="tabla-vacia"
                >
                    Todavía no has registrado ideas.
                </td>
            </tr>
        `;

        return;
    }


    tabla.innerHTML =
        ideas
            .map(
                function (idea) {

                    const titulo =
                        escaparTextoEmpleado(
                            idea.titulo ||
                            "Idea sin título"
                        );

                    const area =
                        escaparTextoEmpleado(
                            idea.area ||
                            "Sin área"
                        );

                    const estado =
                        escaparTextoEmpleado(
                            idea.estado ||
                            "En revisión"
                        );

                    const claseEstado =
                        obtenerClaseEstadoEmpleado(
                            idea.estado
                        );

                    return `
                        <tr>

                            <td>
                                ${titulo}
                            </td>

                            <td>
                                ${area}
                            </td>

                            <td>

                                <span
                                    class="
                                        estado
                                        ${claseEstado}
                                    "
                                >
                                    ${estado}
                                </span>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/*
==================================================
MOSTRAR PROYECTOS
==================================================
*/

function mostrarProyectosEmpleado() {

    const contenedor =
        document.getElementById(
            "listaProyectosEmpleado"
        );

    if (!contenedor) {

        return;
    }


    const proyectos =
        obtenerProyectosEmpleado()
            .filter(
                function (proyecto) {

                    const estado =
                        normalizarTexto(
                            proyecto.estado
                        );

                    return (
                        !estado.includes("cerrad") &&
                        !estado.includes("complet")
                    );
                }
            )
            .slice(0, 3);


    if (proyectos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Todavía no tienes proyectos asignados.
            </div>
        `;

        return;
    }


    contenedor.innerHTML =
        proyectos
            .map(
                function (proyecto) {

                    const nombre =
                        escaparTextoEmpleado(
                            proyecto.nombre ||
                            proyecto.titulo ||
                            "Proyecto sin nombre"
                        );

                    const herramienta =
                        escaparTextoEmpleado(
                            proyecto.herramienta ||
                            proyecto.tecnologia ||
                            "Herramienta por definir"
                        );

                    const area =
                        escaparTextoEmpleado(
                            proyecto.area ||
                            "Área por definir"
                        );

                    const avance =
                        limitarPorcentaje(
                            proyecto.avance
                        );

                    return `
                        <article class="proyecto">

                            <div class="proyecto-superior">

                                <div>

                                    <strong>
                                        ${nombre}
                                    </strong>

                                    <small>
                                        ${herramienta}
                                        ·
                                        ${area}
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

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
CLASE VISUAL DEL ESTADO
==================================================
*/

function obtenerClaseEstadoEmpleado(
    estado
) {

    const estadoNormalizado =
        normalizarTexto(estado);

    if (
        estadoNormalizado.includes(
            "aprob"
        )
    ) {

        return "estado-aprobado";
    }


    if (
        estadoNormalizado.includes(
            "desarrollo"
        ) ||
        estadoNormalizado.includes(
            "proceso"
        )
    ) {

        return "estado-desarrollo";
    }


    if (
        estadoNormalizado.includes(
            "complet"
        ) ||
        estadoNormalizado.includes(
            "cerrad"
        )
    ) {

        return "estado-completado";
    }


    return "estado-revision";
}


/*
==================================================
OBTENER FECHA PARA ORDENAR
==================================================
*/

function obtenerFechaComparable(idea) {

    if (idea.fechaISO) {

        const fechaISO =
            new Date(idea.fechaISO);

        if (
            !Number.isNaN(
                fechaISO.getTime()
            )
        ) {

            return fechaISO;
        }
    }


    if (idea.fecha) {

        const partes =
            String(idea.fecha)
                .split("/");

        if (partes.length === 3) {

            const dia =
                Number(partes[0]);

            const mes =
                Number(partes[1]) - 1;

            const anio =
                Number(partes[2]);

            const fecha =
                new Date(
                    anio,
                    mes,
                    dia
                );

            if (
                !Number.isNaN(
                    fecha.getTime()
                )
            ) {

                return fecha;
            }
        }
    }


    return new Date(0);
}


/*
==================================================
UTILIDADES
==================================================
*/

function actualizarTextoEmpleado(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor;
    }
}


function construirTextoCantidad(
    cantidad,
    singular,
    plural
) {

    if (cantidad === 1) {

        return cantidad + " " + singular;
    }

    return cantidad + " " + plural;
}


function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escaparTextoEmpleado(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function limitarPorcentaje(valor) {

    const numero =
        Number(valor);

    if (Number.isNaN(numero)) {

        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(numero)
        )
    );
}
/*
==================================================
OPORTUNIDADES RECOMENDADAS
==================================================
*/

function actualizarOportunidadesEmpleado() {

    const oportunidades =
        obtenerOportunidadesPublicadas();

    const habilidades =
        obtenerHabilidadesDashboard();

    const elementoNumero =
        document.getElementById(
            "numeroOportunidadesEmpleado"
        );

    const elementoDetalle =
        document.getElementById(
            "detalleOportunidadesEmpleado"
        );

    const contenedor =
        document.getElementById(
            "listaRecomendacionesEmpleado"
        );


    if (habilidades.length === 0) {

        if (elementoNumero) {
            elementoNumero.textContent = "0";
        }

        if (elementoDetalle) {
            elementoDetalle.textContent =
                "Completa tus habilidades";
        }

        if (contenedor) {

            contenedor.innerHTML = `
                <div class="tabla-vacia">
                    Completa tu perfil de habilidades
                    para recibir recomendaciones.
                </div>
            `;
        }

        return;
    }


    const recomendaciones =
        oportunidades
            .map(
                function (oportunidad) {

                    return calcularCompatibilidadDashboard(
                        oportunidad,
                        habilidades
                    );
                }
            )
            .filter(
                function (resultado) {

                    return resultado.compatibilidad > 0;
                }
            )
            .sort(
                function (a, b) {

                    return (
                        b.compatibilidad -
                        a.compatibilidad
                    );
                }
            );


    if (elementoNumero) {

        elementoNumero.textContent =
            recomendaciones.length;
    }


    if (elementoDetalle) {

        elementoDetalle.textContent =
            recomendaciones.length === 1
                ? "1 proyecto compatible"
                : recomendaciones.length +
                  " proyectos compatibles";
    }


    if (!contenedor) {

        return;
    }


    if (recomendaciones.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay oportunidades compatibles disponibles.
            </div>
        `;

        return;
    }


    contenedor.innerHTML =
        recomendaciones
            .slice(0, 3)
            .map(
                function (resultado) {

                    return `
                        <article class="proyecto">

                            <div class="proyecto-superior">

                                <div>

                                    <strong>
                                        ${escaparTextoEmpleado(
                                            resultado.oportunidad.titulo ||
                                            "Proyecto sin título"
                                        )}
                                    </strong>

                                    <small>
                                        Rol recomendado:
                                        ${escaparTextoEmpleado(
                                            resultado.rol
                                        )}
                                    </small>

                                </div>

                                <span class="porcentaje">
                                    ${resultado.compatibilidad}%
                                </span>

                            </div>

                            <div class="barra-progreso">

                                <span
                                    style="width:
                                        ${resultado.compatibilidad}%"
                                ></span>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


function obtenerOportunidadesPublicadas() {

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

                    return (
                        normalizarTexto(
                            oportunidad.estado
                        ) === "publicada"
                    );
                }
            )
            : [];

    } catch (error) {

        return [];
    }
}


function obtenerHabilidadesDashboard() {

    const correo =
        localStorage.getItem(
            "octoflowCorreo"
        );

    const datos =
        localStorage.getItem(
            "octoflowHabilidades"
        );

    if (!correo || !datos) {

        return [];
    }

    try {

        const habilidades =
            JSON.parse(datos);

        return habilidades.filter(
            function (habilidad) {

                return (
                    normalizarTexto(
                        habilidad.correo
                    ) ===
                    normalizarTexto(correo)
                );
            }
        );

    } catch (error) {

        return [];
    }
}


function calcularCompatibilidadDashboard(
    oportunidad,
    habilidades
) {

    const herramientas =
        Array.isArray(
            oportunidad.herramientas
        )
            ? oportunidad.herramientas
            : [];

    let coincidenciasExperiencia = 0;
    let coincidenciasAprendizaje = 0;

    herramientas.forEach(
        function (herramientaProyecto) {

            const habilidad =
                habilidades.find(
                    function (registro) {

                        return (
                            normalizarTexto(
                                registro.herramienta
                            ) ===
                            normalizarTexto(
                                herramientaProyecto
                            )
                        );
                    }
                );

            if (!habilidad) {

                return;
            }

            const nivel =
                normalizarTexto(
                    habilidad.nivel
                );

            const objetivo =
                normalizarTexto(
                    habilidad.objetivo
                );


            if (
                nivel === "avanzado" ||
                nivel === "experto"
            ) {

                coincidenciasExperiencia++;
            }


            if (
                objetivo.includes("aprender") ||
                objetivo.includes("mejorar")
            ) {

                coincidenciasAprendizaje++;
            }
        }
    );


    const totalHerramientas =
        Math.max(
            herramientas.length,
            1
        );


    const porcentajeExperiencia =
        (
            coincidenciasExperiencia /
            totalHerramientas
        ) * 60;


    const porcentajeAprendizaje =
        (
            coincidenciasAprendizaje /
            totalHerramientas
        ) * 40;


    const compatibilidad =
        Math.round(
            porcentajeExperiencia +
            porcentajeAprendizaje
        );


    let rol = "Contributor";


    if (coincidenciasExperiencia > 0) {

        rol = "Champion";

    } else if (
        coincidenciasAprendizaje > 0
    ) {

        rol = "Learner";
    }


    return {

        oportunidad: oportunidad,

        compatibilidad: compatibilidad,

        rol: rol

    };
}