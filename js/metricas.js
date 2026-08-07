/*
==================================================
OCTOFLOW - MÉTRICAS EJECUTIVAS
==================================================
*/

const CLAVE_CONFIGURACION_METRICAS =
    "octoflowConfiguracionMetricas";

const CONFIGURACION_METRICAS_PREDETERMINADA = {

    horasAnualesFte:
        1760,

    precioHoraGeneral:
        380,

    usarPreciosPorArea:
        true,

    preciosPorArea: {

        Finance:
            650,

        IT:
            520,

        "Supply Chain":
            450,

        Manufacturing:
            300
    }
};


let datosMetricasActuales =
    null;

let configuracionMetricasActual =
    null;


/*
==================================================
INICIAR
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloMetricas
);


function iniciarModuloMetricas() {

    configuracionMetricasActual =
        obtenerConfiguracionMetricas();

    configurarFiltrosMetricas();

    configurarPanelMetricas();

    cargarAreasMetricas();

    actualizarDashboardMetricas();

    window.addEventListener(
        "storage",
        function (evento) {

            if (
                evento.key &&
                evento.key.startsWith(
                    "octoflow"
                )
            ) {

                configuracionMetricasActual =
                    obtenerConfiguracionMetricas();

                cargarAreasMetricas();

                actualizarDashboardMetricas();
            }
        }
    );
}


/*
==================================================
ALMACENAMIENTO
==================================================
*/

function leerColeccionMetricas(
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


function obtenerIdeasMetricas() {

    return leerColeccionMetricas(
        "octoflowIdeas"
    );
}


function obtenerOportunidadesMetricas() {

    return leerColeccionMetricas(
        "octoflowOportunidades"
    );
}


function obtenerPostulacionesMetricas() {

    return leerColeccionMetricas(
        "octoflowPostulaciones"
    );
}


function obtenerProyectosMetricas() {

    return leerColeccionMetricas(
        "octoflowProyectos"
    );
}


function obtenerUsuariosMetricas() {

    return leerColeccionMetricas(
        "octoflowUsuarios"
    );
}


function obtenerHabilidadesMetricas() {

    return leerColeccionMetricas(
        "octoflowHabilidades"
    );
}


/*
==================================================
CONFIGURACIÓN DE MÉTRICAS
==================================================
*/

function obtenerConfiguracionMetricas() {

    try {

        const guardada =
            JSON.parse(
                localStorage.getItem(
                    CLAVE_CONFIGURACION_METRICAS
                ) || "null"
            );

        if (
            !guardada ||
            typeof guardada !==
            "object"
        ) {

            return clonarConfiguracionMetricas(
                CONFIGURACION_METRICAS_PREDETERMINADA
            );
        }

        return normalizarConfiguracionMetricas(
            guardada
        );

    } catch (error) {

        console.error(
            "No fue posible leer la configuración de métricas.",
            error
        );

        return clonarConfiguracionMetricas(
            CONFIGURACION_METRICAS_PREDETERMINADA
        );
    }
}


function normalizarConfiguracionMetricas(
    configuracion
) {

    const horasAnualesFte =
        obtenerNumeroPositivoMetricas(
            configuracion.horasAnualesFte,
            CONFIGURACION_METRICAS_PREDETERMINADA
                .horasAnualesFte
        );

    const precioHoraGeneral =
        obtenerNumeroNoNegativoMetricas(
            configuracion.precioHoraGeneral,
            CONFIGURACION_METRICAS_PREDETERMINADA
                .precioHoraGeneral
        );

    const preciosPorArea = {};

    if (
        configuracion.preciosPorArea &&
        typeof configuracion.preciosPorArea ===
        "object"
    ) {

        Object.entries(
            configuracion.preciosPorArea
        )
            .forEach(
                function (
                    [area, precio]
                ) {

                    const nombreArea =
                        String(
                            area || ""
                        ).trim();

                    if (!nombreArea) {
                        return;
                    }

                    preciosPorArea[
                        nombreArea
                    ] =
                        obtenerNumeroNoNegativoMetricas(
                            precio,
                            precioHoraGeneral
                        );
                }
            );
    }

    return {

        horasAnualesFte:
            horasAnualesFte,

        precioHoraGeneral:
            precioHoraGeneral,

        usarPreciosPorArea:
            configuracion
                .usarPreciosPorArea !==
            false,

        preciosPorArea:
            preciosPorArea
    };
}


function guardarConfiguracionMetricasLocal(
    configuracion
) {

    configuracionMetricasActual =
        normalizarConfiguracionMetricas(
            configuracion
        );

    localStorage.setItem(
        CLAVE_CONFIGURACION_METRICAS,
        JSON.stringify(
            configuracionMetricasActual
        )
    );
}


function clonarConfiguracionMetricas(
    configuracion
) {

    return JSON.parse(
        JSON.stringify(
            configuracion
        )
    );
}


/*
==================================================
ACTUALIZAR DASHBOARD
==================================================
*/

function actualizarDashboardMetricas() {

    datosMetricasActuales =
        construirDatosMetricas();

    actualizarKpisMetricas(
        datosMetricasActuales
    );

    mostrarGraficasMetricas(
        datosMetricasActuales
    );

    mostrarEmbudoMetricas(
        datosMetricasActuales
    );

    mostrarEstadoProyectosMetricas(
        datosMetricasActuales
    );

    mostrarImpactoMetricas(
        datosMetricasActuales
    );

    mostrarIdeasPorAreaMetricas(
        datosMetricasActuales
    );

    mostrarAhorroPorAreaMetricas(
        datosMetricasActuales
    );

    mostrarTopInnovadoresMetricas(
        datosMetricasActuales
    );

    mostrarProximosHitosMetricas(
        datosMetricasActuales
    );

    mostrarInsightsMetricas(
        datosMetricasActuales
    );
}


/*
==================================================
CONSTRUIR DATOS
==================================================
*/

function construirDatosMetricas() {

    const ideas =
        filtrarRegistrosPorPeriodoYArea(
            obtenerIdeasMetricas(),
            "idea"
        );

    const oportunidades =
        filtrarRegistrosPorPeriodoYArea(
            obtenerOportunidadesMetricas(),
            "oportunidad"
        );

    const postulaciones =
        filtrarRegistrosPorPeriodoYArea(
            obtenerPostulacionesMetricas(),
            "postulacion"
        );

    const proyectos =
        filtrarProyectosMetricas(
            obtenerProyectosMetricas()
        );

    const ideasAprobadas =
        ideas.filter(
            function (idea) {

                return esIdeaAprobadaMetricas(
                    idea
                );
            }
        );

    const oportunidadesPublicadas =
        oportunidades.filter(
            function (oportunidad) {

                return (
                    normalizarMetricas(
                        oportunidad.estado
                    ) === "publicada"
                );
            }
        );

    const proyectosActivos =
        proyectos.filter(
            function (proyecto) {

                const estado =
                    normalizarMetricas(
                        proyecto.estado
                    );

                return ![
                    "completado",
                    "cancelado"
                ].includes(
                    estado
                );
            }
        );

    const proyectosCompletados =
        proyectos.filter(
            function (proyecto) {

                return (
                    normalizarMetricas(
                        proyecto.estado
                    ) === "completado"
                );
            }
        );

    const clasificacionProyectos =
        clasificarEstadoOperativoProyectos(
            proyectos
        );

    const horasAhorradas =
        proyectosCompletados.reduce(
            function (
                total,
                proyecto
            ) {

                return (
                    total +
                    obtenerHorasAhorradasProyecto(
                        proyecto
                    )
                );

            },
            0
        );

    const valorEstimado =
        proyectosCompletados.reduce(
            function (
                total,
                proyecto
            ) {

                return (
                    total +
                    calcularValorProyectoMetricas(
                        proyecto
                    )
                );

            },
            0
        );

    const hitos =
        obtenerTodosLosHitosMetricas(
            proyectos
        );

    const ideasPorArea =
        agruparIdeasPorAreaMetricas(
            ideas
        );

    const ahorroPorArea =
        construirAhorroPorAreaMetricas(
            proyectosCompletados
        );

    const innovadores =
        construirRankingInnovadoresMetricas();

    const progresoMensual =
        construirProgresoMensualMetricas();

    return {

        ideas:
            ideas,

        ideasAprobadas:
            ideasAprobadas,

        oportunidades:
            oportunidades,

        oportunidadesPublicadas:
            oportunidadesPublicadas,

        postulaciones:
            postulaciones,

        proyectos:
            proyectos,

        proyectosActivos:
            proyectosActivos,

        proyectosCompletados:
            proyectosCompletados,

        clasificacionProyectos:
            clasificacionProyectos,

        horasAhorradas:
            horasAhorradas,

        valorEstimado:
            valorEstimado,

        hitos:
            hitos,

        ideasPorArea:
            ideasPorArea,

        ahorroPorArea:
            ahorroPorArea,

        innovadores:
            innovadores,

        progresoMensual:
            progresoMensual
    };
}


/*
==================================================
FILTROS
==================================================
*/

function configurarFiltrosMetricas() {

    [
        "filtroPeriodoMetricas",
        "filtroAreaMetricas",
        "filtroEstadoProyectoMetricas"
    ].forEach(
        function (id) {

            document
                .getElementById(
                    id
                )
                ?.addEventListener(
                    "change",
                    actualizarDashboardMetricas
                );
        }
    );

    document
        .getElementById(
            "limpiarFiltrosMetricas"
        )
        ?.addEventListener(
            "click",
            limpiarFiltrosMetricas
        );
}


function limpiarFiltrosMetricas() {

    asignarValorMetricas(
        "filtroPeriodoMetricas",
        "todo"
    );

    asignarValorMetricas(
        "filtroAreaMetricas",
        ""
    );

    asignarValorMetricas(
        "filtroEstadoProyectoMetricas",
        ""
    );

    actualizarDashboardMetricas();
}


function cargarAreasMetricas() {

    const selector =
        document.getElementById(
            "filtroAreaMetricas"
        );

    if (!selector) {
        return;
    }

    const valorActual =
        selector.value;

    const areas =
        obtenerAreasDisponiblesMetricas();

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


function obtenerAreasDisponiblesMetricas() {

    const areas =
        new Set();

    [
        ...obtenerIdeasMetricas(),
        ...obtenerOportunidadesMetricas(),
        ...obtenerProyectosMetricas()
    ]
        .forEach(
            function (registro) {

                const area =
                    String(
                        registro.area ||
                        ""
                    ).trim();

                if (area) {

                    areas.add(
                        area
                    );
                }
            }
        );

    Object.keys(
        configuracionMetricasActual
            ?.preciosPorArea ||
        {}
    )
        .forEach(
            function (area) {

                if (area.trim()) {

                    areas.add(
                        area.trim()
                    );
                }
            }
        );

    return [
        ...areas
    ]
        .sort(
            function (a, b) {

                return a.localeCompare(
                    b,
                    "es"
                );
            }
        );
}


function filtrarRegistrosPorPeriodoYArea(
    registros,
    tipo
) {

    const areaFiltro =
        normalizarMetricas(
            obtenerValorMetricas(
                "filtroAreaMetricas"
            )
        );

    return registros.filter(
        function (registro) {

            const coincidePeriodo =
                fechaDentroPeriodoMetricas(
                    obtenerFechaRegistroMetricas(
                        registro,
                        tipo
                    )
                );

            const coincideArea =
                !areaFiltro ||
                normalizarMetricas(
                    registro.area
                ) === areaFiltro;

            return (
                coincidePeriodo &&
                coincideArea
            );
        }
    );
}


function filtrarProyectosMetricas(
    proyectos
) {

    const areaFiltro =
        normalizarMetricas(
            obtenerValorMetricas(
                "filtroAreaMetricas"
            )
        );

    const estadoFiltro =
        normalizarMetricas(
            obtenerValorMetricas(
                "filtroEstadoProyectoMetricas"
            )
        );

    return proyectos.filter(
        function (proyecto) {

            const coincidePeriodo =
                fechaDentroPeriodoMetricas(
                    obtenerFechaRegistroMetricas(
                        proyecto,
                        "proyecto"
                    )
                );

            const coincideArea =
                !areaFiltro ||
                normalizarMetricas(
                    proyecto.area
                ) === areaFiltro;

            const coincideEstado =
                !estadoFiltro ||
                normalizarMetricas(
                    proyecto.estado
                ) === estadoFiltro;

            return (
                coincidePeriodo &&
                coincideArea &&
                coincideEstado
            );
        }
    );
}


function obtenerFechaRegistroMetricas(
    registro,
    tipo
) {

    const candidatos = {

        idea: [
            registro.fechaCreacion,
            registro.fecha,
            registro.creadaEn,
            registro.fechaRegistro
        ],

        oportunidad: [
            registro.fechaPublicacion,
            registro.fechaCreacion,
            registro.fechaActualizacion
        ],

        postulacion: [
            registro.fechaPostulacion,
            registro.fechaCreacion,
            registro.fecha
        ],

        proyecto: [
            registro.fechaCreacion,
            registro.fechaInicio,
            registro.fechaActualizacion
        ]
    };

    return (
        candidatos[tipo] ||
        []
    ).find(Boolean) || "";
}


function fechaDentroPeriodoMetricas(
    valor
) {

    const periodo =
        obtenerValorMetricas(
            "filtroPeriodoMetricas"
        ) || "todo";

    if (
        periodo === "todo"
    ) {

        return true;
    }

    const fecha =
        convertirFechaMetricas(
            valor
        );

    if (!fecha) {

        return false;
    }

    const ahora =
        new Date();

    if (
        periodo === "mes"
    ) {

        return (
            fecha.getFullYear() ===
            ahora.getFullYear() &&
            fecha.getMonth() ===
            ahora.getMonth()
        );
    }

    if (
        periodo === "trimestre"
    ) {

        return (
            fecha.getFullYear() ===
            ahora.getFullYear() &&
            Math.floor(
                fecha.getMonth() / 3
            ) ===
            Math.floor(
                ahora.getMonth() / 3
            )
        );
    }

    if (
        periodo === "anio"
    ) {

        return (
            fecha.getFullYear() ===
            ahora.getFullYear()
        );
    }

    return true;
}


/*
==================================================
KPIS
==================================================
*/

function actualizarKpisMetricas(
    datos
) {

    asignarTextoMetricas(
        "kpiIdeasMetricas",
        formatearNumeroMetricas(
            datos.ideas.length
        )
    );

    asignarTextoMetricas(
        "detalleIdeasMetricas",
        datos.ideasAprobadas.length +
        " aprobadas"
    );

    asignarTextoMetricas(
        "kpiOportunidadesMetricas",
        formatearNumeroMetricas(
            datos.oportunidades.length
        )
    );

    asignarTextoMetricas(
        "detalleOportunidadesMetricas",
        datos
            .oportunidadesPublicadas
            .length +
        " publicadas"
    );

    asignarTextoMetricas(
        "kpiProyectosActivosMetricas",
        formatearNumeroMetricas(
            datos.proyectosActivos.length
        )
    );

    const problematicos =
        datos
            .clasificacionProyectos
            .enRiesgo +
        datos
            .clasificacionProyectos
            .atrasados;

    asignarTextoMetricas(
        "detalleProyectosActivosMetricas",
        problematicos +
        " en riesgo o atrasados"
    );

    asignarTextoMetricas(
        "kpiProyectosCompletadosMetricas",
        formatearNumeroMetricas(
            datos
                .proyectosCompletados
                .length
        )
    );

    const porcentajeImplementacion =
        datos.proyectos.length > 0
            ? Math.round(
                (
                    datos
                        .proyectosCompletados
                        .length /
                    datos.proyectos.length
                ) *
                100
            )
            : 0;

    asignarTextoMetricas(
        "detalleProyectosCompletadosMetricas",
        porcentajeImplementacion +
        "% de implementación"
    );

    asignarTextoMetricas(
        "kpiHorasAhorradasMetricas",
        formatearNumeroMetricas(
            Math.round(
                datos.horasAhorradas
            )
        )
    );
}


/*
==================================================
CONFIGURAR PANEL
==================================================
*/

function configurarPanelMetricas() {

    document
        .getElementById(
            "abrirConfiguracionMetricas"
        )
        ?.addEventListener(
            "click",
            abrirPanelConfiguracionMetricas
        );

    document
        .getElementById(
            "cerrarConfiguracionMetricas"
        )
        ?.addEventListener(
            "click",
            cerrarPanelConfiguracionMetricas
        );

    document
        .getElementById(
            "cancelarConfiguracionMetricas"
        )
        ?.addEventListener(
            "click",
            cerrarPanelConfiguracionMetricas
        );

    document
        .getElementById(
            "guardarConfiguracionMetricas"
        )
        ?.addEventListener(
            "click",
            guardarFormularioConfiguracionMetricas
        );

    document
        .getElementById(
            "restablecerConfiguracionMetricas"
        )
        ?.addEventListener(
            "click",
            restablecerConfiguracionMetricas
        );

    document
        .getElementById(
            "agregarPrecioArea"
        )
        ?.addEventListener(
            "click",
            function () {

                agregarFilaPrecioArea(
                    "",
                    configuracionMetricasActual
                        .precioHoraGeneral
                );
            }
        );

    document
        .getElementById(
            "panelConfiguracionMetricas"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "panelConfiguracionMetricas"
                ) {

                    cerrarPanelConfiguracionMetricas();
                }
            }
        );

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key ===
                "Escape"
            ) {

                cerrarPanelConfiguracionMetricas();
            }
        }
    );
}


function abrirPanelConfiguracionMetricas() {

    configuracionMetricasActual =
        obtenerConfiguracionMetricas();

    asignarValorMetricas(
        "configHorasFte",
        configuracionMetricasActual
            .horasAnualesFte
    );

    asignarValorMetricas(
        "configPrecioHoraGeneral",
        configuracionMetricasActual
            .precioHoraGeneral
    );

    const interruptor =
        document.getElementById(
            "configUsarPreciosArea"
        );

    if (interruptor) {

        interruptor.checked =
            configuracionMetricasActual
                .usarPreciosPorArea;
    }

    mostrarFilasPreciosArea();

    const panel =
        document.getElementById(
            "panelConfiguracionMetricas"
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


function cerrarPanelConfiguracionMetricas() {

    const panel =
        document.getElementById(
            "panelConfiguracionMetricas"
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


function mostrarFilasPreciosArea() {

    const contenedor =
        document.getElementById(
            "listaConfiguracionPreciosArea"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        "";

    const precios =
        Object.entries(
            configuracionMetricasActual
                .preciosPorArea ||
            {}
        );

    if (
        precios.length === 0
    ) {

        obtenerAreasDisponiblesMetricas()
            .forEach(
                function (area) {

                    agregarFilaPrecioArea(
                        area,
                        configuracionMetricasActual
                            .precioHoraGeneral
                    );
                }
            );

        return;
    }

    precios
        .sort(
            function (a, b) {

                return a[0].localeCompare(
                    b[0],
                    "es"
                );
            }
        )
        .forEach(
            function (
                [area, precio]
            ) {

                agregarFilaPrecioArea(
                    area,
                    precio
                );
            }
        );
}


function agregarFilaPrecioArea(
    area,
    precio
) {

    const contenedor =
        document.getElementById(
            "listaConfiguracionPreciosArea"
        );

    if (!contenedor) {
        return;
    }

    const fila =
        document.createElement(
            "div"
        );

    fila.className =
        "fila-precio-area";

    fila.innerHTML = `

        <input
            type="text"
            class="input-nombre-area-metricas"
            placeholder="Nombre del área"
            value="${escaparAtributoMetricas(
                area
            )}"
        >

        <input
            type="number"
            class="input-precio-area-metricas"
            min="0"
            step="1"
            placeholder="Precio por hora"
            value="${obtenerNumeroNoNegativoMetricas(
                precio,
                0
            )}"
        >

        <button
            class="eliminar-precio-area"
            type="button"
        >
            Eliminar
        </button>
    `;

    fila
        .querySelector(
            ".eliminar-precio-area"
        )
        ?.addEventListener(
            "click",
            function () {

                fila.remove();
            }
        );

    contenedor.appendChild(
        fila
    );

    if (!area) {

        fila
            .querySelector(
                ".input-nombre-area-metricas"
            )
            ?.focus();
    }
}


function guardarFormularioConfiguracionMetricas() {

    const horasAnualesFte =
        Number(
            obtenerValorMetricas(
                "configHorasFte"
            )
        );

    const precioHoraGeneral =
        Number(
            obtenerValorMetricas(
                "configPrecioHoraGeneral"
            )
        );

    if (
        !Number.isFinite(
            horasAnualesFte
        ) ||
        horasAnualesFte <= 0
    ) {

        mostrarNotificacion(
            "Las horas anuales por FTE deben ser mayores a cero."
        );

        return;
    }

    if (
        !Number.isFinite(
            precioHoraGeneral
        ) ||
        precioHoraGeneral < 0
    ) {

        mostrarNotificacion(
            "El precio general por hora no puede ser negativo."
        );

        return;
    }

    const preciosPorArea = {};

    document
        .querySelectorAll(
            ".fila-precio-area"
        )
        .forEach(
            function (fila) {

                const area =
                    String(
                        fila
                            .querySelector(
                                ".input-nombre-area-metricas"
                            )
                            ?.value ||
                        ""
                    ).trim();

                const precio =
                    Number(
                        fila
                            .querySelector(
                                ".input-precio-area-metricas"
                            )
                            ?.value ||
                        0
                    );

                if (!area) {
                    return;
                }

                preciosPorArea[
                    area
                ] =
                    Number.isFinite(
                        precio
                    )
                        ? Math.max(
                            0,
                            precio
                        )
                        : precioHoraGeneral;
            }
        );

    guardarConfiguracionMetricasLocal({

        horasAnualesFte:
            horasAnualesFte,

        precioHoraGeneral:
            precioHoraGeneral,

        usarPreciosPorArea:
            document
                .getElementById(
                    "configUsarPreciosArea"
                )
                ?.checked ===
            true,

        preciosPorArea:
            preciosPorArea
    });

    cerrarPanelConfiguracionMetricas();

    cargarAreasMetricas();

    actualizarDashboardMetricas();

    mostrarNotificacion(
        "Configuración guardada correctamente."
    );
}


function restablecerConfiguracionMetricas() {

    const confirmar =
        window.confirm(
            "¿Deseas restablecer los parámetros predeterminados de FTE y ahorros?"
        );

    if (!confirmar) {
        return;
    }

    configuracionMetricasActual =
        clonarConfiguracionMetricas(
            CONFIGURACION_METRICAS_PREDETERMINADA
        );

    asignarValorMetricas(
        "configHorasFte",
        configuracionMetricasActual
            .horasAnualesFte
    );

    asignarValorMetricas(
        "configPrecioHoraGeneral",
        configuracionMetricasActual
            .precioHoraGeneral
    );

    const interruptor =
        document.getElementById(
            "configUsarPreciosArea"
        );

    if (interruptor) {

        interruptor.checked =
            true;
    }

    mostrarFilasPreciosArea();
}


/*
==================================================
CÁLCULO DE FTE Y AHORROS
==================================================
*/

function obtenerPrecioHoraAreaMetricas(
    area
) {

    const configuracion =
        configuracionMetricasActual ||
        obtenerConfiguracionMetricas();

    if (
        !configuracion
            .usarPreciosPorArea
    ) {

        return configuracion
            .precioHoraGeneral;
    }

    const areaNormalizada =
        normalizarMetricas(
            area
        );

    const coincidencia =
        Object.entries(
            configuracion
                .preciosPorArea ||
            {}
        )
            .find(
                function (
                    [nombreArea]
                ) {

                    return (
                        normalizarMetricas(
                            nombreArea
                        ) ===
                        areaNormalizada
                    );
                }
            );

    if (coincidencia) {

        return obtenerNumeroNoNegativoMetricas(
            coincidencia[1],
            configuracion
                .precioHoraGeneral
        );
    }

    return configuracion
        .precioHoraGeneral;
}


function obtenerHorasAhorradasProyecto(
    proyecto
) {

    return obtenerNumeroNoNegativoMetricas(
        proyecto
            .horasAhorradasAnuales ||
        proyecto
            .horasAhorradas ||
        proyecto
            .ahorroHoras ||
        0,
        0
    );
}


function calcularValorProyectoMetricas(
    proyecto
) {

    return (
        obtenerHorasAhorradasProyecto(
            proyecto
        ) *
        obtenerPrecioHoraAreaMetricas(
            proyecto.area
        )
    );
}


function mostrarImpactoMetricas(
    datos
) {

    const configuracion =
        configuracionMetricasActual;

    const horas =
        datos.horasAhorradas;

    const fte =
        horas /
        configuracion.horasAnualesFte;

    const precioPromedio =
        horas > 0
            ? datos.valorEstimado /
              horas
            : 0;

    asignarTextoMetricas(
        "impactoHorasMetricas",
        formatearNumeroMetricas(
            Math.round(
                horas
            )
        )
    );

    asignarTextoMetricas(
        "impactoFteMetricas",
        fte.toFixed(
            1
        )
    );

    asignarTextoMetricas(
        "impactoValorMetricas",
        formatearMonedaMetricas(
            datos.valorEstimado
        )
    );

    asignarTextoMetricas(
        "impactoPrecioPromedioMetricas",
        formatearMonedaMetricas(
            precioPromedio
        )
    );

    asignarTextoMetricas(
        "detalleFteMetricas",
        "Basado en " +
        formatearNumeroMetricas(
            configuracion
                .horasAnualesFte
        ) +
        " horas/año"
    );

    asignarTextoMetricas(
        "detalleValorMetricas",
        configuracion
            .usarPreciosPorArea
            ? "Precios por área con respaldo general"
            : "Precio general de " +
              formatearMonedaMetricas(
                  configuracion
                      .precioHoraGeneral
              ) +
              " por hora"
    );

    asignarTextoMetricas(
        "textoSupuestosImpacto",
        "FTE calculado con " +
        formatearNumeroMetricas(
            configuracion
                .horasAnualesFte
        ) +
        " horas anuales y " +
        (
            configuracion
                .usarPreciosPorArea
                ? "precios diferenciados por área."
                : "un precio general por hora."
        )
    );
}


/*
==================================================
AHORRO POR ÁREA
==================================================
*/

function construirAhorroPorAreaMetricas(
    proyectosCompletados
) {

    const grupos = {};

    proyectosCompletados
        .forEach(
            function (proyecto) {

                const area =
                    String(
                        proyecto.area ||
                        "Sin área"
                    ).trim() ||
                    "Sin área";

                if (
                    !grupos[area]
                ) {

                    grupos[area] = {

                        area:
                            area,

                        horas:
                            0,

                        valor:
                            0,

                        precioHora:
                            obtenerPrecioHoraAreaMetricas(
                                area
                            )
                    };
                }

                grupos[area].horas +=
                    obtenerHorasAhorradasProyecto(
                        proyecto
                    );

                grupos[area].valor +=
                    calcularValorProyectoMetricas(
                        proyecto
                    );
            }
        );

    return Object.values(
        grupos
    )
        .sort(
            function (a, b) {

                return (
                    b.valor -
                    a.valor
                );
            }
        );
}


function mostrarAhorroPorAreaMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "ahorroPorAreaMetricas"
        );

    if (!contenedor) {
        return;
    }

    const areas =
        datos.ahorroPorArea
            .slice(
                0,
                8
            );

    if (
        areas.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No existen proyectos completados con horas ahorradas.
            </div>
        `;

        return;
    }

    const maximo =
        Math.max(
            ...areas.map(
                function (registro) {

                    return registro.valor;
                }
            ),
            1
        );

    contenedor.innerHTML =
        areas
            .map(
                function (registro) {

                    const ancho =
                        Math.max(
                            5,
                            Math.round(
                                (
                                    registro.valor /
                                    maximo
                                ) *
                                100
                            )
                        );

                    return `
                        <div class="fila-barra-metrica">

                            <span
                                title="${
                                    formatearNumeroMetricas(
                                        registro.horas
                                    )
                                } horas × ${
                                    formatearMonedaMetricas(
                                        registro.precioHora
                                    )
                                }"
                            >
                                ${escaparMetricas(
                                    registro.area
                                )}
                            </span>

                            <div class="barra-horizontal-metrica">

                                <span
                                    style="width: ${ancho}%"
                                ></span>

                            </div>

                            <strong>
                                ${formatearMonedaCompactaMetricas(
                                    registro.valor
                                )}
                            </strong>

                        </div>
                    `;
                }
            )
            .join("");
}


/*
==================================================
GRÁFICAS
==================================================
*/

function mostrarGraficasMetricas(
    datos
) {

    mostrarGraficaPipelineMensual(
        datos.progresoMensual
    );

    mostrarGraficaProyectosMensual(
        datos.progresoMensual
    );

    mostrarGraficaHorasAcumuladas(
        datos.progresoMensual
    );

    mostrarGraficaAvancePromedio(
        datos.progresoMensual
    );
}


function construirProgresoMensualMetricas() {

    const meses =
        obtenerUltimosMesesMetricas(
            12
        );

    const ideas =
        obtenerIdeasMetricas();

    const oportunidades =
        obtenerOportunidadesMetricas();

    const proyectos =
        obtenerProyectosMetricas();

    const resultado =
        meses.map(
            function (mes) {

                const ideasMes =
                    contarRegistrosMesMetricas(
                        ideas,
                        mes,
                        "idea"
                    );

                const oportunidadesMes =
                    contarRegistrosMesMetricas(
                        oportunidades,
                        mes,
                        "oportunidad"
                    );

                const proyectosCreados =
                    contarRegistrosMesMetricas(
                        proyectos,
                        mes,
                        "proyecto"
                    );

                const completadosMes =
                    proyectos.filter(
                        function (proyecto) {

                            const fecha =
                                obtenerFechaCompletadoProyectoMetricas(
                                    proyecto
                                );

                            return (
                                fecha &&
                                fecha.getFullYear() ===
                                mes.anio &&
                                fecha.getMonth() ===
                                mes.mes
                            );
                        }
                    );

                const horasMes =
                    completadosMes.reduce(
                        function (
                            total,
                            proyecto
                        ) {

                            return (
                                total +
                                obtenerHorasAhorradasProyecto(
                                    proyecto
                                )
                            );

                        },
                        0
                    );

                const proyectosDisponibles =
                    proyectos.filter(
                        function (proyecto) {

                            const fecha =
                                convertirFechaMetricas(
                                    obtenerFechaRegistroMetricas(
                                        proyecto,
                                        "proyecto"
                                    )
                                );

                            if (!fecha) {
                                return false;
                            }

                            return (
                                fecha <=
                                mes.fechaFin
                            );
                        }
                    );

                const avancePromedio =
                    proyectosDisponibles.length > 0
                        ? proyectosDisponibles
                            .reduce(
                                function (
                                    suma,
                                    proyecto
                                ) {

                                    return (
                                        suma +
                                        limitarMetricas(
                                            proyecto.avance,
                                            0,
                                            100
                                        )
                                    );

                                },
                                0
                            ) /
                            proyectosDisponibles.length
                        : 0;

                return {

                    etiqueta:
                        mes.etiqueta,

                    anio:
                        mes.anio,

                    mes:
                        mes.mes,

                    ideas:
                        ideasMes,

                    oportunidades:
                        oportunidadesMes,

                    proyectosCreados:
                        proyectosCreados,

                    proyectosCompletados:
                        completadosMes.length,

                    horasMes:
                        horasMes,

                    avancePromedio:
                        Math.round(
                            avancePromedio
                        )
                };
            }
        );

    let acumulado =
        0;

    resultado.forEach(
        function (registro) {

            acumulado +=
                registro.horasMes;

            registro.horasAcumuladas =
                acumulado;
        }
    );

    return resultado;
}


function obtenerUltimosMesesMetricas(
    cantidad
) {

    const ahora =
        new Date();

    const resultado = [];

    for (
        let desplazamiento =
            cantidad - 1;
        desplazamiento >= 0;
        desplazamiento -= 1
    ) {

        const fecha =
            new Date(
                ahora.getFullYear(),
                ahora.getMonth() -
                desplazamiento,
                1
            );

        resultado.push({

            anio:
                fecha.getFullYear(),

            mes:
                fecha.getMonth(),

            fechaInicio:
                new Date(
                    fecha.getFullYear(),
                    fecha.getMonth(),
                    1
                ),

            fechaFin:
                new Date(
                    fecha.getFullYear(),
                    fecha.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                ),

            etiqueta:
                fecha.toLocaleDateString(
                    "es-MX",
                    {
                        month:
                            "short"
                    }
                )
                    .replace(
                        ".",
                        ""
                    )
        });
    }

    return resultado;
}


function contarRegistrosMesMetricas(
    registros,
    mes,
    tipo
) {

    return registros.filter(
        function (registro) {

            const fecha =
                convertirFechaMetricas(
                    obtenerFechaRegistroMetricas(
                        registro,
                        tipo
                    )
                );

            return (
                fecha &&
                fecha.getFullYear() ===
                mes.anio &&
                fecha.getMonth() ===
                mes.mes
            );
        }
    ).length;
}


function obtenerFechaCompletadoProyectoMetricas(
    proyecto
) {

    return convertirFechaMetricas(
        proyecto.fechaCompletado ||
        proyecto.fechaCierre ||
        proyecto.fechaFinalizacion ||
        (
            normalizarMetricas(
                proyecto.estado
            ) === "completado"
                ? proyecto.fechaActualizacion
                : ""
        )
    );
}


function mostrarGraficaPipelineMensual(
    datos
) {

    crearGraficaBarrasAgrupadasMetricas(
        "graficaPipelineMensual",
        datos,
        [
            {
                clave:
                    "ideas",

                etiqueta:
                    "Ideas",

                color:
                    "#005eb8"
            },
            {
                clave:
                    "oportunidades",

                etiqueta:
                    "Oportunidades",

                color:
                    "#00a3e0"
            },
            {
                clave:
                    "proyectosCreados",

                etiqueta:
                    "Proyectos",

                color:
                    "#17b26a"
            }
        ]
    );
}


function mostrarGraficaProyectosMensual(
    datos
) {

    crearGraficaBarrasAgrupadasMetricas(
        "graficaProyectosMensual",
        datos,
        [
            {
                clave:
                    "proyectosCreados",

                etiqueta:
                    "Creados",

                color:
                    "#005eb8"
            },
            {
                clave:
                    "proyectosCompletados",

                etiqueta:
                    "Completados",

                color:
                    "#17b26a"
            }
        ]
    );
}


function mostrarGraficaHorasAcumuladas(
    datos
) {

    crearGraficaLineaMetricas(
        "graficaHorasAcumuladas",
        datos,
        "horasAcumuladas",
        {
            color:
                "#005eb8",

            unidad:
                " h",

            maximoFijo:
                null
        }
    );
}


function mostrarGraficaAvancePromedio(
    datos
) {

    crearGraficaLineaMetricas(
        "graficaAvancePromedio",
        datos,
        "avancePromedio",
        {
            color:
                "#f79009",

            unidad:
                "%",

            maximoFijo:
                100
        }
    );
}


function crearGraficaBarrasAgrupadasMetricas(
    idContenedor,
    datos,
    series
) {

    const contenedor =
        document.getElementById(
            idContenedor
        );

    if (!contenedor) {
        return;
    }

    const ancho =
        760;

    const alto =
        300;

    const margen = {

        superior:
            25,

        derecho:
            20,

        inferior:
            48,

        izquierdo:
            45
    };

    const anchoGrafica =
        ancho -
        margen.izquierdo -
        margen.derecho;

    const altoGrafica =
        alto -
        margen.superior -
        margen.inferior;

    const maximo =
        Math.max(
            ...datos.flatMap(
                function (registro) {

                    return series.map(
                        function (serie) {

                            return obtenerNumeroMetricas(
                                registro[
                                    serie.clave
                                ]
                            );
                        }
                    );
                }
            ),
            1
        );

    const maximoEscala =
        obtenerMaximoEscalaMetricas(
            maximo
        );

    const anchoGrupo =
        anchoGrafica /
        Math.max(
            datos.length,
            1
        );

    const espacioGrupo =
        Math.max(
            4,
            anchoGrupo *
            0.16
        );

    const anchoDisponibleGrupo =
        anchoGrupo -
        espacioGrupo;

    const anchoBarra =
        Math.max(
            3,
            anchoDisponibleGrupo /
            series.length -
            2
        );

    const lineas = [];

    for (
        let indice = 0;
        indice <= 4;
        indice += 1
    ) {

        const valor =
            (
                maximoEscala /
                4
            ) *
            indice;

        const y =
            margen.superior +
            altoGrafica -
            (
                valor /
                maximoEscala
            ) *
            altoGrafica;

        lineas.push(`
            <line
                x1="${margen.izquierdo}"
                y1="${y}"
                x2="${ancho - margen.derecho}"
                y2="${y}"
                stroke="#e4e7ec"
                stroke-width="1"
            />

            <text
                x="${margen.izquierdo - 8}"
                y="${y + 4}"
                text-anchor="end"
                fill="#667085"
                font-size="9"
            >
                ${formatearNumeroMetricas(
                    Math.round(
                        valor
                    )
                )}
            </text>
        `);
    }

    const barras = [];

    datos.forEach(
        function (
            registro,
            indiceMes
        ) {

            const xGrupo =
                margen.izquierdo +
                indiceMes *
                anchoGrupo +
                espacioGrupo /
                2;

            series.forEach(
                function (
                    serie,
                    indiceSerie
                ) {

                    const valor =
                        obtenerNumeroMetricas(
                            registro[
                                serie.clave
                            ]
                        );

                    const altura =
                        (
                            valor /
                            maximoEscala
                        ) *
                        altoGrafica;

                    const x =
                        xGrupo +
                        indiceSerie *
                        (
                            anchoBarra +
                            2
                        );

                    const y =
                        margen.superior +
                        altoGrafica -
                        altura;

                    barras.push(`
                        <rect
                            x="${x}"
                            y="${y}"
                            width="${anchoBarra}"
                            height="${Math.max(
                                altura,
                                valor > 0
                                    ? 2
                                    : 0
                            )}"
                            rx="2"
                            fill="${serie.color}"
                        >
                            <title>
                                ${registro.etiqueta} ·
                                ${serie.etiqueta}:
                                ${valor}
                            </title>
                        </rect>
                    `);
                }
            );

            const xEtiqueta =
                margen.izquierdo +
                indiceMes *
                anchoGrupo +
                anchoGrupo /
                2;

            barras.push(`
                <text
                    x="${xEtiqueta}"
                    y="${alto - 18}"
                    text-anchor="middle"
                    fill="#667085"
                    font-size="9"
                >
                    ${escaparMetricas(
                        registro.etiqueta
                    )}
                </text>
            `);
        }
    );

    contenedor.innerHTML = `
        <svg
            viewBox="0 0 ${ancho} ${alto}"
            role="img"
            aria-label="Gráfica de progreso mensual"
        >

            ${lineas.join("")}

            <line
                x1="${margen.izquierdo}"
                y1="${margen.superior + altoGrafica}"
                x2="${ancho - margen.derecho}"
                y2="${margen.superior + altoGrafica}"
                stroke="#98a2b3"
                stroke-width="1"
            />

            ${barras.join("")}

        </svg>
    `;
}


function crearGraficaLineaMetricas(
    idContenedor,
    datos,
    clave,
    opciones
) {

    const contenedor =
        document.getElementById(
            idContenedor
        );

    if (!contenedor) {
        return;
    }

    const ancho =
        760;

    const alto =
        300;

    const margen = {

        superior:
            25,

        derecho:
            25,

        inferior:
            48,

        izquierdo:
            55
    };

    const anchoGrafica =
        ancho -
        margen.izquierdo -
        margen.derecho;

    const altoGrafica =
        alto -
        margen.superior -
        margen.inferior;

    const valores =
        datos.map(
            function (registro) {

                return obtenerNumeroMetricas(
                    registro[clave]
                );
            }
        );

    const maximoDatos =
        Math.max(
            ...valores,
            1
        );

    const maximo =
        opciones.maximoFijo ||
        obtenerMaximoEscalaMetricas(
            maximoDatos
        );

    const puntos =
        datos.map(
            function (
                registro,
                indice
            ) {

                const x =
                    margen.izquierdo +
                    (
                        datos.length === 1
                            ? anchoGrafica / 2
                            : (
                                indice /
                                (
                                    datos.length - 1
                                )
                            ) *
                            anchoGrafica
                    );

                const valor =
                    obtenerNumeroMetricas(
                        registro[clave]
                    );

                const y =
                    margen.superior +
                    altoGrafica -
                    (
                        valor /
                        maximo
                    ) *
                    altoGrafica;

                return {

                    x:
                        x,

                    y:
                        y,

                    valor:
                        valor,

                    etiqueta:
                        registro.etiqueta
                };
            }
        );

    const ruta =
        puntos
            .map(
                function (
                    punto,
                    indice
                ) {

                    return (
                        (
                            indice === 0
                                ? "M"
                                : "L"
                        ) +
                        " " +
                        punto.x +
                        " " +
                        punto.y
                    );
                }
            )
            .join(" ");

    const lineas = [];

    for (
        let indice = 0;
        indice <= 4;
        indice += 1
    ) {

        const valor =
            (
                maximo /
                4
            ) *
            indice;

        const y =
            margen.superior +
            altoGrafica -
            (
                valor /
                maximo
            ) *
            altoGrafica;

        lineas.push(`
            <line
                x1="${margen.izquierdo}"
                y1="${y}"
                x2="${ancho - margen.derecho}"
                y2="${y}"
                stroke="#e4e7ec"
                stroke-width="1"
            />

            <text
                x="${margen.izquierdo - 8}"
                y="${y + 4}"
                text-anchor="end"
                fill="#667085"
                font-size="9"
            >
                ${formatearNumeroMetricas(
                    Math.round(
                        valor
                    )
                )}${opciones.unidad}
            </text>
        `);
    }

    const circulos =
        puntos.map(
            function (punto) {

                return `
                    <circle
                        cx="${punto.x}"
                        cy="${punto.y}"
                        r="4"
                        fill="${opciones.color}"
                        stroke="#ffffff"
                        stroke-width="2"
                    >
                        <title>
                            ${punto.etiqueta}:
                            ${formatearNumeroMetricas(
                                punto.valor
                            )}${opciones.unidad}
                        </title>
                    </circle>

                    <text
                        x="${punto.x}"
                        y="${alto - 18}"
                        text-anchor="middle"
                        fill="#667085"
                        font-size="9"
                    >
                        ${escaparMetricas(
                            punto.etiqueta
                        )}
                    </text>
                `;
            }
        )
        .join("");

    contenedor.innerHTML = `
        <svg
            viewBox="0 0 ${ancho} ${alto}"
            role="img"
            aria-label="Gráfica de tendencia mensual"
        >

            ${lineas.join("")}

            <path
                d="${ruta}"
                fill="none"
                stroke="${opciones.color}"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            ${circulos}

        </svg>
    `;
}


function obtenerMaximoEscalaMetricas(
    valor
) {

    if (
        valor <= 5
    ) {

        return 5;
    }

    if (
        valor <= 10
    ) {

        return 10;
    }

    const magnitud =
        Math.pow(
            10,
            Math.floor(
                Math.log10(
                    valor
                )
            )
        );

    return (
        Math.ceil(
            valor /
            magnitud
        ) *
        magnitud
    );
}


/*
==================================================
EMBUDO
==================================================
*/

function mostrarEmbudoMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "embudoInnovacionMetricas"
        );

    if (!contenedor) {
        return;
    }

    const etapas = [

        {
            nombre:
                "Ideas",

            valor:
                datos.ideas.length
        },

        {
            nombre:
                "Oportunidades",

            valor:
                datos.oportunidades.length
        },

        {
            nombre:
                "Postulaciones",

            valor:
                datos.postulaciones.length
        },

        {
            nombre:
                "Proyectos",

            valor:
                datos.proyectos.length
        },

        {
            nombre:
                "Implementados",

            valor:
                datos
                    .proyectosCompletados
                    .length
        }
    ];

    const maximo =
        Math.max(
            ...etapas.map(
                function (etapa) {

                    return etapa.valor;
                }
            ),
            1
        );

    contenedor.innerHTML =
        etapas
            .map(
                function (etapa) {

                    const ancho =
                        etapa.valor === 0
                            ? 0
                            : Math.max(
                                4,
                                Math.round(
                                    (
                                        etapa.valor /
                                        maximo
                                    ) *
                                    100
                                )
                            );

                    return `
                        <div class="fila-embudo">

                            <span>
                                ${escaparMetricas(
                                    etapa.nombre
                                )}
                            </span>

                            <div class="barra-embudo">

                                <span
                                    style="width: ${ancho}%"
                                ></span>

                            </div>

                            <strong>
                                ${formatearNumeroMetricas(
                                    etapa.valor
                                )}
                            </strong>

                        </div>
                    `;
                }
            )
            .join("");
}


/*
==================================================
ESTADO OPERATIVO
==================================================
*/

function clasificarEstadoOperativoProyectos(
    proyectos
) {

    const resultado = {

        enTiempo:
            0,

        enRiesgo:
            0,

        atrasados:
            0,

        completados:
            0
    };

    proyectos.forEach(
        function (proyecto) {

            const estado =
                normalizarMetricas(
                    proyecto.estado
                );

            if (
                estado === "completado"
            ) {

                resultado.completados +=
                    1;

                return;
            }

            if (
                estado === "cancelado"
            ) {

                return;
            }

            const fechaObjetivo =
                convertirFechaMetricas(
                    proyecto.fechaObjetivo
                );

            const hoy =
                obtenerHoySinHoraMetricas();

            const avance =
                limitarMetricas(
                    proyecto.avance,
                    0,
                    100
                );

            if (
                fechaObjetivo &&
                fechaObjetivo <
                hoy
            ) {

                resultado.atrasados +=
                    1;

                return;
            }

            if (
                estado === "en pausa"
            ) {

                resultado.enRiesgo +=
                    1;

                return;
            }

            if (
                fechaObjetivo &&
                diasEntreMetricas(
                    hoy,
                    fechaObjetivo
                ) <= 7 &&
                avance < 80
            ) {

                resultado.enRiesgo +=
                    1;

                return;
            }

            resultado.enTiempo +=
                1;
        }
    );

    return resultado;
}


function mostrarEstadoProyectosMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "estadoProyectosMetricas"
        );

    if (!contenedor) {
        return;
    }

    const estados = [

        {
            nombre:
                "En tiempo",

            clase:
                "en-tiempo",

            valor:
                datos
                    .clasificacionProyectos
                    .enTiempo
        },

        {
            nombre:
                "En riesgo",

            clase:
                "en-riesgo",

            valor:
                datos
                    .clasificacionProyectos
                    .enRiesgo
        },

        {
            nombre:
                "Atrasados",

            clase:
                "atrasado",

            valor:
                datos
                    .clasificacionProyectos
                    .atrasados
        },

        {
            nombre:
                "Completados",

            clase:
                "completado",

            valor:
                datos
                    .clasificacionProyectos
                    .completados
        }
    ];

    contenedor.innerHTML =
        estados
            .map(
                function (estado) {

                    return `
                        <div class="estado-proyecto-metrica">

                            <span>

                                <i
                                    class="
                                        indicador-estado
                                        ${estado.clase}
                                    "
                                ></i>

                                ${estado.nombre}

                            </span>

                            <strong>
                                ${estado.valor}
                            </strong>

                        </div>
                    `;
                }
            )
            .join("");
}


/*
==================================================
IDEAS POR ÁREA
==================================================
*/

function agruparIdeasPorAreaMetricas(
    ideas
) {

    const resultado = {};

    ideas.forEach(
        function (idea) {

            const area =
                String(
                    idea.area ||
                    "Sin área"
                ).trim() ||
                "Sin área";

            if (
                !resultado[area]
            ) {

                resultado[area] =
                    0;
            }

            resultado[area] +=
                1;
        }
    );

    return Object.entries(
        resultado
    )
        .map(
            function (
                [area, total]
            ) {

                return {

                    area:
                        area,

                    total:
                        total
                };
            }
        )
        .sort(
            function (a, b) {

                return (
                    b.total -
                    a.total
                );
            }
        );
}


function mostrarIdeasPorAreaMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "ideasPorAreaMetricas"
        );

    if (!contenedor) {
        return;
    }

    const areas =
        datos.ideasPorArea
            .slice(
                0,
                8
            );

    if (
        areas.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay ideas para mostrar.
            </div>
        `;

        return;
    }

    const maximo =
        Math.max(
            ...areas.map(
                function (area) {

                    return area.total;
                }
            ),
            1
        );

    contenedor.innerHTML =
        areas
            .map(
                function (area) {

                    const ancho =
                        Math.max(
                            5,
                            Math.round(
                                (
                                    area.total /
                                    maximo
                                ) *
                                100
                            )
                        );

                    return `
                        <div class="fila-barra-metrica">

                            <span>
                                ${escaparMetricas(
                                    area.area
                                )}
                            </span>

                            <div class="barra-horizontal-metrica">

                                <span
                                    style="width: ${ancho}%"
                                ></span>

                            </div>

                            <strong>
                                ${area.total}
                            </strong>

                        </div>
                    `;
                }
            )
            .join("");
}


/*
==================================================
TOP INNOVADORES
==================================================
*/

function construirRankingInnovadoresMetricas() {

    const correos =
        obtenerCorreosInnovadoresMetricas();

    return correos
        .map(
            function (correo) {

                return construirInnovadorMetricas(
                    correo
                );
            }
        )
        .filter(Boolean)
        .sort(
            function (a, b) {

                return (
                    b.score -
                    a.score
                );
            }
        );
}


function obtenerCorreosInnovadoresMetricas() {

    const correos =
        new Set();

    function agregarCorreo(
        correo
    ) {

        const valor =
            normalizarCorreoMetricas(
                correo
            );

        if (
            valor &&
            valor.includes("@")
        ) {

            correos.add(
                valor
            );
        }
    }

    obtenerIdeasMetricas()
        .forEach(
            function (idea) {

                agregarCorreo(
                    idea.correo ||
                    idea.autorCorreo ||
                    idea.creadoPor ||
                    idea.email
                );
            }
        );

    obtenerProyectosMetricas()
        .forEach(
            function (proyecto) {

                (
                    Array.isArray(
                        proyecto.participantes
                    )
                        ? proyecto.participantes
                        : []
                )
                    .forEach(
                        function (participante) {

                            agregarCorreo(
                                participante.correo ||
                                participante.email
                            );
                        }
                    );
            }
        );

    obtenerHabilidadesMetricas()
        .forEach(
            function (habilidad) {

                agregarCorreo(
                    habilidad.correo ||
                    habilidad.email
                );
            }
        );

    return [
        ...correos
    ];
}


function construirInnovadorMetricas(
    correo
) {

    const ideas =
        obtenerIdeasMetricas()
            .filter(
                function (idea) {

                    return (
                        normalizarCorreoMetricas(
                            idea.correo ||
                            idea.autorCorreo ||
                            idea.creadoPor ||
                            idea.email
                        ) === correo
                    );
                }
            );

    const proyectos =
        obtenerProyectosMetricas()
            .filter(
                function (proyecto) {

                    return (
                        Array.isArray(
                            proyecto.participantes
                        )
                            ? proyecto.participantes
                            : []
                    )
                        .some(
                            function (participante) {

                                return (
                                    normalizarCorreoMetricas(
                                        participante.correo ||
                                        participante.email
                                    ) === correo
                                );
                            }
                        );
                }
            );

    const ideasAprobadas =
        ideas.filter(
            esIdeaAprobadaMetricas
        );

    const proyectosCompletados =
        proyectos.filter(
            function (proyecto) {

                return (
                    normalizarMetricas(
                        proyecto.estado
                    ) === "completado"
                );
            }
        );

    const proyectosChampion =
        proyectos.filter(
            function (proyecto) {

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
                                    normalizarCorreoMetricas(
                                        registro.correo ||
                                        registro.email
                                    ) === correo
                                );
                            }
                        );

                return (
                    normalizarMetricas(
                        participante?.rol
                    ) === "champion"
                );
            }
        ).length;

    const hitosCompletados =
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

                            return (
                                normalizarCorreoMetricas(
                                    hito.responsable
                                ) === correo &&
                                normalizarMetricas(
                                    hito.estado
                                ) === "completado"
                            );
                        }
                    ).length
                );

            },
            0
        );

    const habilidades =
        obtenerHabilidadesMetricas()
            .filter(
                function (habilidad) {

                    return (
                        normalizarCorreoMetricas(
                            habilidad.correo ||
                            habilidad.email
                        ) === correo
                    );
                }
            );

    const horasAhorradas =
        proyectosCompletados.reduce(
            function (
                total,
                proyecto
            ) {

                const participantes =
                    Array.isArray(
                        proyecto.participantes
                    )
                        ? proyecto.participantes
                        : [];

                return (
                    total +
                    (
                        obtenerHorasAhorradasProyecto(
                            proyecto
                        ) /
                        Math.max(
                            participantes.length,
                            1
                        )
                    )
                );

            },
            0
        );

    const score =
        calcularScoreMetricas({

            ideas:
                ideas.length,

            ideasAprobadas:
                ideasAprobadas.length,

            proyectos:
                proyectos.length,

            proyectosCompletados:
                proyectosCompletados.length,

            proyectosChampion:
                proyectosChampion,

            hitosCompletados:
                hitosCompletados,

            horasAhorradas:
                horasAhorradas,

            habilidades:
                habilidades.length
        });

    return {

        correo:
            correo,

        nombre:
            obtenerNombreInnovadorMetricas(
                correo,
                proyectos
            ),

        score:
            score,

        proyectos:
            proyectos.length,

        ideas:
            ideas.length
    };
}


function calcularScoreMetricas(
    datos
) {

    const total =
        Math.min(
            datos.ideas * 2,
            10
        ) +
        Math.min(
            datos.ideasAprobadas * 5,
            20
        ) +
        Math.min(
            datos.proyectos * 3,
            15
        ) +
        Math.min(
            datos.proyectosCompletados * 7,
            21
        ) +
        Math.min(
            datos.proyectosChampion * 5,
            15
        ) +
        Math.min(
            datos.hitosCompletados * 2,
            10
        ) +
        Math.min(
            datos.horasAhorradas / 100,
            5
        ) +
        Math.min(
            datos.habilidades,
            4
        );

    return Math.min(
        100,
        Math.round(
            total
        )
    );
}


function obtenerNombreInnovadorMetricas(
    correo,
    proyectos
) {

    const usuario =
        obtenerUsuariosMetricas()
            .find(
                function (registro) {

                    return (
                        normalizarCorreoMetricas(
                            registro.correo ||
                            registro.email
                        ) === correo
                    );
                }
            );

    const nombreUsuario =
        usuario?.nombreCompleto ||
        [
            usuario?.nombre,
            usuario?.apellido
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

    if (nombreUsuario) {

        return nombreUsuario;
    }

    for (
        const proyecto of proyectos
    ) {

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
                            normalizarCorreoMetricas(
                                registro.correo ||
                                registro.email
                            ) === correo
                        );
                    }
                );

        if (
            participante?.nombre
        ) {

            return participante.nombre;
        }
    }

    return convertirCorreoNombreMetricas(
        correo
    );
}


function mostrarTopInnovadoresMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "topInnovadoresMetricas"
        );

    if (!contenedor) {
        return;
    }

    const ranking =
        datos.innovadores
            .slice(
                0,
                5
            );

    if (
        ranking.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay información suficiente.
            </div>
        `;

        return;
    }

    const posiciones = [
        "🥇",
        "🥈",
        "🥉",
        "4",
        "5"
    ];

    contenedor.innerHTML =
        ranking
            .map(
                function (
                    persona,
                    indice
                ) {

                    return `
                        <article class="innovador-item">

                            <div class="posicion-innovador">
                                ${posiciones[indice]}
                            </div>

                            <div class="datos-innovador">

                                <strong>
                                    ${escaparMetricas(
                                        persona.nombre
                                    )}
                                </strong>

                                <span>
                                    ${persona.proyectos}
                                    proyectos ·
                                    ${persona.ideas}
                                    ideas
                                </span>

                            </div>

                            <div class="score-innovador">
                                ${persona.score}
                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
HITOS
==================================================
*/

function obtenerTodosLosHitosMetricas(
    proyectos
) {

    const resultado = [];

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

                    resultado.push({
                        ...hito,

                        proyectoId:
                            proyecto.id,

                        proyectoTitulo:
                            proyecto.titulo ||
                            proyecto.nombre ||
                            proyecto.id
                    });
                }
            );
        }
    );

    return resultado;
}


function mostrarProximosHitosMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "proximosHitosMetricas"
        );

    if (!contenedor) {
        return;
    }

    const hoy =
        obtenerHoySinHoraMetricas();

    const hitos =
        datos.hitos
            .filter(
                function (hito) {

                    return (
                        hito.fecha &&
                        ![
                            "completado",
                            "pendiente de verificacion"
                        ].includes(
                            normalizarMetricas(
                                hito.estado
                            )
                        )
                    );
                }
            )
            .map(
                function (hito) {

                    const fecha =
                        convertirFechaMetricas(
                            hito.fecha
                        );

                    return {

                        ...hito,

                        fechaObjeto:
                            fecha,

                        dias:
                            fecha
                                ? diasEntreMetricas(
                                    hoy,
                                    fecha
                                )
                                : 999
                    };
                }
            )
            .filter(
                function (hito) {

                    return (
                        hito.dias <= 14
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        a.fechaObjeto -
                        b.fechaObjeto
                    );
                }
            )
            .slice(
                0,
                8
            );

    if (
        hitos.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No hay hitos próximos o vencidos.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        hitos
            .map(
                function (hito) {

                    const vencido =
                        hito.dias < 0;

                    const diasAbsolutos =
                        Math.abs(
                            hito.dias
                        );

                    const textoFecha =
                        vencido
                            ? "Vencido hace " +
                              diasAbsolutos +
                              (
                                  diasAbsolutos === 1
                                      ? " día"
                                      : " días"
                              )
                            : hito.dias === 0
                                ? "Vence hoy"
                                : "Vence en " +
                                  hito.dias +
                                  (
                                      hito.dias === 1
                                          ? " día"
                                          : " días"
                                  );

                    return `
                        <article
                            class="
                                hito-metrica
                                ${
                                    vencido
                                        ? "vencido"
                                        : "proximo"
                                }
                            "
                        >

                            <strong>
                                ${escaparMetricas(
                                    hito.titulo ||
                                    hito.id ||
                                    "Hito"
                                )}
                            </strong>

                            <span>
                                ${escaparMetricas(
                                    hito.proyectoTitulo
                                )}
                                ·
                                ${escaparMetricas(
                                    hito.nombreResponsable ||
                                    convertirCorreoNombreMetricas(
                                        hito.responsable
                                    )
                                )}
                            </span>

                            <span>
                                ${textoFecha}
                            </span>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
INSIGHTS
==================================================
*/

function mostrarInsightsMetricas(
    datos
) {

    const contenedor =
        document.getElementById(
            "insightsMetricas"
        );

    if (!contenedor) {
        return;
    }

    const insights =
        generarInsightsMetricas(
            datos
        );

    contenedor.innerHTML =
        insights
            .map(
                function (insight) {

                    return `
                        <article
                            class="
                                insight-item
                                ${insight.tipo}
                            "
                        >
                            ${escaparMetricas(
                                insight.texto
                            )}
                        </article>
                    `;
                }
            )
            .join("");
}


function generarInsightsMetricas(
    datos
) {

    const insights = [];

    const totalIdeas =
        datos.ideas.length;

    const totalAprobadas =
        datos.ideasAprobadas.length;

    const tasaAprobacion =
        totalIdeas > 0
            ? Math.round(
                (
                    totalAprobadas /
                    totalIdeas
                ) *
                100
            )
            : 0;

    const problematicos =
        datos
            .clasificacionProyectos
            .enRiesgo +
        datos
            .clasificacionProyectos
            .atrasados;

    const fte =
        datos.horasAhorradas /
        configuracionMetricasActual
            .horasAnualesFte;

    if (
        datos.horasAhorradas > 0
    ) {

        insights.push({

            tipo:
                "positivo",

            texto:
                "Los proyectos completados generan " +
                formatearNumeroMetricas(
                    Math.round(
                        datos.horasAhorradas
                    )
                ) +
                " horas de ahorro anual, equivalentes a " +
                fte.toFixed(
                    1
                ) +
                " FTE."
        });

        insights.push({

            tipo:
                "positivo",

            texto:
                "El valor económico estimado del ahorro asciende a " +
                formatearMonedaMetricas(
                    datos.valorEstimado
                ) +
                " anuales con los precios configurados."
        });
    }

    if (
        tasaAprobacion >= 50 &&
        totalIdeas > 0
    ) {

        insights.push({

            tipo:
                "positivo",

            texto:
                "La tasa de aprobación de ideas es de " +
                tasaAprobacion +
                "%."
        });

    } else if (
        totalIdeas > 0
    ) {

        insights.push({

            tipo:
                "alerta",

            texto:
                "La tasa de aprobación de ideas es de " +
                tasaAprobacion +
                "%. Conviene revisar la calidad de las propuestas o los criterios de evaluación."
        });
    }

    if (
        problematicos > 0
    ) {

        insights.push({

            tipo:
                "alerta",

            texto:
                problematicos +
                (
                    problematicos === 1
                        ? " proyecto requiere"
                        : " proyectos requieren"
                ) +
                " atención por riesgo o atraso."
        });
    }

    if (
        datos.ideasPorArea.length > 0
    ) {

        const areaLider =
            datos.ideasPorArea[0];

        insights.push({

            tipo:
                "",

            texto:
                areaLider.area +
                " es el área con más ideas registradas, con " +
                areaLider.total +
                "."
        });
    }

    if (
        datos.ahorroPorArea.length > 0
    ) {

        const areaMayorAhorro =
            datos.ahorroPorArea[0];

        insights.push({

            tipo:
                "positivo",

            texto:
                areaMayorAhorro.area +
                " genera el mayor ahorro económico estimado: " +
                formatearMonedaMetricas(
                    areaMayorAhorro.valor
                ) +
                " anuales."
        });
    }

    const hitosVencidos =
        datos.hitos.filter(
            function (hito) {

                const fecha =
                    convertirFechaMetricas(
                        hito.fecha
                    );

                return (
                    fecha &&
                    normalizarMetricas(
                        hito.estado
                    ) !== "completado" &&
                    fecha <
                    obtenerHoySinHoraMetricas()
                );
            }
        ).length;

    if (
        hitosVencidos > 0
    ) {

        insights.push({

            tipo:
                "alerta",

            texto:
                "Existen " +
                hitosVencidos +
                (
                    hitosVencidos === 1
                        ? " hito vencido pendiente de atención."
                        : " hitos vencidos pendientes de atención."
                )
        });
    }

    const ultimosMeses =
        datos.progresoMensual.slice(
            -2
        );

    if (
        ultimosMeses.length === 2
    ) {

        const anterior =
            ultimosMeses[0];

        const actual =
            ultimosMeses[1];

        if (
            actual.ideas >
            anterior.ideas
        ) {

            insights.push({

                tipo:
                    "positivo",

                texto:
                    "Las ideas registradas aumentaron de " +
                    anterior.ideas +
                    " a " +
                    actual.ideas +
                    " respecto al mes anterior."
            });

        } else if (
            actual.ideas <
            anterior.ideas
        ) {

            insights.push({

                tipo:
                    "alerta",

                texto:
                    "Las ideas registradas disminuyeron de " +
                    anterior.ideas +
                    " a " +
                    actual.ideas +
                    " respecto al mes anterior."
            });
        }
    }

    if (
        insights.length === 0
    ) {

        insights.push({

            tipo:
                "",

            texto:
                "Todavía no existe suficiente información para generar conclusiones ejecutivas."
        });
    }

    return insights.slice(
        0,
        8
    );
}


/*
==================================================
UTILIDADES DE DATOS
==================================================
*/

function esIdeaAprobadaMetricas(
    idea
) {

    return [
        "aprobada",
        "aprobado",
        "convertida en oportunidad",
        "en proyecto",
        "implementada",
        "completada"
    ].includes(
        normalizarMetricas(
            idea.estado
        )
    );
}


/*
==================================================
UTILIDADES DE FECHAS
==================================================
*/

function convertirFechaMetricas(
    valor
) {

    if (!valor) {
        return null;
    }

    let fecha;

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(valor)
        )
    ) {

        fecha =
            new Date(
                valor +
                "T00:00:00"
            );

    } else {

        fecha =
            new Date(
                valor
            );
    }

    return Number.isNaN(
        fecha.getTime()
    )
        ? null
        : fecha;
}


function obtenerHoySinHoraMetricas() {

    const hoy =
        new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );

    return hoy;
}


function diasEntreMetricas(
    fechaInicial,
    fechaFinal
) {

    return Math.ceil(
        (
            fechaFinal.getTime() -
            fechaInicial.getTime()
        ) /
        (
            1000 *
            60 *
            60 *
            24
        )
    );
}


/*
==================================================
UTILIDADES GENERALES
==================================================
*/

function obtenerValorMetricas(
    id
) {

    return String(
        document
            .getElementById(
                id
            )
            ?.value ||
        ""
    ).trim();
}


function asignarValorMetricas(
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


function asignarTextoMetricas(
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


function normalizarMetricas(
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


function normalizarCorreoMetricas(
    correo
) {

    return String(
        correo ||
        ""
    )
        .trim()
        .toLowerCase();
}


function obtenerNumeroMetricas(
    valor
) {

    const numero =
        Number(
            valor
        );

    return Number.isFinite(
        numero
    )
        ? numero
        : 0;
}


function obtenerNumeroPositivoMetricas(
    valor,
    respaldo
) {

    const numero =
        Number(
            valor
        );

    return (
        Number.isFinite(
            numero
        ) &&
        numero > 0
    )
        ? numero
        : respaldo;
}


function obtenerNumeroNoNegativoMetricas(
    valor,
    respaldo
) {

    const numero =
        Number(
            valor
        );

    return (
        Number.isFinite(
            numero
        ) &&
        numero >= 0
    )
        ? numero
        : respaldo;
}


function limitarMetricas(
    valor,
    minimo,
    maximo
) {

    return Math.min(
        maximo,
        Math.max(
            minimo,
            obtenerNumeroMetricas(
                valor
            )
        )
    );
}


function formatearNumeroMetricas(
    numero
) {

    return Number(
        numero ||
        0
    ).toLocaleString(
        "es-MX",
        {
            maximumFractionDigits:
                0
        }
    );
}


function formatearMonedaMetricas(
    numero
) {

    return Number(
        numero ||
        0
    ).toLocaleString(
        "es-MX",
        {
            style:
                "currency",

            currency:
                "MXN",

            maximumFractionDigits:
                0
        }
    );
}


function formatearMonedaCompactaMetricas(
    numero
) {

    const valor =
        Number(
            numero ||
            0
        );

    if (
        valor >= 1000000
    ) {

        return (
            "$" +
            (
                valor /
                1000000
            ).toFixed(
                1
            ) +
            " M"
        );
    }

    if (
        valor >= 1000
    ) {

        return (
            "$" +
            (
                valor /
                1000
            ).toFixed(
                0
            ) +
            " mil"
        );
    }

    return formatearMonedaMetricas(
        valor
    );
}


function convertirCorreoNombreMetricas(
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


function escaparMetricas(
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


function escaparAtributoMetricas(
    texto
) {

    return String(
        texto ||
        ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );
}