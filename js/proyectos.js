/*
==================================================
OCTOFLOW - PROYECTOS DEL COLABORADOR
==================================================
*/

let proyectoSeleccionado = null;
let vistaProyectosActual = "activos";


document.addEventListener(
    "DOMContentLoaded",
    iniciarProyectosColaborador
);


/*
==================================================
INICIAR
==================================================
*/

function iniciarProyectosColaborador() {

    configurarPestanasProyectos();

    configurarFiltros();

    configurarPanel();

    actualizarPortal();
}


/*
==================================================
SESIÓN
==================================================
*/

function correoUsuario() {

    return sessionStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


function nombreUsuario() {

    return (
        sessionStorage.getItem(
            "octoflowNombreCompleto"
        ) ||
        correoANombre(
            correoUsuario()
        )
    );
}


/*
==================================================
ALMACENAMIENTO
==================================================
*/

function leerProyectos() {

    try {

        const proyectos =
            JSON.parse(
                localStorage.getItem(
                    "octoflowProyectos"
                ) || "[]"
            );

        return Array.isArray(
            proyectos
        )
            ? proyectos
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer los proyectos.",
            error
        );

        return [];
    }
}


function guardarProyectos(
    proyectos
) {

    localStorage.setItem(
        "octoflowProyectos",
        JSON.stringify(
            proyectos
        )
    );
}


/*
==================================================
PROYECTOS DEL USUARIO
==================================================
*/

function misProyectos() {

    const correo =
        normalizarProyecto(
            correoUsuario()
        );

    return leerProyectos()
        .filter(
            function (proyecto) {

                const participantes =
                    Array.isArray(
                        proyecto.participantes
                    )
                        ? proyecto.participantes
                        : [];

                return participantes.some(
                    function (participante) {

                        return (
                            normalizarProyecto(
                                participante.correo
                            ) === correo
                        );
                    }
                );
            }
        );
}


function proyectosActivosUsuario() {

    return misProyectos()
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
}


function proyectosCompletadosUsuario() {

    return misProyectos()
        .filter(
            function (proyecto) {

                return normalizarProyecto(
                    proyecto.estado
                ) === "completado";
            }
        );
}


function miParticipacion(
    proyecto
) {

    const correo =
        normalizarProyecto(
            correoUsuario()
        );

    const participantes =
        Array.isArray(
            proyecto.participantes
        )
            ? proyecto.participantes
            : [];

    return participantes.find(
        function (participante) {

            return (
                normalizarProyecto(
                    participante.correo
                ) === correo
            );
        }
    ) || null;
}


/*
==================================================
ACTUALIZAR PORTAL
==================================================
*/

function actualizarPortal() {

    actualizarResumen();

    mostrarProyectosActivos();

    mostrarProyectosCompletados();
}


function actualizarResumen() {

    const proyectos =
        misProyectos();

    const activos =
        proyectosActivosUsuario();

    const completados =
        proyectosCompletadosUsuario();

    const champions =
        proyectos.filter(
            function (proyecto) {

                return normalizarProyecto(
                    miParticipacion(
                        proyecto
                    )?.rol
                ) === "champion";
            }
        ).length;

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

                            return (
                                normalizarProyecto(
                                    hito.responsable
                                ) ===
                                    normalizarProyecto(
                                        correoUsuario()
                                    )
                                &&
                                normalizarProyecto(
                                    hito.estado
                                ) ===
                                    "pendiente de verificacion"
                            );
                        }
                    ).length
                );
            },
            0
        );

    asignarTexto(
        "totalProyectosActivos",
        activos.length
    );

    asignarTexto(
        "totalProyectosChampion",
        champions
    );

    asignarTexto(
        "totalHitosVerificacion",
        verificaciones
    );

    asignarTexto(
        "totalProyectosCompletados",
        completados.length
    );

    asignarTexto(
        "contadorPestanaActivos",
        activos.length
    );

    asignarTexto(
        "contadorPestanaCompletados",
        completados.length
    );
}


/*
==================================================
FILTROS
==================================================
*/

function obtenerProyectosFiltrados(
    proyectos
) {

    const busqueda =
        normalizarProyecto(
            document
                .getElementById(
                    "buscarProyecto"
                )
                ?.value || ""
        );

    const estado =
        normalizarProyecto(
            document
                .getElementById(
                    "filtroEstadoProyecto"
                )
                ?.value || ""
        );

    const rol =
        normalizarProyecto(
            document
                .getElementById(
                    "filtroRolProyecto"
                )
                ?.value || ""
        );

    return proyectos.filter(
        function (proyecto) {

            const participacion =
                miParticipacion(
                    proyecto
                );

            const texto =
                normalizarProyecto(
                    [
                        proyecto.id,
                        proyecto.titulo,
                        proyecto.nombre,
                        proyecto.area,
                        proyecto.descripcion
                    ].join(" ")
                );

            const coincideBusqueda =
                !busqueda ||
                texto.includes(
                    busqueda
                );

            const coincideEstado =
                !estado ||
                normalizarProyecto(
                    proyecto.estado
                ) === estado;

            const coincideRol =
                !rol ||
                normalizarProyecto(
                    participacion?.rol
                ) === rol;

            return (
                coincideBusqueda &&
                coincideEstado &&
                coincideRol
            );
        }
    );
}


/*
==================================================
MOSTRAR PROYECTOS ACTIVOS
==================================================
*/

function mostrarProyectosActivos() {

    const contenedor =
        document.getElementById(
            "listaProyectosActivos"
        );

    if (!contenedor) {
        return;
    }

    const proyectos =
        obtenerProyectosFiltrados(
            proyectosActivosUsuario()
        );

    asignarTexto(
        "contadorProyectosActivos",
        proyectos.length === 1
            ? "1 proyecto"
            : proyectos.length +
              " proyectos"
    );

    if (proyectos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No se encontraron proyectos activos.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        proyectos
            .map(
                function (proyecto) {

                    return generarTarjetaProyecto(
                        proyecto,
                        false
                    );
                }
            )
            .join("");
}


/*
==================================================
MOSTRAR PROYECTOS COMPLETADOS
==================================================
*/

function mostrarProyectosCompletados() {

    const contenedor =
        document.getElementById(
            "listaProyectosCompletados"
        );

    if (!contenedor) {
        return;
    }

    const proyectos =
        obtenerProyectosFiltrados(
            proyectosCompletadosUsuario()
        );

    asignarTexto(
        "contadorProyectosCompletados",
        proyectos.length === 1
            ? "1 proyecto"
            : proyectos.length +
              " proyectos"
    );

    if (proyectos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Todavía no tienes proyectos completados.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        proyectos
            .map(
                function (proyecto) {

                    return generarTarjetaProyecto(
                        proyecto,
                        true
                    );
                }
            )
            .join("");
}


/*
==================================================
GENERAR TARJETA
==================================================
*/

function generarTarjetaProyecto(
    proyecto,
    completado
) {

    const participacion =
        miParticipacion(
            proyecto
        );

    const hitos =
        misHitos(
            proyecto
        );

    const pendientes =
        hitos.filter(
            function (hito) {

                return estadoVisualHito(
                    hito
                ) !== "Completado";
            }
        ).length;

    const avance =
        limitarAvance(
            proyecto.avance
        );

    const claseEstado =
        normalizarProyecto(
            proyecto.estado
        )
            .replace(
                /\s+/g,
                "-"
            );

    return `
        <article
            class="
                tarjeta-mi-proyecto
                ${
                    completado
                        ? "completado"
                        : ""
                }
            "
            onclick="abrirDetalleProyecto(
                '${escaparAtributo(
                    proyecto.id
                )}'
            )"
        >

            <div class="tarjeta-proyecto-cabecera">

                <div>

                    <span class="codigo-oportunidad">
                        ${escaparTexto(
                            proyecto.id
                        )}
                    </span>

                    <h3>
                        ${escaparTexto(
                            proyecto.titulo ||
                            proyecto.nombre ||
                            "Proyecto"
                        )}
                    </h3>

                </div>

                <span
                    class="
                        estado-proyecto-colaborador
                        ${claseEstado}
                    "
                >
                    ${escaparTexto(
                        proyecto.estado ||
                        "Activo"
                    )}
                </span>

            </div>

            <div class="rol-proyecto-colaborador">

                <span>
                    Tu rol
                </span>

                <strong>
                    ${escaparTexto(
                        participacion?.rol ||
                        "Contributor"
                    )}
                </strong>

            </div>

            <div class="meta-proyecto">

                <span>
                    ${escaparTexto(
                        proyecto.area ||
                        "Sin área"
                    )}
                </span>

                <span>
                    ${hitos.length}
                    hitos asignados
                </span>

                ${
                    completado
                        ? `
                            <span>
                                ${Number(
                                    proyecto
                                        .horasAhorradasAnuales ||
                                    0
                                )}
                                horas/año
                            </span>
                        `
                        : `
                            <span>
                                ${pendientes}
                                abiertos
                            </span>
                        `
                }

            </div>

            <p class="descripcion-proyecto">
                ${escaparTexto(
                    proyecto.descripcion ||
                    proyecto.objetivo ||
                    "Sin descripción"
                )}
            </p>

            <div class="avance-proyecto-tarjeta">

                <div>

                    <span>
                        Avance
                    </span>

                    <strong>
                        ${avance}%
                    </strong>

                </div>

                <div class="barra-progreso">

                    <span
                        style="width: ${avance}%"
                    ></span>

                </div>

            </div>

            ${
                completado
                    ? `
                        <div class="resultado-proyecto-completado">

                            <span>
                                Resultado final
                            </span>

                            <p>
                                ${escaparTexto(
                                    proyecto.resultadoFinal ||
                                    "Proyecto completado."
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }

            <button
                class="boton-principal boton-ver-proyecto"
                type="button"
                onclick="
                    event.stopPropagation();
                    abrirDetalleProyecto(
                        '${escaparAtributo(
                            proyecto.id
                        )}'
                    );
                "
            >
                ${
                    completado
                        ? "Ver resultado"
                        : "Ver proyecto"
                }
            </button>

        </article>
    `;
}


/*
==================================================
PESTAÑAS
==================================================
*/

function configurarPestanasProyectos() {

    document
        .querySelectorAll(
            "[data-vista-proyecto-colaborador]"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        cambiarVistaProyectos(
                            boton.dataset
                                .vistaProyectoColaborador
                        );
                    }
                );
            }
        );
}


function cambiarVistaProyectos(
    vista
) {

    vistaProyectosActual =
        vista;

    document
        .querySelectorAll(
            "[data-vista-proyecto-colaborador]"
        )
        .forEach(
            function (boton) {

                boton.classList.toggle(
                    "activa",
                    boton.dataset
                        .vistaProyectoColaborador ===
                        vista
                );
            }
        );

    document
        .getElementById(
            "vistaProyectosActivos"
        )
        ?.classList.toggle(
            "oculto",
            vista !== "activos"
        );

    document
        .getElementById(
            "vistaProyectosCompletados"
        )
        ?.classList.toggle(
            "oculto",
            vista !== "completados"
        );

    ajustarFiltroEstadoPorVista();
}


function ajustarFiltroEstadoPorVista() {

    const selector =
        document.getElementById(
            "filtroEstadoProyecto"
        );

    if (!selector) {
        return;
    }

    if (
        vistaProyectosActual ===
        "completados"
    ) {

        selector.value =
            "Completado";

    } else if (
        normalizarProyecto(
            selector.value
        ) === "completado"
    ) {

        selector.value =
            "";
    }

    mostrarProyectosActivos();

    mostrarProyectosCompletados();
}


/*
==================================================
ABRIR DETALLE
==================================================
*/

function abrirDetalleProyecto(
    proyectoId
) {

    proyectoSeleccionado =
        misProyectos()
            .find(
                function (proyecto) {

                    return String(
                        proyecto.id
                    ) === String(
                        proyectoId
                    );
                }
            ) || null;

    if (!proyectoSeleccionado) {

        mostrarNotificacion(
            "No fue posible encontrar el proyecto."
        );

        return;
    }

    const proyecto =
        proyectoSeleccionado;

    const participacion =
        miParticipacion(
            proyecto
        );

    const completado =
        proyectoEstaCompletado(
            proyecto
        );

    asignarTexto(
        "detalleNombreProyecto",
        proyecto.titulo ||
        proyecto.nombre ||
        "Proyecto"
    );

    asignarTexto(
        "detalleRolProyecto",
        participacion?.rol ||
        "Contributor"
    );

    asignarTexto(
        "detalleEstadoProyecto",
        proyecto.estado ||
        "Activo"
    );

    asignarTexto(
        "detalleAvanceProyecto",
        limitarAvance(
            proyecto.avance
        ) + "%"
    );

    asignarTexto(
        "detalleCodigoProyecto",
        proyecto.id
    );

    asignarTexto(
        "detalleAreaProyecto",
        proyecto.area ||
        "Sin área"
    );

    asignarTexto(
        "detalleFechaObjetivoProyecto",
        formatearFecha(
            proyecto.fechaObjetivo
        )
    );

    asignarTexto(
        "detalleHorasAhorradasProyecto",
        Number(
            proyecto.horasAhorradasAnuales ||
            0
        ) + " horas/año"
    );

    asignarTexto(
        "detalleObjetivoProyecto",
        proyecto.objetivo ||
        "No registrado"
    );

    asignarTexto(
        "detalleEntregableProyecto",
        proyecto.entregablePrincipal ||
        "No registrado"
    );

    const barra =
        document.getElementById(
            "barraAvanceDetalleProyecto"
        );

    if (barra) {

        barra.style.width =
            limitarAvance(
                proyecto.avance
            ) + "%";
    }

    const aviso =
        document.getElementById(
            "avisoProyectoSoloLectura"
        );

    aviso?.classList.toggle(
        "visible",
        completado
    );

    const ayudaHitos =
        document.getElementById(
            "textoAyudaHitosProyecto"
        );

    if (ayudaHitos) {

        ayudaHitos.textContent =
            completado
                ? "Este proyecto está completado. Los hitos se muestran únicamente para consulta."
                : "Puedes solicitar que un hito sea completado. El gerente debe verificarlo.";
    }

    const resultado =
        document.getElementById(
            "resultadoFinalProyectoColaborador"
        );

    resultado?.classList.toggle(
        "visible",
        completado
    );

    asignarTexto(
        "textoResultadoFinalProyecto",
        proyecto.resultadoFinal ||
        "Proyecto completado."
    );

    mostrarEquipo(
        proyecto
    );

    mostrarHitos(
        proyecto
    );

    mostrarHistorial(
        proyecto
    );

    const panel =
        document.getElementById(
            "panelDetalleProyecto"
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


function cerrarDetalleProyecto() {

    const panel =
        document.getElementById(
            "panelDetalleProyecto"
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

    proyectoSeleccionado =
        null;
}


/*
==================================================
PANEL
==================================================
*/

function configurarPanel() {

    document
        .getElementById(
            "cerrarDetalleProyecto"
        )
        ?.addEventListener(
            "click",
            cerrarDetalleProyecto
        );

    document
        .getElementById(
            "cerrarDetalleProyectoInferior"
        )
        ?.addEventListener(
            "click",
            cerrarDetalleProyecto
        );

    document
        .getElementById(
            "panelDetalleProyecto"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "panelDetalleProyecto"
                ) {

                    cerrarDetalleProyecto();
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

                cerrarDetalleProyecto();
            }
        }
    );
}


/*
==================================================
EQUIPO
==================================================
*/

function mostrarEquipo(
    proyecto
) {

    const contenedor =
        document.getElementById(
            "detalleEquipoProyecto"
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
                Equipo no definido.
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
                        correoANombre(
                            participante.correo
                        );

                    return `
                        <article class="miembro-equipo">

                            <div class="avatar-equipo">
                                ${obtenerIniciales(
                                    nombre
                                )}
                            </div>

                            <div>

                                <strong>
                                    ${escaparTexto(
                                        nombre
                                    )}
                                </strong>

                                <span>
                                    ${escaparTexto(
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


/*
==================================================
HITOS
==================================================
*/

function misHitos(
    proyecto
) {

    const correo =
        normalizarProyecto(
            correoUsuario()
        );

    const hitos =
        Array.isArray(
            proyecto.hitos
        )
            ? proyecto.hitos
            : [];

    return hitos.filter(
        function (hito) {

            return normalizarProyecto(
                hito.responsable
            ) === correo;
        }
    );
}


function estadoVisualHito(
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

    if (estado === "rechazado") {

        return "Rechazado";
    }

    if (
        hito.fecha &&
        new Date(
            hito.fecha +
            "T00:00:00"
        ) <
        obtenerFechaActualSinHora()
    ) {

        return "Vencido";
    }

    return "Pendiente";
}


function mostrarHitos(
    proyecto
) {

    const contenedor =
        document.getElementById(
            "listaHitosColaborador"
        );

    if (!contenedor) {
        return;
    }

    const hitos =
        misHitos(
            proyecto
        );

    const proyectoCompletado =
        proyectoEstaCompletado(
            proyecto
        );

    asignarTexto(
        "contadorHitosColaborador",
        hitos.length === 1
            ? "1 hito"
            : hitos.length +
              " hitos"
    );

    if (hitos.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No tienes hitos asignados.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        hitos
            .map(
                function (hito) {

                    const estado =
                        estadoVisualHito(
                            hito
                        );

                    const clase =
                        obtenerClaseEstado(
                            estado
                        );

                    const comentarios =
                        Array.isArray(
                            hito.comentarios
                        )
                            ? hito.comentarios
                            : [];

                    const puedeComentar =
                        !proyectoCompletado &&
                        normalizarProyecto(
                            hito.estado
                        ) !== "completado";

                    const puedeSolicitar =
                        !proyectoCompletado &&
                        ![
                            "completado",
                            "pendiente de verificacion"
                        ].includes(
                            normalizarProyecto(
                                hito.estado
                            )
                        );

                    const puedeIniciar =
                        !proyectoCompletado &&
                        [
                            "pendiente",
                            "vencido",
                            "rechazado"
                        ].includes(
                            normalizarProyecto(
                                estado
                            )
                        );

                    return `
                        <article
                            class="
                                hito-colaborador
                                ${clase}
                            "
                        >

                            <div class="cabecera-hito-colaborador">

                                <h4>
                                    ${escaparTexto(
                                        hito.titulo
                                    )}
                                </h4>

                                <span
                                    class="
                                        estado-hito-colaborador
                                        ${clase}
                                    "
                                >
                                    ${escaparTexto(
                                        estado
                                    )}
                                </span>

                            </div>

                            <div class="datos-hito-colaborador">

                                <span>
                                    Fecha:
                                    ${formatearFecha(
                                        hito.fecha
                                    )}
                                </span>

                                <span>
                                    Avance esperado:
                                    ${limitarAvance(
                                        hito.avanceEsperado
                                    )}%
                                </span>

                            </div>

                            <p class="descripcion-hito-colaborador">
                                ${escaparTexto(
                                    hito.descripcion ||
                                    ""
                                )}
                            </p>

                            ${
                                hito.solicitudCompletado
                                    ? `
                                        <div class="solicitud-box">

                                            <strong>
                                                Solicitud enviada
                                            </strong>

                                            <br>

                                            ${escaparTexto(
                                                hito
                                                    .solicitudCompletado
                                                    .comentario ||
                                                ""
                                            )}

                                            <br>

                                            <small>
                                                ${formatearFechaHora(
                                                    hito
                                                        .solicitudCompletado
                                                        .fecha
                                                )}
                                            </small>

                                        </div>
                                    `
                                    : ""
                            }

                            ${
                                hito.verificacion
                                    ? `
                                        <div class="verificacion-box">

                                            <strong>
                                                Respuesta del gerente:
                                                ${escaparTexto(
                                                    hito.verificacion
                                                        .resultado ||
                                                    ""
                                                )}
                                            </strong>

                                            <br>

                                            ${escaparTexto(
                                                hito.verificacion
                                                    .comentario ||
                                                ""
                                            )}

                                            <br>

                                            <small>
                                                ${formatearFechaHora(
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
                                        <div class="comentarios-hito">

                                            ${comentarios
                                                .map(
                                                    function (
                                                        comentario
                                                    ) {

                                                        return `
                                                            <div class="comentario-item">

                                                                <strong>
                                                                    ${escaparTexto(
                                                                        comentario
                                                                            .autorNombre ||
                                                                        correoANombre(
                                                                            comentario
                                                                                .autor
                                                                        )
                                                                    )}
                                                                </strong>

                                                                :
                                                                ${escaparTexto(
                                                                    comentario.texto
                                                                )}

                                                                <br>

                                                                <small>
                                                                    ${formatearFechaHora(
                                                                        comentario.fecha
                                                                    )}
                                                                </small>

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

                            ${
                                proyectoCompletado
                                    ? ""
                                    : `
                                        <div class="acciones-hito-colaborador">

                                            ${
                                                puedeIniciar
                                                    ? `
                                                        <button
                                                            class="btn-hito"
                                                            type="button"
                                                            onclick="
                                                                event.stopPropagation();
                                                                marcarEnProceso(
                                                                    '${escaparAtributo(
                                                                        hito.id
                                                                    )}'
                                                                );
                                                            "
                                                        >
                                                            Marcar en proceso
                                                        </button>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                puedeSolicitar
                                                    ? `
                                                        <button
                                                            class="btn-completar"
                                                            type="button"
                                                            onclick="
                                                                event.stopPropagation();
                                                                solicitarCompletado(
                                                                    '${escaparAtributo(
                                                                        hito.id
                                                                    )}'
                                                                );
                                                            "
                                                        >
                                                            Solicitar completado
                                                        </button>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                puedeComentar
                                                    ? `
                                                        <button
                                                            class="btn-hito"
                                                            type="button"
                                                            onclick="
                                                                event.stopPropagation();
                                                                agregarComentarioHito(
                                                                    '${escaparAtributo(
                                                                        hito.id
                                                                    )}'
                                                                );
                                                            "
                                                        >
                                                            Agregar comentario
                                                        </button>
                                                    `
                                                    : ""
                                            }

                                        </div>
                                    `
                            }

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
BUSCAR HITO
==================================================
*/

function encontrarHito(
    hitoId
) {

    const proyectos =
        leerProyectos();

    const proyecto =
        proyectos.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    proyectoSeleccionado?.id
                );
            }
        );

    const hito =
        proyecto?.hitos?.find(
            function (registro) {

                return String(
                    registro.id
                ) === String(
                    hitoId
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
CAMBIAR HITO A EN PROCESO
==================================================
*/

function marcarEnProceso(
    hitoId
) {

    const {
        proyectos,
        proyecto,
        hito
    } =
        encontrarHito(
            hitoId
        );

    if (
        !proyecto ||
        !hito ||
        proyectoEstaCompletado(
            proyecto
        )
    ) {

        return;
    }

    hito.estado =
        "En proceso";

    hito.verificacion =
        null;

    registrarEventoColaborador(
        proyecto,
        "hito",
        'El hito "' +
        hito.titulo +
        '" se marcó como En proceso.',
        "En proceso"
    );

    guardarProyectos(
        proyectos
    );

    refrescarProyecto(
        proyecto,
        "Hito actualizado."
    );
}


/*
==================================================
SOLICITAR COMPLETADO
==================================================
*/

function solicitarCompletado(
    hitoId
) {

    const comentario =
        window.prompt(
            "Describe qué quedó terminado. Este comentario es obligatorio:"
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
        encontrarHito(
            hitoId
        );

    if (
        !proyecto ||
        !hito ||
        proyectoEstaCompletado(
            proyecto
        )
    ) {

        return;
    }

    hito.estado =
        "Pendiente de verificación";

    hito.solicitudCompletado = {

        fecha:
            new Date().toISOString(),

        correo:
            correoUsuario(),

        nombre:
            nombreUsuario(),

        comentario:
            comentario.trim()

    };

    hito.verificacion =
        null;

    registrarEventoColaborador(
        proyecto,
        "hito",
        'Se solicitó verificar el hito "' +
        hito.titulo +
        '". ' +
        comentario.trim(),
        "Pendiente de verificación"
    );

    guardarProyectos(
        proyectos
    );

    refrescarProyecto(
        proyecto,
        "Solicitud enviada al gerente."
    );
}


/*
==================================================
COMENTARIO EN HITO
==================================================
*/

function agregarComentarioHito(
    hitoId
) {

    const texto =
        window.prompt(
            "Escribe tu comentario:"
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
        encontrarHito(
            hitoId
        );

    if (
        !proyecto ||
        !hito ||
        proyectoEstaCompletado(
            proyecto
        ) ||
        normalizarProyecto(
            hito.estado
        ) === "completado"
    ) {

        return;
    }

    if (!Array.isArray(
        hito.comentarios
    )) {

        hito.comentarios = [];
    }

    hito.comentarios.unshift({

        id:
            generarIdentificador(),

        texto:
            texto.trim(),

        fecha:
            new Date().toISOString(),

        autor:
            correoUsuario(),

        autorNombre:
            nombreUsuario(),

        rol:
            "colaborador"

    });

    guardarProyectos(
        proyectos
    );

    refrescarProyecto(
        proyecto,
        "Comentario agregado."
    );
}


/*
==================================================
REGISTRAR EVENTO
==================================================
*/

function registrarEventoColaborador(
    proyecto,
    tipo,
    comentario,
    estado
) {

    if (!Array.isArray(
        proyecto.actualizaciones
    )) {

        proyecto.actualizaciones = [];
    }

    proyecto.actualizaciones.unshift({

        id:
            generarIdentificador(),

        tipo:
            tipo,

        fecha:
            new Date().toISOString(),

        comentario:
            comentario,

        estado:
            estado,

        avance:
            limitarAvance(
                proyecto.avance
            ),

        autor:
            correoUsuario(),

        autorNombre:
            nombreUsuario(),

        origen:
            "colaborador"

    });
}


/*
==================================================
REFRESCAR PANEL
==================================================
*/

function refrescarProyecto(
    proyecto,
    mensaje
) {

    proyectoSeleccionado =
        proyecto;

    mostrarHitos(
        proyecto
    );

    mostrarHistorial(
        proyecto
    );

    actualizarPortal();

    if (mensaje) {

        mostrarNotificacion(
            mensaje
        );
    }
}


/*
==================================================
HISTORIAL
==================================================
*/

function mostrarHistorial(
    proyecto
) {

    const contenedor =
        document.getElementById(
            "historialProyectoColaborador"
        );

    if (!contenedor) {
        return;
    }

    const registros =
        Array.isArray(
            proyecto.actualizaciones
        )
            ? [...proyecto.actualizaciones]
            : [];

    asignarTexto(
        "contadorHistorialColaborador",
        registros.length === 1
            ? "1 registro"
            : registros.length +
              " registros"
    );

    if (registros.length === 0) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Sin registros.
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

                    const tipo =
                        normalizarProyecto(
                            registro.tipo
                        ) === "hito"
                            ? "Hito"
                            : "Proyecto";

                    return `
                        <article class="registro-historial-colaborador">

                            <header>

                                <strong>
                                    ${tipo}
                                </strong>

                                <small>
                                    ${formatearFechaHora(
                                        registro.fecha
                                    )}
                                </small>

                            </header>

                            <p>
                                ${escaparTexto(
                                    registro.comentario ||
                                    ""
                                )}
                            </p>

                            <small>
                                ${escaparTexto(
                                    registro.estado ||
                                    ""
                                )}
                                ·
                                ${limitarAvance(
                                    registro.avance
                                )}%
                                ·
                                ${escaparTexto(
                                    registro.autorNombre ||
                                    correoANombre(
                                        registro.autor
                                    )
                                )}

                                ${
                                    registro.editado
                                        ? " · Editado por gerente"
                                        : ""
                                }
                            </small>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
CONFIGURAR FILTROS
==================================================
*/

function configurarFiltros() {

    const buscador =
        document.getElementById(
            "buscarProyecto"
        );

    const filtroEstado =
        document.getElementById(
            "filtroEstadoProyecto"
        );

    const filtroRol =
        document.getElementById(
            "filtroRolProyecto"
        );

    buscador?.addEventListener(
        "input",
        actualizarListasFiltradas
    );

    filtroEstado?.addEventListener(
        "change",
        actualizarListasFiltradas
    );

    filtroRol?.addEventListener(
        "change",
        actualizarListasFiltradas
    );

    document
        .getElementById(
            "limpiarFiltrosProyectos"
        )
        ?.addEventListener(
            "click",
            function () {

                if (buscador) {
                    buscador.value = "";
                }

                if (filtroRol) {
                    filtroRol.value = "";
                }

                if (filtroEstado) {

                    filtroEstado.value =
                        vistaProyectosActual ===
                        "completados"
                            ? "Completado"
                            : "";
                }

                actualizarListasFiltradas();
            }
        );
}


function actualizarListasFiltradas() {

    mostrarProyectosActivos();

    mostrarProyectosCompletados();
}


/*
==================================================
UTILIDADES
==================================================
*/

function proyectoEstaCompletado(
    proyecto
) {

    return normalizarProyecto(
        proyecto?.estado
    ) === "completado";
}


function obtenerFechaActualSinHora() {

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


function obtenerClaseEstado(
    estado
) {

    return normalizarProyecto(
        estado
    )
        .replace(
            /\s+/g,
            "-"
        );
}


function limitarAvance(
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


function normalizarProyecto(
    valor
) {

    return String(
        valor ||
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


function asignarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor ?? "—";
    }
}


function correoANombre(
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


function formatearFecha(
    valor
) {

    if (!valor) {

        return "Sin fecha";
    }

    const partes =
        String(valor)
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

    return valor;
}


function formatearFechaHora(
    valor
) {

    const fecha =
        new Date(valor);

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return "Sin fecha";
    }

    return fecha.toLocaleString(
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


function generarIdentificador() {

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


function escaparTexto(
    valor
) {

    const elemento =
        document.createElement(
            "div"
        );

    elemento.textContent =
        valor ?? "";

    return elemento.innerHTML;
}


function escaparAtributo(
    valor
) {

    return String(
        valor ||
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