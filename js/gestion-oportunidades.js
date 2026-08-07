/*
==================================================
OCTOFLOW - GESTIÓN DE OPORTUNIDADES DEL GERENTE
==================================================
*/

let oportunidadGerenteSeleccionada = null;
let vistaOportunidadesGerente = "publicadas";


document.addEventListener(
    "DOMContentLoaded",
    iniciarGestionOportunidades
);


/*
==================================================
INICIAR
==================================================
*/

function iniciarGestionOportunidades() {

    configurarPestanasOportunidadesGerente();

    configurarFiltrosOportunidadesGerente();

    configurarPanelFormularioOportunidad();

    cargarIdeasAprobadasOportunidad();

    actualizarGestionOportunidades();
}


/*
==================================================
ALMACENAMIENTO
==================================================
*/

function leerColeccionOportunidades(
    clave
) {

    try {

        const datos =
            JSON.parse(
                localStorage.getItem(
                    clave
                ) || "[]"
            );

        return Array.isArray(datos)
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


function guardarColeccionOportunidades(
    clave,
    datos
) {

    localStorage.setItem(
        clave,
        JSON.stringify(
            datos
        )
    );
}


function obtenerOportunidadesGerente() {

    return leerColeccionOportunidades(
        "octoflowOportunidades"
    );
}


function guardarOportunidadesGerente(
    oportunidades
) {

    guardarColeccionOportunidades(
        "octoflowOportunidades",
        oportunidades
    );
}


function obtenerIdeasGerente() {

    return leerColeccionOportunidades(
        "octoflowIdeas"
    );
}


function obtenerPostulacionesGerente() {

    return leerColeccionOportunidades(
        "octoflowPostulaciones"
    );
}


function obtenerProyectosOportunidades() {

    return leerColeccionOportunidades(
        "octoflowProyectos"
    );
}


/*
==================================================
SESIÓN
==================================================
*/

function obtenerCorreoGerenteOportunidad() {

    return sessionStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


function obtenerNombreGerenteOportunidad() {

    return (
        sessionStorage.getItem(
            "octoflowNombreCompleto"
        ) ||
        convertirCorreoNombreOportunidad(
            obtenerCorreoGerenteOportunidad()
        )
    );
}


/*
==================================================
ACTUALIZAR MÓDULO
==================================================
*/

function actualizarGestionOportunidades() {

    actualizarIndicadoresOportunidades();

    actualizarContadoresPestanasOportunidad();

    cargarAreasFiltroOportunidades();

    mostrarOportunidadesGerente();
}


/*
==================================================
CLASIFICAR OPORTUNIDADES
==================================================
*/

function obtenerEstadoOportunidad(
    oportunidad
) {

    return normalizarOportunidadGerente(
        oportunidad.estado ||
        "Borrador"
    );
}


function oportunidadesPublicadasGerente() {

    return obtenerOportunidadesGerente()
        .filter(
            function (oportunidad) {

                return obtenerEstadoOportunidad(
                    oportunidad
                ) === "publicada";
            }
        );
}


function oportunidadesBorradorGerente() {

    return obtenerOportunidadesGerente()
        .filter(
            function (oportunidad) {

                return obtenerEstadoOportunidad(
                    oportunidad
                ) === "borrador";
            }
        );
}


function oportunidadesPausadasGerente() {

    return obtenerOportunidadesGerente()
        .filter(
            function (oportunidad) {

                return obtenerEstadoOportunidad(
                    oportunidad
                ) === "pausada";
            }
        );
}


function oportunidadesCerradasGerente() {

    return obtenerOportunidadesGerente()
        .filter(
            function (oportunidad) {

                const estado =
                    obtenerEstadoOportunidad(
                        oportunidad
                    );

                return (
                    estado === "cerrada" ||
                    estado === "en proyecto" ||
                    estado === "cancelada"
                );
            }
        );
}


function obtenerOportunidadesVistaActual() {

    if (
        vistaOportunidadesGerente ===
        "borradores"
    ) {

        return oportunidadesBorradorGerente();
    }

    if (
        vistaOportunidadesGerente ===
        "pausadas"
    ) {

        return oportunidadesPausadasGerente();
    }

    if (
        vistaOportunidadesGerente ===
        "cerradas"
    ) {

        return oportunidadesCerradasGerente();
    }

    return oportunidadesPublicadasGerente();
}


/*
==================================================
INDICADORES
==================================================
*/

function actualizarIndicadoresOportunidades() {

    const oportunidades =
        obtenerOportunidadesGerente();

    const postulaciones =
        obtenerPostulacionesGerente();

    asignarTextoOportunidadGerente(
        "totalOportunidadesPublicadas",
        oportunidades.filter(
            function (oportunidad) {

                return obtenerEstadoOportunidad(
                    oportunidad
                ) === "publicada";
            }
        ).length
    );

    asignarTextoOportunidadGerente(
        "totalOportunidadesBorrador",
        oportunidades.filter(
            function (oportunidad) {

                return obtenerEstadoOportunidad(
                    oportunidad
                ) === "borrador";
            }
        ).length
    );

    asignarTextoOportunidadGerente(
        "totalPostulacionesOportunidades",
        postulaciones.length
    );

    asignarTextoOportunidadGerente(
        "totalOportunidadesCerradas",
        oportunidades.filter(
            function (oportunidad) {

                return [
                    "cerrada",
                    "en proyecto",
                    "cancelada"
                ].includes(
                    obtenerEstadoOportunidad(
                        oportunidad
                    )
                );
            }
        ).length
    );
}


function actualizarContadoresPestanasOportunidad() {

    asignarTextoOportunidadGerente(
        "contadorPestanaPublicadas",
        oportunidadesPublicadasGerente()
            .length
    );

    asignarTextoOportunidadGerente(
        "contadorPestanaBorradores",
        oportunidadesBorradorGerente()
            .length
    );

    asignarTextoOportunidadGerente(
        "contadorPestanaPausadas",
        oportunidadesPausadasGerente()
            .length
    );

    asignarTextoOportunidadGerente(
        "contadorPestanaCerradas",
        oportunidadesCerradasGerente()
            .length
    );
}


/*
==================================================
PESTAÑAS
==================================================
*/

function configurarPestanasOportunidadesGerente() {

    document
        .querySelectorAll(
            "[data-vista-oportunidad]"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        cambiarVistaOportunidadesGerente(
                            boton.dataset
                                .vistaOportunidad
                        );
                    }
                );
            }
        );
}


function cambiarVistaOportunidadesGerente(
    vista
) {

    vistaOportunidadesGerente =
        vista;

    document
        .querySelectorAll(
            "[data-vista-oportunidad]"
        )
        .forEach(
            function (boton) {

                boton.classList.toggle(
                    "activa",
                    boton.dataset
                        .vistaOportunidad ===
                        vista
                );
            }
        );

    const configuracion = {

        publicadas: {
            titulo:
                "Oportunidades publicadas",

            descripcion:
                "Convocatorias visibles para los colaboradores."
        },

        borradores: {
            titulo:
                "Borradores",

            descripcion:
                "Oportunidades que todavía no se han publicado."
        },

        pausadas: {
            titulo:
                "Oportunidades pausadas",

            descripcion:
                "Convocatorias temporalmente no disponibles."
        },

        cerradas: {
            titulo:
                "Oportunidades cerradas",

            descripcion:
                "Oportunidades finalizadas o convertidas en proyecto."
        }

    };

    const datos =
        configuracion[vista] ||
        configuracion.publicadas;

    asignarTextoOportunidadGerente(
        "tituloVistaOportunidadesGerente",
        datos.titulo
    );

    asignarTextoOportunidadGerente(
        "descripcionVistaOportunidadesGerente",
        datos.descripcion
    );

    mostrarOportunidadesGerente();
}


/*
==================================================
FILTROS
==================================================
*/

function configurarFiltrosOportunidadesGerente() {

    const buscador =
        document.getElementById(
            "buscarOportunidadGerente"
        );

    const filtroArea =
        document.getElementById(
            "filtroAreaOportunidadGerente"
        );

    const filtroPrioridad =
        document.getElementById(
            "filtroPrioridadOportunidadGerente"
        );

    const orden =
        document.getElementById(
            "ordenOportunidadesGerente"
        );

    buscador?.addEventListener(
        "input",
        mostrarOportunidadesGerente
    );

    filtroArea?.addEventListener(
        "change",
        mostrarOportunidadesGerente
    );

    filtroPrioridad?.addEventListener(
        "change",
        mostrarOportunidadesGerente
    );

    orden?.addEventListener(
        "change",
        mostrarOportunidadesGerente
    );

    document
        .getElementById(
            "limpiarFiltrosOportunidadesGerente"
        )
        ?.addEventListener(
            "click",
            function () {

                if (buscador) {
                    buscador.value = "";
                }

                if (filtroArea) {
                    filtroArea.value = "";
                }

                if (filtroPrioridad) {
                    filtroPrioridad.value = "";
                }

                if (orden) {
                    orden.value = "recientes";
                }

                mostrarOportunidadesGerente();
            }
        );
}


function cargarAreasFiltroOportunidades() {

    const selector =
        document.getElementById(
            "filtroAreaOportunidadGerente"
        );

    if (!selector) {
        return;
    }

    const valorActual =
        selector.value;

    const areas =
        [
            ...new Set(
                obtenerOportunidadesGerente()
                    .map(
                        function (oportunidad) {

                            return String(
                                oportunidad.area ||
                                ""
                            ).trim();
                        }
                    )
                    .filter(Boolean)
            )
        ]
            .sort(
                function (a, b) {

                    return a.localeCompare(
                        b,
                        "es"
                    );
                }
            );

    selector.innerHTML = `
        <option value="">
            Todas las áreas
        </option>
    `;

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
        areas.includes(
            valorActual
        )
    ) {

        selector.value =
            valorActual;
    }
}


function obtenerOportunidadesFiltradasGerente() {

    const busqueda =
        normalizarOportunidadGerente(
            document
                .getElementById(
                    "buscarOportunidadGerente"
                )
                ?.value || ""
        );

    const area =
        normalizarOportunidadGerente(
            document
                .getElementById(
                    "filtroAreaOportunidadGerente"
                )
                ?.value || ""
        );

    const prioridad =
        normalizarOportunidadGerente(
            document
                .getElementById(
                    "filtroPrioridadOportunidadGerente"
                )
                ?.value || ""
        );

    const orden =
        document
            .getElementById(
                "ordenOportunidadesGerente"
            )
            ?.value ||
        "recientes";

    const resultados =
        obtenerOportunidadesVistaActual()
            .filter(
                function (oportunidad) {

                    const texto =
                        normalizarOportunidadGerente(
                            [
                                oportunidad.id,
                                oportunidad.titulo,
                                oportunidad.nombre,
                                oportunidad.area,
                                oportunidad.descripcion,
                                oportunidad.objetivo,
                                ...(
                                    Array.isArray(
                                        oportunidad.herramientas
                                    )
                                        ? oportunidad.herramientas
                                        : []
                                )
                            ].join(" ")
                        );

                    const coincideBusqueda =
                        !busqueda ||
                        texto.includes(
                            busqueda
                        );

                    const coincideArea =
                        !area ||
                        normalizarOportunidadGerente(
                            oportunidad.area
                        ) === area;

                    const coincidePrioridad =
                        !prioridad ||
                        normalizarOportunidadGerente(
                            oportunidad.prioridad
                        ) === prioridad;

                    return (
                        coincideBusqueda &&
                        coincideArea &&
                        coincidePrioridad
                    );
                }
            );

    resultados.sort(
        function (a, b) {

            if (orden === "nombre") {

                return String(
                    a.titulo ||
                    a.nombre ||
                    ""
                ).localeCompare(
                    String(
                        b.titulo ||
                        b.nombre ||
                        ""
                    ),
                    "es"
                );
            }

            if (
                orden ===
                "postulaciones"
            ) {

                return (
                    obtenerNumeroPostulacionesOportunidad(
                        b.id
                    ) -
                    obtenerNumeroPostulacionesOportunidad(
                        a.id
                    )
                );
            }

            return (
                new Date(
                    b.fechaActualizacion ||
                    b.fechaPublicacion ||
                    b.fechaCreacion ||
                    0
                ) -
                new Date(
                    a.fechaActualizacion ||
                    a.fechaPublicacion ||
                    a.fechaCreacion ||
                    0
                )
            );
        }
    );

    return resultados;
}


/*
==================================================
MOSTRAR OPORTUNIDADES
==================================================
*/

function mostrarOportunidadesGerente() {

    const contenedor =
        document.getElementById(
            "listaOportunidadesGerente"
        );

    if (!contenedor) {
        return;
    }

    const oportunidades =
        obtenerOportunidadesFiltradasGerente();

    asignarTextoOportunidadGerente(
        "contadorOportunidadesGerente",
        oportunidades.length === 1
            ? "1 oportunidad"
            : oportunidades.length +
              " oportunidades"
    );

    if (
        oportunidades.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No existen oportunidades en esta sección.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        oportunidades
            .map(
                crearTarjetaOportunidadGerente
            )
            .join("");
}


function crearTarjetaOportunidadGerente(
    oportunidad
) {

    const estado =
        oportunidad.estado ||
        "Borrador";

    const claseEstado =
        normalizarOportunidadGerente(
            estado
        )
            .replace(
                /\s+/g,
                "-"
            );

    const herramientas =
        Array.isArray(
            oportunidad.herramientas
        )
            ? oportunidad.herramientas
            : [];

    const postulaciones =
        obtenerPostulacionesPorOportunidad(
            oportunidad.id
        );

    const aceptadosChampion =
        contarPostulacionesAceptadasRol(
            oportunidad.id,
            "Champion"
        );

    const aceptadosLearner =
        contarPostulacionesAceptadasRol(
            oportunidad.id,
            "Learner"
        );

    const aceptadosContributor =
        contarPostulacionesAceptadasRol(
            oportunidad.id,
            "Contributor"
        );

    const vacantesChampion =
        obtenerNumeroSeguro(
            oportunidad.vacantesChampion,
            oportunidad.championRequerido
                ? 1
                : 0
        );

    const vacantesLearner =
        obtenerNumeroSeguro(
            oportunidad.vacantesLearner,
            oportunidad.learnerRequerido
                ? 1
                : 0
        );

    const vacantesContributor =
        obtenerNumeroSeguro(
            oportunidad.vacantesContributor,
            0
        );

    return `
        <article
            class="
                tarjeta-oportunidad-gerente
                ${claseEstado}
            "
        >

            <div class="cabecera-tarjeta-oportunidad">

                <div>

                    <span class="codigo-oportunidad-gerente">
                        ${escaparOportunidadGerente(
                            oportunidad.id
                        )}
                    </span>

                    <h3>
                        ${escaparOportunidadGerente(
                            oportunidad.titulo ||
                            oportunidad.nombre ||
                            "Oportunidad"
                        )}
                    </h3>

                </div>

                <span
                    class="
                        estado-oportunidad-gerente
                        ${claseEstado}
                    "
                >
                    ${escaparOportunidadGerente(
                        estado
                    )}
                </span>

            </div>

            <div class="meta-oportunidad-gerente">

                <span>
                    ${escaparOportunidadGerente(
                        oportunidad.area ||
                        "Sin área"
                    )}
                </span>

                <span>
                    Prioridad:
                    ${escaparOportunidadGerente(
                        oportunidad.prioridad ||
                        "Media"
                    )}
                </span>

                <span>
                    ${escaparOportunidadGerente(
                        oportunidad.duracion ||
                        "Sin duración"
                    )}
                </span>

                <span>
                    ${Number(
                        oportunidad.disponibilidad ||
                        0
                    )}
                    h/sem.
                </span>

                ${
                    oportunidad.fechaLimite
                        ? `
                            <span>
                                Límite:
                                ${formatearFechaOportunidadGerente(
                                    oportunidad.fechaLimite
                                )}
                            </span>
                        `
                        : ""
                }

            </div>

            <p class="descripcion-oportunidad-gerente">
                ${escaparOportunidadGerente(
                    oportunidad.descripcion ||
                    "Sin descripción."
                )}
            </p>

            <div class="herramientas-oportunidad-gerente">

                ${
                    herramientas.length > 0
                        ? herramientas
                            .map(
                                function (herramienta) {

                                    return `
                                        <span>
                                            ${escaparOportunidadGerente(
                                                herramienta
                                            )}
                                        </span>
                                    `;
                                }
                            )
                            .join("")
                        : `
                            <span>
                                Sin herramientas definidas
                            </span>
                        `
                }

            </div>

            <div class="vacantes-oportunidad-gerente">

                <div class="vacante-oportunidad">

                    <span>
                        Champion
                    </span>

                    <strong>
                        ${aceptadosChampion}/${vacantesChampion}
                    </strong>

                </div>

                <div class="vacante-oportunidad">

                    <span>
                        Learner
                    </span>

                    <strong>
                        ${aceptadosLearner}/${vacantesLearner}
                    </strong>

                </div>

                <div class="vacante-oportunidad">

                    <span>
                        Contributor
                    </span>

                    <strong>
                        ${aceptadosContributor}/${vacantesContributor}
                    </strong>

                </div>

            </div>

            <div class="resumen-postulaciones-oportunidad">

                <span>
                    Postulaciones recibidas
                </span>

                <strong>
                    ${postulaciones.length}
                </strong>

            </div>

            <div class="acciones-oportunidad-gerente">

                ${
                    obtenerEstadoOportunidad(
                        oportunidad
                    ) !== "en proyecto"
                        ? `
                            <button
                                class="boton-editar-oportunidad"
                                type="button"
                                onclick="
                                    editarOportunidadGerente(
                                        '${escaparAtributoOportunidadGerente(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Editar
                            </button>
                        `
                        : ""
                }

                ${
                    obtenerEstadoOportunidad(
                        oportunidad
                    ) === "borrador"
                        ? `
                            <button
                                class="boton-publicar-oportunidad"
                                type="button"
                                onclick="
                                    publicarOportunidadExistente(
                                        '${escaparAtributoOportunidadGerente(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Publicar
                            </button>
                        `
                        : ""
                }

                ${
                    obtenerEstadoOportunidad(
                        oportunidad
                    ) === "publicada"
                        ? `
                            <button
                                class="boton-pausar-oportunidad"
                                type="button"
                                onclick="
                                    pausarOportunidadGerente(
                                        '${escaparAtributoOportunidadGerente(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Pausar
                            </button>
                        `
                        : ""
                }

                ${
                    obtenerEstadoOportunidad(
                        oportunidad
                    ) === "pausada"
                        ? `
                            <button
                                class="boton-publicar-oportunidad"
                                type="button"
                                onclick="
                                    reactivarOportunidadGerente(
                                        '${escaparAtributoOportunidadGerente(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Reactivar
                            </button>
                        `
                        : ""
                }

                ${
                    [
                        "publicada",
                        "pausada",
                        "borrador"
                    ].includes(
                        obtenerEstadoOportunidad(
                            oportunidad
                        )
                    )
                        ? `
                            <button
                                class="boton-cerrar-oportunidad"
                                type="button"
                                onclick="
                                    cerrarOportunidadGerente(
                                        '${escaparAtributoOportunidadGerente(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Cerrar
                            </button>
                        `
                        : ""
                }

                <a
                    class="boton-postulaciones-oportunidad"
                    href="postulaciones-gerente.html"
                    onclick="
                        guardarFiltroPostulacionesOportunidad(
                            '${escaparAtributoOportunidadGerente(
                                oportunidad.id
                            )}'
                        );
                    "
                >
                    Ver postulaciones
                </a>

                ${
                    obtenerEstadoOportunidad(
                        oportunidad
                    ) !== "en proyecto"
                        ? `
                            <button
                                class="boton-eliminar-oportunidad"
                                type="button"
                                onclick="
                                    eliminarOportunidadGerente(
                                        '${escaparAtributoOportunidadGerente(
                                            oportunidad.id
                                        )}'
                                    );
                                "
                            >
                                Eliminar
                            </button>
                        `
                        : ""
                }

            </div>

        </article>
    `;
}


/*
==================================================
POSTULACIONES
==================================================
*/

function obtenerIdOportunidadPostulacionGerente(
    postulacion
) {

    return (
        postulacion.oportunidadId ||
        postulacion.idOportunidad ||
        postulacion.proyectoId ||
        ""
    );
}


function obtenerPostulacionesPorOportunidad(
    oportunidadId
) {

    return obtenerPostulacionesGerente()
        .filter(
            function (postulacion) {

                return String(
                    obtenerIdOportunidadPostulacionGerente(
                        postulacion
                    )
                ) === String(
                    oportunidadId
                );
            }
        );
}


function obtenerNumeroPostulacionesOportunidad(
    oportunidadId
) {

    return obtenerPostulacionesPorOportunidad(
        oportunidadId
    ).length;
}


function contarPostulacionesAceptadasRol(
    oportunidadId,
    rol
) {

    return obtenerPostulacionesPorOportunidad(
        oportunidadId
    )
        .filter(
            function (postulacion) {

                const estado =
                    normalizarOportunidadGerente(
                        postulacion.estado
                    );

                const rolPostulacion =
                    normalizarOportunidadGerente(
                        postulacion.rolAsignado ||
                        postulacion.rolSolicitado ||
                        postulacion.rol
                    );

                return (
                    estado === "aceptado" &&
                    rolPostulacion ===
                    normalizarOportunidadGerente(
                        rol
                    )
                );
            }
        )
        .length;
}


function guardarFiltroPostulacionesOportunidad(
    oportunidadId
) {

    sessionStorage.setItem(
        "octoflowFiltroOportunidadPostulaciones",
        oportunidadId
    );
}


/*
==================================================
IDEAS APROBADAS
==================================================
*/

function obtenerIdeasAprobadasSinOportunidad() {

    const oportunidades =
        obtenerOportunidadesGerente();

    const ideasUsadas =
        new Set(
            oportunidades
                .map(
                    function (oportunidad) {

                        return String(
                            oportunidad.ideaId ||
                            ""
                        );
                    }
                )
                .filter(Boolean)
        );

    return obtenerIdeasGerente()
        .filter(
            function (idea) {

                const estado =
                    normalizarOportunidadGerente(
                        idea.estado
                    );

                return (
                    (
                        estado === "aprobada" ||
                        estado === "aprobado"
                    )
                    &&
                    !ideasUsadas.has(
                        String(
                            idea.id
                        )
                    )
                );
            }
        );
}


function cargarIdeasAprobadasOportunidad(
    incluirIdeaId = ""
) {

    const selector =
        document.getElementById(
            "ideaOrigenOportunidad"
        );

    if (!selector) {
        return;
    }

    const ideas =
        obtenerIdeasAprobadasSinOportunidad();

    if (incluirIdeaId) {

        const ideaExistente =
            obtenerIdeasGerente()
                .find(
                    function (idea) {

                        return String(
                            idea.id
                        ) === String(
                            incluirIdeaId
                        );
                    }
                );

        if (
            ideaExistente &&
            !ideas.some(
                function (idea) {

                    return String(
                        idea.id
                    ) === String(
                        incluirIdeaId
                    );
                }
            )
        ) {

            ideas.push(
                ideaExistente
            );
        }
    }

    selector.innerHTML = `
        <option value="">
            Sin idea de origen
        </option>
    `;

    ideas
        .sort(
            function (a, b) {

                return String(
                    a.titulo ||
                    a.nombre ||
                    ""
                ).localeCompare(
                    String(
                        b.titulo ||
                        b.nombre ||
                        ""
                    ),
                    "es"
                );
            }
        )
        .forEach(
            function (idea) {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    idea.id;

                opcion.textContent =
                    (
                        idea.id
                            ? idea.id +
                              " · "
                            : ""
                    ) +
                    (
                        idea.titulo ||
                        idea.nombre ||
                        idea.propuesta ||
                        "Idea aprobada"
                    );

                selector.appendChild(
                    opcion
                );
            }
        );
}


function seleccionarIdeaOrigenOportunidad() {

    const ideaId =
        obtenerValorOportunidadGerente(
            "ideaOrigenOportunidad"
        );

    const resumen =
        document.getElementById(
            "resumenIdeaOrigenOportunidad"
        );

    if (!ideaId) {

        resumen?.classList.remove(
            "visible"
        );

        return;
    }

    const idea =
        obtenerIdeasGerente()
            .find(
                function (registro) {

                    return String(
                        registro.id
                    ) === String(
                        ideaId
                    );
                }
            );

    if (!idea) {

        resumen?.classList.remove(
            "visible"
        );

        return;
    }

    asignarTextoOportunidadGerente(
        "tituloIdeaOrigenOportunidad",
        idea.titulo ||
        idea.nombre ||
        idea.propuesta ||
        "Idea aprobada"
    );

    asignarTextoOportunidadGerente(
        "descripcionIdeaOrigenOportunidad",
        idea.descripcion ||
        idea.detalle ||
        idea.problema ||
        "Sin descripción."
    );

    resumen?.classList.add(
        "visible"
    );

    if (
        !obtenerValorOportunidadGerente(
            "tituloOportunidadGerente"
        )
    ) {

        asignarValorOportunidadGerente(
            "tituloOportunidadGerente",
            idea.titulo ||
            idea.nombre ||
            idea.propuesta ||
            ""
        );
    }

    if (
        !obtenerValorOportunidadGerente(
            "areaOportunidadGerente"
        )
    ) {

        asignarValorOportunidadGerente(
            "areaOportunidadGerente",
            idea.area ||
            ""
        );
    }

    if (
        !obtenerValorOportunidadGerente(
            "descripcionOportunidadGerente"
        )
    ) {

        asignarValorOportunidadGerente(
            "descripcionOportunidadGerente",
            idea.descripcion ||
            idea.detalle ||
            idea.problema ||
            ""
        );
    }

    if (
        !obtenerValorOportunidadGerente(
            "objetivoOportunidadGerente"
        )
    ) {

        asignarValorOportunidadGerente(
            "objetivoOportunidadGerente",
            idea.objetivo ||
            idea.beneficio ||
            idea.resultadoEsperado ||
            ""
        );
    }
}


/*
==================================================
CONFIGURAR FORMULARIO
==================================================
*/

function configurarPanelFormularioOportunidad() {

    document
        .getElementById(
            "crearNuevaOportunidad"
        )
        ?.addEventListener(
            "click",
            abrirNuevaOportunidadGerente
        );

    document
        .getElementById(
            "cerrarPanelFormularioOportunidad"
        )
        ?.addEventListener(
            "click",
            cerrarFormularioOportunidadGerente
        );

    document
        .getElementById(
            "cancelarFormularioOportunidad"
        )
        ?.addEventListener(
            "click",
            cerrarFormularioOportunidadGerente
        );

    document
        .getElementById(
            "guardarBorradorOportunidad"
        )
        ?.addEventListener(
            "click",
            function () {

                guardarFormularioOportunidad(
                    "Borrador"
                );
            }
        );

    document
        .getElementById(
            "publicarOportunidadGerente"
        )
        ?.addEventListener(
            "click",
            function () {

                guardarFormularioOportunidad(
                    "Publicada"
                );
            }
        );

    document
        .getElementById(
            "ideaOrigenOportunidad"
        )
        ?.addEventListener(
            "change",
            seleccionarIdeaOrigenOportunidad
        );

    document
        .getElementById(
            "panelFormularioOportunidad"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "panelFormularioOportunidad"
                ) {

                    cerrarFormularioOportunidadGerente();
                }
            }
        );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape"
            ) {

                cerrarFormularioOportunidadGerente();
            }
        }
    );
}


/*
==================================================
NUEVA OPORTUNIDAD
==================================================
*/

function abrirNuevaOportunidadGerente() {

    oportunidadGerenteSeleccionada =
        null;

    limpiarFormularioOportunidadGerente();

    cargarIdeasAprobadasOportunidad();

    asignarTextoOportunidadGerente(
        "tituloPanelFormularioOportunidad",
        "Nueva oportunidad"
    );

    asignarValorOportunidadGerente(
        "prioridadOportunidadGerente",
        "Media"
    );

    asignarValorOportunidadGerente(
        "vacantesChampionOportunidad",
        1
    );

    asignarValorOportunidadGerente(
        "vacantesLearnerOportunidad",
        1
    );

    asignarValorOportunidadGerente(
        "vacantesContributorOportunidad",
        0
    );

    asignarValorOportunidadGerente(
        "disponibilidadOportunidadGerente",
        4
    );

    asignarValorOportunidadGerente(
        "dificultadOportunidadGerente",
        "Intermedia"
    );

    const fechaLimite =
        new Date();

    fechaLimite.setDate(
        fechaLimite.getDate() + 30
    );

    asignarValorOportunidadGerente(
        "fechaLimiteOportunidadGerente",
        fechaLimite
            .toISOString()
            .split("T")[0]
    );

    abrirPanelOportunidadGerente();
}


/*
==================================================
EDITAR OPORTUNIDAD
==================================================
*/

function editarOportunidadGerente(
    oportunidadId
) {

    const oportunidad =
        obtenerOportunidadesGerente()
            .find(
                function (registro) {

                    return String(
                        registro.id
                    ) === String(
                        oportunidadId
                    );
                }
            );

    if (!oportunidad) {

        mostrarNotificacion(
            "No fue posible encontrar la oportunidad."
        );

        return;
    }

    oportunidadGerenteSeleccionada =
        oportunidad;

    limpiarFormularioOportunidadGerente();

    cargarIdeasAprobadasOportunidad(
        oportunidad.ideaId ||
        ""
    );

    asignarTextoOportunidadGerente(
        "tituloPanelFormularioOportunidad",
        "Editar oportunidad"
    );

    asignarValorOportunidadGerente(
        "ideaOrigenOportunidad",
        oportunidad.ideaId ||
        ""
    );

    asignarValorOportunidadGerente(
        "tituloOportunidadGerente",
        oportunidad.titulo ||
        oportunidad.nombre ||
        ""
    );

    asignarValorOportunidadGerente(
        "areaOportunidadGerente",
        oportunidad.area ||
        ""
    );

    asignarValorOportunidadGerente(
        "prioridadOportunidadGerente",
        oportunidad.prioridad ||
        "Media"
    );

    asignarValorOportunidadGerente(
        "descripcionOportunidadGerente",
        oportunidad.descripcion ||
        ""
    );

    asignarValorOportunidadGerente(
        "objetivoOportunidadGerente",
        oportunidad.objetivo ||
        ""
    );

    asignarValorOportunidadGerente(
        "herramientasOportunidadGerente",
        (
            Array.isArray(
                oportunidad.herramientas
            )
                ? oportunidad.herramientas
                : []
        ).join(", ")
    );

    asignarValorOportunidadGerente(
        "vacantesChampionOportunidad",
        obtenerNumeroSeguro(
            oportunidad.vacantesChampion,
            oportunidad.championRequerido
                ? 1
                : 0
        )
    );

    asignarValorOportunidadGerente(
        "vacantesLearnerOportunidad",
        obtenerNumeroSeguro(
            oportunidad.vacantesLearner,
            oportunidad.learnerRequerido
                ? 1
                : 0
        )
    );

    asignarValorOportunidadGerente(
        "vacantesContributorOportunidad",
        obtenerNumeroSeguro(
            oportunidad.vacantesContributor,
            0
        )
    );

    asignarValorOportunidadGerente(
        "duracionOportunidadGerente",
        oportunidad.duracion ||
        ""
    );

    asignarValorOportunidadGerente(
        "disponibilidadOportunidadGerente",
        oportunidad.disponibilidad ||
        4
    );

    asignarValorOportunidadGerente(
        "dificultadOportunidadGerente",
        oportunidad.dificultad ||
        "Intermedia"
    );

    asignarValorOportunidadGerente(
        "fechaLimiteOportunidadGerente",
        oportunidad.fechaLimite ||
        ""
    );

    asignarValorOportunidadGerente(
        "responsabilidadesChampionOportunidad",
        oportunidad.responsabilidadesChampion ||
        ""
    );

    asignarValorOportunidadGerente(
        "responsabilidadesLearnerOportunidad",
        oportunidad.responsabilidadesLearner ||
        ""
    );

    asignarValorOportunidadGerente(
        "responsabilidadesContributorOportunidad",
        oportunidad.responsabilidadesContributor ||
        ""
    );

    seleccionarIdeaOrigenOportunidad();

    abrirPanelOportunidadGerente();
}


/*
==================================================
GUARDAR FORMULARIO
==================================================
*/

function guardarFormularioOportunidad(
    estadoDestino
) {

    const titulo =
        obtenerValorOportunidadGerente(
            "tituloOportunidadGerente"
        );

    const area =
        obtenerValorOportunidadGerente(
            "areaOportunidadGerente"
        );

    const descripcion =
        obtenerValorOportunidadGerente(
            "descripcionOportunidadGerente"
        );

    const objetivo =
        obtenerValorOportunidadGerente(
            "objetivoOportunidadGerente"
        );

    const herramientas =
        convertirHerramientasOportunidad(
            obtenerValorOportunidadGerente(
                "herramientasOportunidadGerente"
            )
        );

    const vacantesChampion =
        obtenerNumeroCampoOportunidad(
            "vacantesChampionOportunidad"
        );

    const vacantesLearner =
        obtenerNumeroCampoOportunidad(
            "vacantesLearnerOportunidad"
        );

    const vacantesContributor =
        obtenerNumeroCampoOportunidad(
            "vacantesContributorOportunidad"
        );

    const duracion =
        obtenerValorOportunidadGerente(
            "duracionOportunidadGerente"
        );

    const disponibilidad =
        obtenerNumeroCampoOportunidad(
            "disponibilidadOportunidadGerente"
        );

    const fechaLimite =
        obtenerValorOportunidadGerente(
            "fechaLimiteOportunidadGerente"
        );

    const responsabilidadesChampion =
        obtenerValorOportunidadGerente(
            "responsabilidadesChampionOportunidad"
        );

    const responsabilidadesLearner =
        obtenerValorOportunidadGerente(
            "responsabilidadesLearnerOportunidad"
        );

    const responsabilidadesContributor =
        obtenerValorOportunidadGerente(
            "responsabilidadesContributorOportunidad"
        );

    if (!titulo) {

        mostrarMensajeFormularioOportunidad(
            "Escribe el título de la oportunidad.",
            "error"
        );

        return;
    }

    if (
        estadoDestino === "Publicada"
    ) {

        if (
            !area ||
            !descripcion ||
            !objetivo ||
            herramientas.length === 0 ||
            !duracion ||
            disponibilidad <= 0 ||
            !fechaLimite
        ) {

            mostrarMensajeFormularioOportunidad(
                "Para publicar, completa título, área, descripción, objetivo, herramientas, duración, horas semanales y fecha límite.",
                "error"
            );

            return;
        }

        if (
            vacantesChampion +
            vacantesLearner +
            vacantesContributor <= 0
        ) {

            mostrarMensajeFormularioOportunidad(
                "Define por lo menos una vacante.",
                "error"
            );

            return;
        }
    }

    const oportunidades =
        obtenerOportunidadesGerente();

    const ahora =
        new Date().toISOString();

    let oportunidad;

    if (
        oportunidadGerenteSeleccionada
    ) {

        oportunidad =
            oportunidades.find(
                function (registro) {

                    return String(
                        registro.id
                    ) === String(
                        oportunidadGerenteSeleccionada
                            .id
                    );
                }
            );

        if (!oportunidad) {
            return;
        }

    } else {

        oportunidad = {

            id:
                generarIdOportunidadGerente(
                    oportunidades
                ),

            fechaCreacion:
                ahora,

            creadoPor:
                obtenerCorreoGerenteOportunidad(),

            creadoPorNombre:
                obtenerNombreGerenteOportunidad()
        };

        oportunidades.push(
            oportunidad
        );
    }

    const estadoAnterior =
        oportunidad.estado ||
        "";

    oportunidad.ideaId =
        obtenerValorOportunidadGerente(
            "ideaOrigenOportunidad"
        );

    oportunidad.titulo =
        titulo;

    oportunidad.area =
        area;

    oportunidad.prioridad =
        obtenerValorOportunidadGerente(
            "prioridadOportunidadGerente"
        ) || "Media";

    oportunidad.descripcion =
        descripcion;

    oportunidad.objetivo =
        objetivo;

    oportunidad.herramientas =
        herramientas;

    oportunidad.vacantesChampion =
        vacantesChampion;

    oportunidad.vacantesLearner =
        vacantesLearner;

    oportunidad.vacantesContributor =
        vacantesContributor;

    oportunidad.championRequerido =
        vacantesChampion > 0;

    oportunidad.learnerRequerido =
        vacantesLearner > 0;

    oportunidad.duracion =
        duracion;

    oportunidad.disponibilidad =
        disponibilidad;

    oportunidad.dificultad =
        obtenerValorOportunidadGerente(
            "dificultadOportunidadGerente"
        ) || "Intermedia";

    oportunidad.fechaLimite =
        fechaLimite;

    oportunidad.responsabilidadesChampion =
        responsabilidadesChampion;

    oportunidad.responsabilidadesLearner =
        responsabilidadesLearner;

    oportunidad.responsabilidadesContributor =
        responsabilidadesContributor;

    oportunidad.estado =
        estadoDestino;

    oportunidad.fechaActualizacion =
        ahora;

    oportunidad.actualizadoPor =
        obtenerCorreoGerenteOportunidad();

    if (
        estadoDestino === "Publicada" &&
        normalizarOportunidadGerente(
            estadoAnterior
        ) !== "publicada"
    ) {

        oportunidad.fechaPublicacion =
            ahora;
    }

    actualizarIdeaOrigenTrasOportunidad(
        oportunidad
    );

    guardarOportunidadesGerente(
        oportunidades
    );

    cerrarFormularioOportunidadGerente();

    actualizarGestionOportunidades();

    cambiarVistaOportunidadesGerente(
        estadoDestino === "Publicada"
            ? "publicadas"
            : "borradores"
    );

    mostrarNotificacion(
        estadoDestino === "Publicada"
            ? "Oportunidad publicada correctamente."
            : "Borrador guardado correctamente."
    );
}


/*
==================================================
ACTUALIZAR IDEA DE ORIGEN
==================================================
*/

function actualizarIdeaOrigenTrasOportunidad(
    oportunidad
) {

    if (!oportunidad.ideaId) {
        return;
    }

    const ideas =
        obtenerIdeasGerente();

    const idea =
        ideas.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    oportunidad.ideaId
                );
            }
        );

    if (!idea) {
        return;
    }

    idea.oportunidadId =
        oportunidad.id;

    idea.fechaActualizacion =
        new Date().toISOString();

    if (
        normalizarOportunidadGerente(
            oportunidad.estado
        ) === "publicada"
    ) {

        idea.estado =
            "Convertida en oportunidad";
    }

    guardarColeccionOportunidades(
        "octoflowIdeas",
        ideas
    );
}


/*
==================================================
CAMBIAR ESTADOS
==================================================
*/

function publicarOportunidadExistente(
    oportunidadId
) {

    const oportunidades =
        obtenerOportunidadesGerente();

    const oportunidad =
        oportunidades.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    oportunidadId
                );
            }
        );

    if (!oportunidad) {
        return;
    }

    if (
        !validarOportunidadListaParaPublicar(
            oportunidad
        )
    ) {

        mostrarNotificacion(
            "La oportunidad está incompleta. Ábrela con Editar y completa los campos requeridos."
        );

        return;
    }

    oportunidad.estado =
        "Publicada";

    oportunidad.fechaPublicacion =
        oportunidad.fechaPublicacion ||
        new Date().toISOString();

    oportunidad.fechaActualizacion =
        new Date().toISOString();

    guardarOportunidadesGerente(
        oportunidades
    );

    actualizarGestionOportunidades();

    cambiarVistaOportunidadesGerente(
        "publicadas"
    );

    mostrarNotificacion(
        "Oportunidad publicada."
    );
}


function pausarOportunidadGerente(
    oportunidadId
) {

    cambiarEstadoOportunidadGerente(
        oportunidadId,
        "Pausada",
        "Oportunidad pausada."
    );
}


function reactivarOportunidadGerente(
    oportunidadId
) {

    cambiarEstadoOportunidadGerente(
        oportunidadId,
        "Publicada",
        "Oportunidad reactivada."
    );
}


function cerrarOportunidadGerente(
    oportunidadId
) {

    const confirmar =
        window.confirm(
            "¿Deseas cerrar esta oportunidad? Los colaboradores dejarán de verla."
        );

    if (!confirmar) {
        return;
    }

    cambiarEstadoOportunidadGerente(
        oportunidadId,
        "Cerrada",
        "Oportunidad cerrada."
    );
}


function cambiarEstadoOportunidadGerente(
    oportunidadId,
    nuevoEstado,
    mensaje
) {

    const oportunidades =
        obtenerOportunidadesGerente();

    const oportunidad =
        oportunidades.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    oportunidadId
                );
            }
        );

    if (!oportunidad) {
        return;
    }

    oportunidad.estado =
        nuevoEstado;

    oportunidad.fechaActualizacion =
        new Date().toISOString();

    oportunidad.actualizadoPor =
        obtenerCorreoGerenteOportunidad();

    if (
        nuevoEstado === "Publicada"
    ) {

        oportunidad.fechaPublicacion =
            oportunidad.fechaPublicacion ||
            new Date().toISOString();
    }

    if (
        nuevoEstado === "Cerrada"
    ) {

        oportunidad.fechaCierre =
            new Date().toISOString();
    }

    guardarOportunidadesGerente(
        oportunidades
    );

    actualizarGestionOportunidades();

    if (
        nuevoEstado === "Publicada"
    ) {

        cambiarVistaOportunidadesGerente(
            "publicadas"
        );

    } else if (
        nuevoEstado === "Pausada"
    ) {

        cambiarVistaOportunidadesGerente(
            "pausadas"
        );

    } else if (
        nuevoEstado === "Cerrada"
    ) {

        cambiarVistaOportunidadesGerente(
            "cerradas"
        );
    }

    mostrarNotificacion(
        mensaje
    );
}


/*
==================================================
ELIMINAR OPORTUNIDAD
==================================================
*/

function eliminarOportunidadGerente(
    oportunidadId
) {

    const oportunidad =
        obtenerOportunidadesGerente()
            .find(
                function (registro) {

                    return String(
                        registro.id
                    ) === String(
                        oportunidadId
                    );
                }
            );

    if (!oportunidad) {
        return;
    }

    const postulaciones =
        obtenerPostulacionesPorOportunidad(
            oportunidadId
        );

    if (
        postulaciones.length > 0
    ) {

        const confirmarConPostulaciones =
            window.confirm(
                "Esta oportunidad tiene " +
                postulaciones.length +
                " postulaciones. Si la eliminas, también se eliminarán esas postulaciones. ¿Deseas continuar?"
            );

        if (!confirmarConPostulaciones) {
            return;
        }

    } else {

        const confirmar =
            window.confirm(
                '¿Deseas eliminar la oportunidad "' +
                (
                    oportunidad.titulo ||
                    oportunidad.id
                ) +
                '"?'
            );

        if (!confirmar) {
            return;
        }
    }

    const oportunidades =
        obtenerOportunidadesGerente()
            .filter(
                function (registro) {

                    return String(
                        registro.id
                    ) !== String(
                        oportunidadId
                    );
                }
            );

    const nuevasPostulaciones =
        obtenerPostulacionesGerente()
            .filter(
                function (postulacion) {

                    return String(
                        obtenerIdOportunidadPostulacionGerente(
                            postulacion
                        )
                    ) !== String(
                        oportunidadId
                    );
                }
            );

    guardarOportunidadesGerente(
        oportunidades
    );

    guardarColeccionOportunidades(
        "octoflowPostulaciones",
        nuevasPostulaciones
    );

    liberarIdeaOrigenOportunidad(
        oportunidad
    );

    actualizarGestionOportunidades();

    mostrarNotificacion(
        "Oportunidad eliminada."
    );
}


function liberarIdeaOrigenOportunidad(
    oportunidad
) {

    if (!oportunidad.ideaId) {
        return;
    }

    const ideas =
        obtenerIdeasGerente();

    const idea =
        ideas.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    oportunidad.ideaId
                );
            }
        );

    if (!idea) {
        return;
    }

    if (
        String(
            idea.oportunidadId ||
            ""
        ) === String(
            oportunidad.id
        )
    ) {

        idea.oportunidadId =
            "";

        idea.estado =
            "Aprobada";

        idea.fechaActualizacion =
            new Date().toISOString();

        guardarColeccionOportunidades(
            "octoflowIdeas",
            ideas
        );
    }
}


/*
==================================================
VALIDAR PUBLICACIÓN
==================================================
*/

function validarOportunidadListaParaPublicar(
    oportunidad
) {

    const herramientas =
        Array.isArray(
            oportunidad.herramientas
        )
            ? oportunidad.herramientas
            : [];

    const totalVacantes =
        obtenerNumeroSeguro(
            oportunidad.vacantesChampion,
            0
        ) +
        obtenerNumeroSeguro(
            oportunidad.vacantesLearner,
            0
        ) +
        obtenerNumeroSeguro(
            oportunidad.vacantesContributor,
            0
        );

    return Boolean(
        oportunidad.titulo &&
        oportunidad.area &&
        oportunidad.descripcion &&
        oportunidad.objetivo &&
        herramientas.length > 0 &&
        oportunidad.duracion &&
        Number(
            oportunidad.disponibilidad
        ) > 0 &&
        oportunidad.fechaLimite &&
        totalVacantes > 0
    );
}


/*
==================================================
PANEL
==================================================
*/

function abrirPanelOportunidadGerente() {

    const panel =
        document.getElementById(
            "panelFormularioOportunidad"
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


function cerrarFormularioOportunidadGerente() {

    const panel =
        document.getElementById(
            "panelFormularioOportunidad"
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

    oportunidadGerenteSeleccionada =
        null;

    limpiarMensajeFormularioOportunidad();
}


/*
==================================================
LIMPIAR FORMULARIO
==================================================
*/

function limpiarFormularioOportunidadGerente() {

    [
        "ideaOrigenOportunidad",
        "tituloOportunidadGerente",
        "areaOportunidadGerente",
        "descripcionOportunidadGerente",
        "objetivoOportunidadGerente",
        "herramientasOportunidadGerente",
        "duracionOportunidadGerente",
        "fechaLimiteOportunidadGerente",
        "responsabilidadesChampionOportunidad",
        "responsabilidadesLearnerOportunidad",
        "responsabilidadesContributorOportunidad"
    ].forEach(
        function (id) {

            asignarValorOportunidadGerente(
                id,
                ""
            );
        }
    );

    document
        .getElementById(
            "resumenIdeaOrigenOportunidad"
        )
        ?.classList.remove(
            "visible"
        );

    limpiarMensajeFormularioOportunidad();
}


/*
==================================================
MENSAJES
==================================================
*/

function mostrarMensajeFormularioOportunidad(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajeFormularioOportunidad"
        );

    if (!mensaje) {
        return;
    }

    mensaje.className =
        "mensaje-oportunidad-gerente " +
        tipo;

    mensaje.textContent =
        texto;
}


function limpiarMensajeFormularioOportunidad() {

    const mensaje =
        document.getElementById(
            "mensajeFormularioOportunidad"
        );

    if (!mensaje) {
        return;
    }

    mensaje.className =
        "mensaje-oportunidad-gerente";

    mensaje.textContent =
        "";
}


/*
==================================================
UTILIDADES
==================================================
*/

function generarIdOportunidadGerente(
    oportunidades
) {

    let mayor =
        1000;

    oportunidades.forEach(
        function (oportunidad) {

            const numero =
                Number(
                    String(
                        oportunidad.id ||
                        ""
                    )
                        .replace(
                            "OP-",
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

    return "OP-" +
        (mayor + 1);
}


function convertirHerramientasOportunidad(
    texto
) {

    return [
        ...new Set(
            String(
                texto ||
                ""
            )
                .split(",")
                .map(
                    function (herramienta) {

                        return herramienta
                            .trim();
                    }
                )
                .filter(Boolean)
        )
    ];
}


function obtenerNumeroCampoOportunidad(
    id
) {

    const valor =
        Number(
            document
                .getElementById(id)
                ?.value ||
            0
        );

    if (
        Number.isNaN(
            valor
        )
    ) {

        return 0;
    }

    return Math.max(
        0,
        Math.round(
            valor
        )
    );
}


function obtenerNumeroSeguro(
    valor,
    respaldo = 0
) {

    const numero =
        Number(valor);

    if (
        Number.isNaN(
            numero
        )
    ) {

        return respaldo;
    }

    return Math.max(
        0,
        Math.round(
            numero
        )
    );
}


function obtenerValorOportunidadGerente(
    id
) {

    return String(
        document
            .getElementById(id)
            ?.value ||
        ""
    ).trim();
}


function asignarValorOportunidadGerente(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {

        elemento.value =
            valor ?? "";
    }
}


function asignarTextoOportunidadGerente(
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


function normalizarOportunidadGerente(
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


function formatearFechaOportunidadGerente(
    fecha
) {

    if (!fecha) {
        return "Sin fecha";
    }

    const partes =
        String(fecha)
            .split("-");

    if (
        partes.length === 3
    ) {

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


function convertirCorreoNombreOportunidad(
    correo
) {

    return String(
        correo ||
        "Gerente"
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


function escaparOportunidadGerente(
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


function escaparAtributoOportunidadGerente(
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