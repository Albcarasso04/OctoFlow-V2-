/*
==================================================
OCTOFLOW - DIRECTORIO DE TALENTO
==================================================
*/

let directorioTalento = [];
let talentoSeleccionado = null;


/*
==================================================
INICIAR
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloTalento
);


function iniciarModuloTalento() {

    configurarFiltrosTalento();

    configurarPanelTalento();

    configurarPanelInnovationScore();

    actualizarModuloTalento();
}


/*
==================================================
ACTUALIZAR MÓDULO
==================================================
*/

function actualizarModuloTalento() {

    directorioTalento =
        construirDirectorioTalento();

    cargarFiltrosTalento();

    actualizarIndicadoresTalento();

    mostrarRankingTalento();

    mostrarDirectorioTalento();
}


/*
==================================================
ALMACENAMIENTO
==================================================
*/

function leerColeccionTalento(
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


function obtenerUsuariosTalento() {

    return leerColeccionTalento(
        "octoflowUsuarios"
    );
}


function obtenerPerfilesTalento() {

    return leerColeccionTalento(
        "octoflowPerfilesHabilidades"
    );
}


function obtenerHabilidadesTalento() {

    return leerColeccionTalento(
        "octoflowHabilidades"
    );
}


function obtenerIdeasTalento() {

    return leerColeccionTalento(
        "octoflowIdeas"
    );
}


function obtenerProyectosTalento() {

    return leerColeccionTalento(
        "octoflowProyectos"
    );
}


function obtenerPostulacionesTalento() {

    return leerColeccionTalento(
        "octoflowPostulaciones"
    );
}


/*
==================================================
CONSTRUIR DIRECTORIO
==================================================
*/

function construirDirectorioTalento() {

    return obtenerCorreosDirectorioTalento()
        .map(
            construirPerfilTalento
        )
        .filter(
            function (perfil) {

                return Boolean(
                    perfil.correo
                );
            }
        )
        .sort(
            function (a, b) {

                return b.score -
                    a.score;
            }
        );
}


/*
==================================================
OBTENER CORREOS
==================================================
*/

function obtenerCorreosDirectorioTalento() {

    const correos =
        new Set();

    function agregarCorreo(
        correo
    ) {

        const valor =
            normalizarCorreoTalento(
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


    obtenerUsuariosTalento()
        .forEach(
            function (usuario) {

                agregarCorreo(
                    usuario.correo ||
                    usuario.email
                );
            }
        );


    obtenerPerfilesTalento()
        .forEach(
            function (perfil) {

                agregarCorreo(
                    perfil.correo ||
                    perfil.email
                );
            }
        );


    obtenerHabilidadesTalento()
        .forEach(
            function (habilidad) {

                agregarCorreo(
                    habilidad.correo ||
                    habilidad.email
                );
            }
        );


    obtenerIdeasTalento()
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


    obtenerPostulacionesTalento()
        .forEach(
            function (postulacion) {

                agregarCorreo(
                    postulacion.correo ||
                    postulacion.email
                );
            }
        );


    obtenerProyectosTalento()
        .forEach(
            function (proyecto) {

                const participantes =
                    Array.isArray(
                        proyecto.participantes
                    )
                        ? proyecto.participantes
                        : [];

                participantes.forEach(
                    function (participante) {

                        agregarCorreo(
                            participante.correo ||
                            participante.email
                        );
                    }
                );

                const hitos =
                    Array.isArray(
                        proyecto.hitos
                    )
                        ? proyecto.hitos
                        : [];

                hitos.forEach(
                    function (hito) {

                        agregarCorreo(
                            hito.responsable
                        );
                    }
                );
            }
        );


    const usuarios =
        obtenerUsuariosTalento();

    return [
        ...correos
    ]
        .filter(
            function (correo) {

                const usuario =
                    usuarios.find(
                        function (registro) {

                            return (
                                normalizarCorreoTalento(
                                    registro.correo ||
                                    registro.email
                                ) === correo
                            );
                        }
                    );

                return (
                    !usuario ||
                    normalizarTalento(
                        usuario.rol
                    ) !== "gerente"
                );
            }
        );
}


/*
==================================================
CONSTRUIR PERFIL
==================================================
*/

function construirPerfilTalento(
    correo
) {

    const usuario =
        obtenerUsuarioPorCorreoTalento(
            correo
        );

    const perfil =
        obtenerPerfilPorCorreoTalento(
            correo
        );

    const habilidades =
        obtenerHabilidadesPorCorreoTalento(
            correo
        );

    const ideas =
        obtenerIdeasPorCorreoTalento(
            correo
        );

    const proyectos =
        obtenerProyectosPorCorreoTalento(
            correo
        );

    const postulaciones =
        obtenerPostulacionesPorCorreoTalento(
            correo
        );

    const nombre =
        obtenerNombreCompletoTalento(
            correo,
            usuario,
            perfil,
            proyectos
        );

    const area =
        obtenerAreaTalento(
            usuario,
            perfil,
            ideas,
            proyectos
        );

    const proyectosActivos =
        proyectos.filter(
            function (proyecto) {

                const estado =
                    normalizarTalento(
                        proyecto.estado
                    );

                return (
                    estado !== "completado" &&
                    estado !== "cancelado"
                );
            }
        );

    const proyectosCompletados =
        proyectos.filter(
            function (proyecto) {

                return (
                    normalizarTalento(
                        proyecto.estado
                    ) === "completado"
                );
            }
        );

    const ideasAprobadas =
        ideas.filter(
            function (idea) {

                return [
                    "aprobada",
                    "aprobado",
                    "convertida en oportunidad",
                    "en proyecto",
                    "implementada",
                    "completada"
                ].includes(
                    normalizarTalento(
                        idea.estado
                    )
                );
            }
        );

    const hitos =
        obtenerHitosPorCorreoTalento(
            correo,
            proyectos
        );

    const hitosCompletados =
        hitos.filter(
            function (hito) {

                return (
                    normalizarTalento(
                        hito.estado
                    ) === "completado"
                );
            }
        );

    const participaciones =
        proyectos.map(
            function (proyecto) {

                const participante =
                    obtenerParticipacionTalento(
                        proyecto,
                        correo
                    );

                return {

                    proyecto:
                        proyecto,

                    rol:
                        participante?.rol ||
                        "Contributor"
                };
            }
        );

    const proyectosChampion =
        participaciones.filter(
            function (participacion) {

                return (
                    normalizarTalento(
                        participacion.rol
                    ) === "champion"
                );
            }
        ).length;

    const rolPrincipal =
        calcularRolPrincipalTalento(
            participaciones,
            postulaciones,
            perfil
        );

    const horasAhorradas =
        calcularHorasAhorradasTalento(
            proyectosCompletados,
            correo
        );

    const datosScore = {

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
            hitosCompletados.length,

        horasAhorradas:
            horasAhorradas,

        habilidades:
            habilidades.length
    };

    const desgloseScore =
        calcularDesgloseInnovationScore(
            datosScore
        );

    const score =
        desgloseScore.total;

    const habilidadesDominadas =
        obtenerHabilidadesDominadasTalento(
            habilidades
        );

    const habilidadesAprendizaje =
        obtenerHabilidadesAprendizajeTalento(
            habilidades
        );

    const disponibilidad =
        obtenerDisponibilidadTalento(
            perfil,
            usuario
        );

    const reconocimientos =
        calcularReconocimientosTalento({

            rolPrincipal:
                rolPrincipal,

            score:
                score,

            ideasAprobadas:
                ideasAprobadas.length,

            proyectosCompletados:
                proyectosCompletados.length,

            proyectosChampion:
                proyectosChampion,

            hitosCompletados:
                hitosCompletados.length,

            horasAhorradas:
                horasAhorradas
        });

    return {

        correo:
            correo,

        nombre:
            nombre,

        area:
            area,

        rolPrincipal:
            rolPrincipal,

        score:
            score,

        datosScore:
            datosScore,

        desgloseScore:
            desgloseScore,

        disponibilidad:
            disponibilidad,

        habilidades:
            habilidades,

        habilidadesDominadas:
            habilidadesDominadas,

        habilidadesAprendizaje:
            habilidadesAprendizaje,

        ideas:
            ideas,

        ideasAprobadas:
            ideasAprobadas,

        proyectos:
            proyectos,

        proyectosActivos:
            proyectosActivos,

        proyectosCompletados:
            proyectosCompletados,

        participaciones:
            participaciones,

        hitos:
            hitos,

        hitosCompletados:
            hitosCompletados,

        horasAhorradas:
            horasAhorradas,

        reconocimientos:
            reconocimientos,

        perfil:
            perfil,

        usuario:
            usuario
    };
}


/*
==================================================
INNOVATION SCORE
==================================================
*/

function calcularDesgloseInnovationScore(
    datos
) {

    const categorias = [

        {
            clave:
                "ideas",

            concepto:
                "Ideas registradas",

            descripcion:
                "Reconoce la generación de nuevas propuestas.",

            cantidad:
                datos.ideas,

            multiplicador:
                2,

            maximo:
                10
        },

        {
            clave:
                "ideasAprobadas",

            concepto:
                "Ideas aprobadas",

            descripcion:
                "Reconoce ideas que superaron la evaluación.",

            cantidad:
                datos.ideasAprobadas,

            multiplicador:
                5,

            maximo:
                20
        },

        {
            clave:
                "proyectos",

            concepto:
                "Participación en proyectos",

            descripcion:
                "Reconoce la colaboración en iniciativas activas o terminadas.",

            cantidad:
                datos.proyectos,

            multiplicador:
                3,

            maximo:
                15
        },

        {
            clave:
                "proyectosCompletados",

            concepto:
                "Proyectos completados",

            descripcion:
                "Reconoce la ejecución y conclusión de iniciativas.",

            cantidad:
                datos.proyectosCompletados,

            multiplicador:
                7,

            maximo:
                21
        },

        {
            clave:
                "proyectosChampion",

            concepto:
                "Participación como Champion",

            descripcion:
                "Reconoce liderazgo y aportación de experiencia.",

            cantidad:
                datos.proyectosChampion,

            multiplicador:
                5,

            maximo:
                15
        },

        {
            clave:
                "hitosCompletados",

            concepto:
                "Hitos completados",

            descripcion:
                "Reconoce cumplimiento de entregables parciales.",

            cantidad:
                datos.hitosCompletados,

            multiplicador:
                2,

            maximo:
                10
        },

        {
            clave:
                "horasAhorradas",

            concepto:
                "Horas ahorradas",

            descripcion:
                "Reconoce el impacto operativo generado.",

            cantidad:
                Math.round(
                    datos.horasAhorradas
                ),

            divisor:
                100,

            maximo:
                5
        },

        {
            clave:
                "habilidades",

            concepto:
                "Habilidades registradas",

            descripcion:
                "Reconoce el desarrollo y documentación de capacidades.",

            cantidad:
                datos.habilidades,

            multiplicador:
                1,

            maximo:
                4
        }
    ];

    const resultados =
        categorias.map(
            function (categoria) {

                let puntosBrutos;
                let formula;

                if (categoria.divisor) {

                    puntosBrutos =
                        categoria.cantidad /
                        categoria.divisor;

                    formula =
                        categoria.cantidad +
                        " ÷ " +
                        categoria.divisor;

                } else {

                    puntosBrutos =
                        categoria.cantidad *
                        categoria.multiplicador;

                    formula =
                        categoria.cantidad +
                        " × " +
                        categoria.multiplicador;
                }

                const puntos =
                    Math.min(
                        categoria.maximo,
                        puntosBrutos
                    );

                return {
                    ...categoria,

                    formula:
                        formula,

                    puntosBrutos:
                        puntosBrutos,

                    puntos:
                        puntos
                };
            }
        );

    const suma =
        resultados.reduce(
            function (
                total,
                categoria
            ) {

                return total +
                    categoria.puntos;
            },
            0
        );

    return {

        categorias:
            resultados,

        totalSinRedondear:
            suma,

        total:
            Math.min(
                100,
                Math.round(
                    suma
                )
            )
    };
}


function calcularInnovationScore(
    datos
) {

    return calcularDesgloseInnovationScore(
        datos
    ).total;
}


function obtenerNivelInnovationScore(
    score
) {

    if (score >= 80) {

        return "Innovador destacado";
    }

    if (score >= 60) {

        return "Innovador avanzado";
    }

    if (score >= 40) {

        return "Innovador activo";
    }

    if (score >= 20) {

        return "En crecimiento";
    }

    return "En desarrollo";
}


/*
==================================================
MOSTRAR DESGLOSE DEL SCORE
==================================================
*/

function mostrarDetalleInnovationScore(
    correo
) {

    const persona =
        directorioTalento.find(
            function (registro) {

                return (
                    normalizarCorreoTalento(
                        registro.correo
                    ) ===
                    normalizarCorreoTalento(
                        correo
                    )
                );
            }
        );

    if (!persona) {

        mostrarNotificacion(
            "No fue posible calcular el Innovation Score."
        );

        return;
    }

    const desglose =
        persona.desgloseScore ||
        calcularDesgloseInnovationScore(
            persona.datosScore
        );

    asignarTextoTalento(
        "tituloDetalleInnovationScore",
        "Innovation Score de " +
        persona.nombre
    );

    asignarTextoTalento(
        "totalDetalleInnovationScore",
        desglose.total +
        " / 100"
    );

    asignarTextoTalento(
        "nivelDetalleInnovationScore",
        obtenerNivelInnovationScore(
            desglose.total
        )
    );

    const barra =
        document.getElementById(
            "barraDetalleInnovationScore"
        );

    if (barra) {

        barra.style.width =
            desglose.total +
            "%";
    }

    const contenedor =
        document.getElementById(
            "listaDesgloseInnovationScore"
        );

    if (contenedor) {

        contenedor.innerHTML =
            desglose.categorias
                .map(
                    function (categoria) {

                        const limitado =
                            categoria.puntosBrutos >
                            categoria.maximo;

                        return `
                            <article class="fila-desglose-score">

                                <div class="concepto-score">

                                    <strong>
                                        ${escaparTalento(
                                            categoria.concepto
                                        )}
                                    </strong>

                                    <span>
                                        ${escaparTalento(
                                            categoria.descripcion
                                        )}
                                    </span>

                                </div>

                                <div class="formula-score">

                                    ${escaparTalento(
                                        categoria.formula
                                    )}

                                    ${
                                        limitado
                                            ? `
                                                <br>
                                                <small>
                                                    Se aplica el límite máximo.
                                                </small>
                                            `
                                            : ""
                                    }

                                </div>

                                <div class="puntos-score">

                                    ${formatearPuntosTalento(
                                        categoria.puntos
                                    )}

                                </div>

                                <div class="maximo-score">

                                    de
                                    ${categoria.maximo}

                                </div>

                            </article>
                        `;
                    }
                )
                .join("");
    }

    const panel =
        document.getElementById(
            "panelDetalleInnovationScore"
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


function cerrarDetalleInnovationScore() {

    const panel =
        document.getElementById(
            "panelDetalleInnovationScore"
        );

    panel?.classList.remove(
        "visible"
    );

    panel?.setAttribute(
        "aria-hidden",
        "true"
    );

    if (
        !document
            .getElementById(
                "panelDetalleTalento"
            )
            ?.classList
            .contains(
                "visible"
            )
    ) {

        document.body.classList.remove(
            "modal-abierto"
        );
    }
}


function configurarPanelInnovationScore() {

    document
        .getElementById(
            "cerrarPanelInnovationScore"
        )
        ?.addEventListener(
            "click",
            cerrarDetalleInnovationScore
        );

    document
        .getElementById(
            "cerrarPanelInnovationScoreInferior"
        )
        ?.addEventListener(
            "click",
            cerrarDetalleInnovationScore
        );

    document
        .getElementById(
            "panelDetalleInnovationScore"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "panelDetalleInnovationScore"
                ) {

                    cerrarDetalleInnovationScore();
                }
            }
        );
}


/*
==================================================
BUSCAR INFORMACIÓN POR CORREO
==================================================
*/

function obtenerUsuarioPorCorreoTalento(
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    return obtenerUsuariosTalento()
        .find(
            function (usuario) {

                return (
                    normalizarCorreoTalento(
                        usuario.correo ||
                        usuario.email
                    ) === valor
                );
            }
        ) || null;
}


function obtenerPerfilPorCorreoTalento(
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    return obtenerPerfilesTalento()
        .find(
            function (perfil) {

                return (
                    normalizarCorreoTalento(
                        perfil.correo ||
                        perfil.email
                    ) === valor
                );
            }
        ) || null;
}


function obtenerHabilidadesPorCorreoTalento(
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    return obtenerHabilidadesTalento()
        .filter(
            function (habilidad) {

                return (
                    normalizarCorreoTalento(
                        habilidad.correo ||
                        habilidad.email
                    ) === valor
                );
            }
        );
}


function obtenerIdeasPorCorreoTalento(
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    return obtenerIdeasTalento()
        .filter(
            function (idea) {

                return (
                    normalizarCorreoTalento(
                        idea.correo ||
                        idea.autorCorreo ||
                        idea.creadoPor ||
                        idea.email
                    ) === valor
                );
            }
        );
}


function obtenerPostulacionesPorCorreoTalento(
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    return obtenerPostulacionesTalento()
        .filter(
            function (postulacion) {

                return (
                    normalizarCorreoTalento(
                        postulacion.correo ||
                        postulacion.email
                    ) === valor
                );
            }
        );
}


function obtenerProyectosPorCorreoTalento(
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    return obtenerProyectosTalento()
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
                            normalizarCorreoTalento(
                                participante.correo ||
                                participante.email
                            ) === valor
                        );
                    }
                );
            }
        );
}


/*
==================================================
NOMBRE Y ÁREA
==================================================
*/

function obtenerNombreCompletoTalento(
    correo,
    usuario,
    perfil,
    proyectos
) {

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

    const nombrePerfil =
        perfil?.nombreCompleto ||
        [
            perfil?.nombre,
            perfil?.apellido
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

    if (nombrePerfil) {
        return nombrePerfil;
    }

    for (
        const proyecto of proyectos
    ) {

        const participante =
            obtenerParticipacionTalento(
                proyecto,
                correo
            );

        if (
            participante?.nombre
        ) {

            return participante.nombre;
        }
    }

    return convertirCorreoNombreTalento(
        correo
    );
}


function obtenerAreaTalento(
    usuario,
    perfil,
    ideas,
    proyectos
) {

    if (usuario?.area) {
        return usuario.area;
    }

    if (perfil?.areaPrincipal) {
        return perfil.areaPrincipal;
    }

    if (perfil?.area) {
        return perfil.area;
    }

    const ideaConArea =
        ideas.find(
            function (idea) {

                return Boolean(
                    idea.area
                );
            }
        );

    if (ideaConArea) {
        return ideaConArea.area;
    }

    const proyectoConArea =
        proyectos.find(
            function (proyecto) {

                return Boolean(
                    proyecto.area
                );
            }
        );

    return (
        proyectoConArea?.area ||
        "Sin área"
    );
}


/*
==================================================
PARTICIPACIÓN Y ROLES
==================================================
*/

function obtenerParticipacionTalento(
    proyecto,
    correo
) {

    const valor =
        normalizarCorreoTalento(
            correo
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
                normalizarCorreoTalento(
                    participante.correo ||
                    participante.email
                ) === valor
            );
        }
    ) || null;
}


function calcularRolPrincipalTalento(
    participaciones,
    postulaciones,
    perfil
) {

    const conteo = {

        Champion:
            0,

        Learner:
            0,

        Contributor:
            0
    };

    participaciones.forEach(
        function (participacion) {

            const rol =
                normalizarTalento(
                    participacion.rol
                );

            if (rol === "champion") {

                conteo.Champion += 1;

            } else if (
                rol === "learner"
            ) {

                conteo.Learner += 1;

            } else {

                conteo.Contributor += 1;
            }
        }
    );

    postulaciones.forEach(
        function (postulacion) {

            const estado =
                normalizarTalento(
                    postulacion.estado
                );

            if (
                ![
                    "aceptado",
                    "preseleccionado"
                ].includes(
                    estado
                )
            ) {

                return;
            }

            const rol =
                normalizarTalento(
                    postulacion.rolAsignado ||
                    postulacion.rolSolicitado ||
                    postulacion.rol
                );

            if (rol === "champion") {

                conteo.Champion += 0.5;

            } else if (
                rol === "learner"
            ) {

                conteo.Learner += 0.5;

            } else {

                conteo.Contributor += 0.5;
            }
        }
    );

    if (
        conteo.Champion > 0 &&
        conteo.Champion >=
        conteo.Learner &&
        conteo.Champion >=
        conteo.Contributor
    ) {

        return "Champion";
    }

    if (
        conteo.Learner > 0 &&
        conteo.Learner >=
        conteo.Contributor
    ) {

        return "Learner";
    }

    if (
        perfil?.disponibleChampion ===
        true
    ) {

        return "Champion";
    }

    if (
        perfil?.disponibleLearner ===
        true
    ) {

        return "Learner";
    }

    return "Contributor";
}


/*
==================================================
HABILIDADES
==================================================
*/

function obtenerHabilidadesDominadasTalento(
    habilidades
) {

    return habilidades
        .filter(
            function (habilidad) {

                const nivel =
                    normalizarTalento(
                        habilidad.nivel
                    );

                const objetivo =
                    normalizarTalento(
                        habilidad.objetivo
                    );

                return (
                    [
                        "intermedio",
                        "avanzado",
                        "experto"
                    ].includes(
                        nivel
                    ) &&
                    !objetivo.includes(
                        "aprender"
                    )
                );
            }
        )
        .sort(
            function (a, b) {

                return (
                    obtenerValorNivelTalento(
                        b.nivel
                    ) -
                    obtenerValorNivelTalento(
                        a.nivel
                    )
                );
            }
        );
}


function obtenerHabilidadesAprendizajeTalento(
    habilidades
) {

    return habilidades
        .filter(
            function (habilidad) {

                const objetivo =
                    normalizarTalento(
                        habilidad.objetivo
                    );

                const nivel =
                    normalizarTalento(
                        habilidad.nivel
                    );

                return (
                    objetivo.includes(
                        "aprender"
                    ) ||
                    objetivo.includes(
                        "mejorar"
                    ) ||
                    nivel === "principiante"
                );
            }
        );
}


function obtenerNombreHabilidadTalento(
    habilidad
) {

    return (
        habilidad.herramienta ||
        habilidad.habilidad ||
        habilidad.nombre ||
        "Habilidad"
    );
}


/*
==================================================
NIVEL VISUAL DE HABILIDADES
==================================================
*/

function obtenerClaseNivelHabilidadTalento(
    habilidad
) {

    const nivel =
        normalizarTalento(
            habilidad?.nivel
        );

    if (
        nivel === "experto"
    ) {

        return "habilidad-nivel-experto";
    }

    if (
        nivel === "avanzado"
    ) {

        return "habilidad-nivel-avanzado";
    }

    if (
        nivel === "intermedio"
    ) {

        return "habilidad-nivel-intermedio";
    }

    return "habilidad-nivel-basico";
}


/*
==================================================
ETIQUETA DEL NIVEL
==================================================
*/

function obtenerNombreNivelHabilidadTalento(
    habilidad
) {

    const nivel =
        normalizarTalento(
            habilidad?.nivel
        );

    if (
        nivel === "experto"
    ) {

        return "Experto";
    }

    if (
        nivel === "avanzado"
    ) {

        return "Avanzado";
    }

    if (
        nivel === "intermedio"
    ) {

        return "Intermedio";
    }

    if (
        nivel === "basico" ||
        nivel === "básico" ||
        nivel === "principiante"
    ) {

        return "Básico";
    }

    return (
        habilidad?.nivel ||
        "Sin nivel"
    );
}


/*
==================================================
NIVEL VISUAL DE HABILIDADES
==================================================
*/

function obtenerClaseNivelHabilidadTalento(
    habilidad
) {

    const nivel =
        normalizarTalento(
            habilidad?.nivel
        );

    if (
        nivel === "experto"
    ) {

        return "habilidad-nivel-experto";
    }

    if (
        nivel === "avanzado"
    ) {

        return "habilidad-nivel-avanzado";
    }

    if (
        nivel === "intermedio"
    ) {

        return "habilidad-nivel-intermedio";
    }

    return "habilidad-nivel-basico";
}


/*
==================================================
ETIQUETA DEL NIVEL
==================================================
*/

function obtenerNombreNivelHabilidadTalento(
    habilidad
) {

    const nivel =
        normalizarTalento(
            habilidad?.nivel
        );

    if (
        nivel === "experto"
    ) {

        return "Experto";
    }

    if (
        nivel === "avanzado"
    ) {

        return "Avanzado";
    }

    if (
        nivel === "intermedio"
    ) {

        return "Intermedio";
    }

    if (
        nivel === "basico" ||
        nivel === "básico" ||
        nivel === "principiante"
    ) {

        return "Básico";
    }

    return habilidad?.nivel ||
        "Sin nivel";
}

/*
==================================================
ORDENAR HABILIDADES POR NIVEL
==================================================
*/

function ordenarHabilidadesPorNivelTalento(
    habilidades
) {

    return [
        ...habilidades
    ].sort(
        function (a, b) {

            return (
                obtenerValorNivelTalento(
                    b.nivel
                )
                -
                obtenerValorNivelTalento(
                    a.nivel
                )
            );
        }
    );
}


function obtenerValorNivelTalento(
    nivel
) {

    const valores = {

        principiante:
            1,

        basico:
            1,

        básico:
            1,

        intermedio:
            2,

        avanzado:
            3,

        experto:
            4
    };

    return valores[
        normalizarTalento(
            nivel
        )
    ] || 0;
}


/*
==================================================
HITOS Y HORAS
==================================================
*/

function obtenerHitosPorCorreoTalento(
    correo,
    proyectos
) {

    const valor =
        normalizarCorreoTalento(
            correo
        );

    const hitos = [];

    proyectos.forEach(
        function (proyecto) {

            const hitosProyecto =
                Array.isArray(
                    proyecto.hitos
                )
                    ? proyecto.hitos
                    : [];

            hitosProyecto.forEach(
                function (hito) {

                    if (
                        normalizarCorreoTalento(
                            hito.responsable
                        ) === valor
                    ) {

                        hitos.push({
                            ...hito,

                            proyectoId:
                                proyecto.id,

                            proyectoTitulo:
                                proyecto.titulo ||
                                proyecto.nombre ||
                                proyecto.id
                        });
                    }
                }
            );
        }
    );

    return hitos;
}


function calcularHorasAhorradasTalento(
    proyectosCompletados,
    correo
) {

    return proyectosCompletados
        .reduce(
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

                if (
                    participantes.length === 0
                ) {

                    return total;
                }

                const participa =
                    participantes.some(
                        function (participante) {

                            return (
                                normalizarCorreoTalento(
                                    participante.correo ||
                                    participante.email
                                ) ===
                                normalizarCorreoTalento(
                                    correo
                                )
                            );
                        }
                    );

                if (!participa) {
                    return total;
                }

                return (
                    total +
                    (
                        Number(
                            proyecto
                                .horasAhorradasAnuales ||
                            0
                        ) /
                        participantes.length
                    )
                );

            },
            0
        );
}


function obtenerDisponibilidadTalento(
    perfil,
    usuario
) {

    const valor =
        Number(
            perfil?.disponibilidad ||
            perfil?.horasDisponibles ||
            usuario?.disponibilidad ||
            usuario?.horasDisponibles ||
            0
        );

    return Number.isFinite(
        valor
    )
        ? Math.max(
            0,
            valor
        )
        : 0;
}


/*
==================================================
RECONOCIMIENTOS
==================================================
*/

function calcularReconocimientosTalento(
    datos
) {

    const reconocimientos = [];

    if (datos.score >= 80) {

        reconocimientos.push(
            "⭐ Innovador destacado"
        );
    }

    if (
        datos.proyectosChampion >= 3
    ) {

        reconocimientos.push(
            "🏆 Champion experimentado"
        );
    }

    if (
        datos.ideasAprobadas >= 3
    ) {

        reconocimientos.push(
            "💡 Generador de ideas"
        );
    }

    if (
        datos.proyectosCompletados >= 3
    ) {

        reconocimientos.push(
            "🚀 Ejecutor destacado"
        );
    }

    if (
        datos.hitosCompletados >= 10
    ) {

        reconocimientos.push(
            "✅ Cumplimiento sobresaliente"
        );
    }

    if (
        datos.horasAhorradas >= 500
    ) {

        reconocimientos.push(
            "⚡ Impacto operativo"
        );
    }

    if (
        reconocimientos.length === 0
    ) {

        reconocimientos.push(
            "🌱 Talento en desarrollo"
        );
    }

    return reconocimientos;
}


/*
==================================================
INDICADORES Y RANKING
==================================================
*/

function actualizarIndicadoresTalento() {

    const total =
        directorioTalento.length;

    const contarRol =
        function (rol) {

            return directorioTalento
                .filter(
                    function (persona) {

                        return (
                            normalizarTalento(
                                persona.rolPrincipal
                            ) === rol
                        );
                    }
                )
                .length;
        };

    const promedio =
        total > 0
            ? Math.round(
                directorioTalento.reduce(
                    function (
                        suma,
                        persona
                    ) {

                        return suma +
                            persona.score;
                    },
                    0
                ) /
                total
            )
            : 0;

    asignarTextoTalento(
        "totalTalentoColaboradores",
        total
    );

    asignarTextoTalento(
        "totalTalentoChampions",
        contarRol(
            "champion"
        )
    );

    asignarTextoTalento(
        "totalTalentoLearners",
        contarRol(
            "learner"
        )
    );

    asignarTextoTalento(
        "totalTalentoContributors",
        contarRol(
            "contributor"
        )
    );

    asignarTextoTalento(
        "promedioInnovationScore",
        promedio
    );
}


function mostrarRankingTalento() {

    const contenedor =
        document.getElementById(
            "rankingTalento"
        );

    if (!contenedor) {
        return;
    }

    const ranking =
        [...directorioTalento]
            .sort(
                function (a, b) {

                    return (
                        b.score -
                        a.score
                    );
                }
            )
            .slice(
                0,
                3
            );

    if (
        ranking.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Todavía no hay información suficiente.
            </div>
        `;

        return;
    }

    const medallas = [
        "🥇",
        "🥈",
        "🥉"
    ];

    contenedor.innerHTML =
        ranking
            .map(
                function (
                    persona,
                    indice
                ) {

                    return `
                        <article
                            class="tarjeta-ranking-talento"
                            onclick="abrirDetalleTalento(
                                '${escaparAtributoTalento(
                                    persona.correo
                                )}'
                            )"
                        >

                            <div class="posicion-ranking">
                                ${medallas[indice]}
                            </div>

                            <div>

                                <strong>
                                    ${escaparTalento(
                                        persona.nombre
                                    )}
                                </strong>

                                <span>
                                    ${escaparTalento(
                                        persona.rolPrincipal
                                    )}
                                    ·
                                    ${persona.score}
                                    puntos
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
FILTROS
==================================================
*/

function configurarFiltrosTalento() {

    document
        .getElementById(
            "buscarTalento"
        )
        ?.addEventListener(
            "input",
            mostrarDirectorioTalento
        );

    [
        "filtroRolTalento",
        "filtroAreaTalento",
        "filtroHerramientaTalento",
        "ordenTalento"
    ].forEach(
        function (id) {

            document
                .getElementById(id)
                ?.addEventListener(
                    "change",
                    mostrarDirectorioTalento
                );
        }
    );

    document
        .getElementById(
            "limpiarFiltrosTalento"
        )
        ?.addEventListener(
            "click",
            limpiarFiltrosTalento
        );
}


function limpiarFiltrosTalento() {

    [
        "buscarTalento",
        "filtroRolTalento",
        "filtroAreaTalento",
        "filtroHerramientaTalento"
    ].forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );

            if (elemento) {
                elemento.value = "";
            }
        }
    );

    const orden =
        document.getElementById(
            "ordenTalento"
        );

    if (orden) {
        orden.value = "score";
    }

    mostrarDirectorioTalento();
}


function cargarFiltrosTalento() {

    cargarAreasTalento();

    cargarHerramientasTalento();
}


function cargarAreasTalento() {

    const selector =
        document.getElementById(
            "filtroAreaTalento"
        );

    if (!selector) {
        return;
    }

    const areas =
        [
            ...new Set(
                directorioTalento
                    .map(
                        function (persona) {

                            return persona.area;
                        }
                    )
                    .filter(
                        function (area) {

                            return (
                                area &&
                                normalizarTalento(
                                    area
                                ) !== "sin area"
                            );
                        }
                    )
            )
        ].sort();

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
}


function cargarHerramientasTalento() {

    const selector =
        document.getElementById(
            "filtroHerramientaTalento"
        );

    if (!selector) {
        return;
    }

    const herramientas =
        [
            ...new Set(
                directorioTalento
                    .flatMap(
                        function (persona) {

                            return persona
                                .habilidades
                                .map(
                                    obtenerNombreHabilidadTalento
                                );
                        }
                    )
                    .filter(Boolean)
            )
        ].sort();

    selector.innerHTML = `
        <option value="">
            Todas
        </option>
    `;

    herramientas.forEach(
        function (herramienta) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                herramienta;

            opcion.textContent =
                herramienta;

            selector.appendChild(
                opcion
            );
        }
    );
}


function obtenerTalentoFiltrado() {

    const busqueda =
        normalizarTalento(
            document
                .getElementById(
                    "buscarTalento"
                )
                ?.value || ""
        );

    const rol =
        normalizarTalento(
            document
                .getElementById(
                    "filtroRolTalento"
                )
                ?.value || ""
        );

    const area =
        normalizarTalento(
            document
                .getElementById(
                    "filtroAreaTalento"
                )
                ?.value || ""
        );

    const herramienta =
        normalizarTalento(
            document
                .getElementById(
                    "filtroHerramientaTalento"
                )
                ?.value || ""
        );

    const orden =
        document
            .getElementById(
                "ordenTalento"
            )
            ?.value ||
        "score";

    const resultados =
        directorioTalento.filter(
            function (persona) {

                const texto =
                    normalizarTalento(
                        [
                            persona.nombre,
                            persona.correo,
                            persona.area,
                            persona.rolPrincipal,
                            ...persona.habilidades.map(
                                obtenerNombreHabilidadTalento
                            )
                        ].join(" ")
                    );

                return (
                    (
                        !busqueda ||
                        texto.includes(
                            busqueda
                        )
                    ) &&
                    (
                        !rol ||
                        normalizarTalento(
                            persona.rolPrincipal
                        ) === rol
                    ) &&
                    (
                        !area ||
                        normalizarTalento(
                            persona.area
                        ) === area
                    ) &&
                    (
                        !herramienta ||
                        persona.habilidades.some(
                            function (habilidad) {

                                return (
                                    normalizarTalento(
                                        obtenerNombreHabilidadTalento(
                                            habilidad
                                        )
                                    ) ===
                                    herramienta
                                );
                            }
                        )
                    )
                );
            }
        );

    resultados.sort(
        function (a, b) {

            if (orden === "nombre") {

                return a.nombre.localeCompare(
                    b.nombre,
                    "es"
                );
            }

            if (orden === "proyectos") {

                return (
                    b.proyectos.length -
                    a.proyectos.length
                );
            }

            if (orden === "ideas") {

                return (
                    b.ideas.length -
                    a.ideas.length
                );
            }

            return (
                b.score -
                a.score
            );
        }
    );

    return resultados;
}


/*
==================================================
MOSTRAR DIRECTORIO
==================================================
*/

function mostrarDirectorioTalento() {

    const contenedor =
        document.getElementById(
            "listaTalento"
        );

    if (!contenedor) {
        return;
    }

    const personas =
        obtenerTalentoFiltrado();

    asignarTextoTalento(
        "contadorTalento",
        personas.length === 1
            ? "1 colaborador"
            : personas.length +
              " colaboradores"
    );

    if (
        personas.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                No se encontraron colaboradores con estos filtros.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        personas
            .map(
                crearTarjetaTalento
            )
            .join("");
}


function crearTarjetaTalento(
    persona
) {

    /*
    Mostramos TODAS las habilidades registradas,
    no solamente las habilidades dominadas.

    Además se ordenan de mayor a menor nivel.
    */

    const todasLasHabilidades =
        ordenarHabilidadesPorNivelTalento(
            persona.habilidades || []
        );

    const habilidades =
        todasLasHabilidades.slice(
            0,
            4
        );

    const habilidadesRestantes =
        Math.max(
            0,
            todasLasHabilidades.length -
            habilidades.length
        );

    const claseRol =
        normalizarTalento(
            persona.rolPrincipal
        );

    return `
        <article
            class="tarjeta-talento"
            onclick="abrirDetalleTalento(
                '${escaparAtributoTalento(
                    persona.correo
                )}'
            )"
        >

            <div class="cabecera-tarjeta-talento">

                <div class="avatar-talento">

                    ${obtenerInicialesTalento(
                        persona.nombre
                    )}

                </div>

                <div class="datos-principales-talento">

                    <h3>
                        ${escaparTalento(
                            persona.nombre
                        )}
                    </h3>

                    <p>
                        ${escaparTalento(
                            persona.area
                        )}
                    </p>

                </div>

                <span
                    class="
                        rol-principal-talento
                        ${claseRol}
                    "
                >
                    ${escaparTalento(
                        persona.rolPrincipal
                    )}
                </span>

            </div>


            <!--
            ==========================================
            INNOVATION SCORE
            ==========================================
            -->

            <button
                class="score-talento"
                type="button"
                onclick="
                    event.stopPropagation();

                    mostrarDetalleInnovationScore(
                        '${escaparAtributoTalento(
                            persona.correo
                        )}'
                    );
                "
            >

                <span>

                    Innovation Score

                    <small>
                        Ver cómo se calculó
                    </small>

                </span>

                <strong>
                    ${persona.score}
                </strong>

            </button>


            <div class="barra-score-talento">

                <span
                    style="
                        width:
                        ${persona.score}%;
                    "
                ></span>

            </div>


            <!--
            ==========================================
            HABILIDADES
            ==========================================
            -->

            <div class="habilidades-talento">

                ${
                    habilidades.length > 0

                        ? habilidades
                            .map(
                                function (
                                    habilidad
                                ) {

                                    const nombre =
                                        obtenerNombreHabilidadTalento(
                                            habilidad
                                        );

                                    const nivel =
                                        obtenerNombreNivelHabilidadTalento(
                                            habilidad
                                        );

                                    const claseNivel =
                                        obtenerClaseNivelHabilidadTalento(
                                            habilidad
                                        );

                                    return `
                                        <span
                                            class="
                                                habilidad-tag-talento
                                                ${claseNivel}
                                            "
                                            title="${escaparAtributoTalento(
                                                nombre +
                                                " · " +
                                                nivel
                                            )}"
                                        >

                                            <span
                                                class="
                                                    indicador-nivel-habilidad
                                                "
                                            ></span>

                                            <strong>
                                                ${escaparTalento(
                                                    nombre
                                                )}
                                            </strong>

                                            <small>
                                                ${escaparTalento(
                                                    nivel
                                                )}
                                            </small>

                                        </span>
                                    `;
                                }
                            )
                            .join("")

                        : `
                            <span
                                class="
                                    sin-habilidades-talento
                                "
                            >
                                Sin habilidades registradas
                            </span>
                        `
                }

                ${
                    habilidadesRestantes > 0

                        ? `
                            <button
                                class="
                                    habilidades-restantes-talento
                                "
                                type="button"
                                onclick="
                                    event.stopPropagation();

                                    abrirDetalleTalento(
                                        '${escaparAtributoTalento(
                                            persona.correo
                                        )}'
                                    );
                                "
                            >
                                +${habilidadesRestantes}
                                ${
                                    habilidadesRestantes === 1
                                        ? "más"
                                        : "más"
                                }
                            </button>
                        `

                        : ""
                }

            </div>


            <!--
            ==========================================
            MÉTRICAS
            ==========================================
            -->

            <div class="metricas-talento">

                <div class="metrica-talento">

                    <span>
                        Proyectos activos
                    </span>

                    <strong>
                        ${persona.proyectosActivos.length}
                    </strong>

                </div>


                <div class="metrica-talento">

                    <span>
                        Proyectos completados
                    </span>

                    <strong>
                        ${persona.proyectosCompletados.length}
                    </strong>

                </div>


                <div class="metrica-talento">

                    <span>
                        Ideas aprobadas
                    </span>

                    <strong>
                        ${persona.ideasAprobadas.length}
                    </strong>

                </div>


                <div class="metrica-talento">

                    <span>
                        Hitos completados
                    </span>

                    <strong>
                        ${persona.hitosCompletados.length}
                    </strong>

                </div>

            </div>


            <!--
            ==========================================
            VER PERFIL
            ==========================================
            -->

            <button
                class="
                    boton-principal
                    boton-ver-talento
                "
                type="button"
                onclick="
                    event.stopPropagation();

                    abrirDetalleTalento(
                        '${escaparAtributoTalento(
                            persona.correo
                        )}'
                    );
                "
            >
                Ver perfil
            </button>

        </article>
    `;
}

/*
==================================================
DETALLE DEL PERFIL
==================================================
*/

function abrirDetalleTalento(
    correo
) {

    talentoSeleccionado =
        directorioTalento.find(
            function (persona) {

                return (
                    normalizarCorreoTalento(
                        persona.correo
                    ) ===
                    normalizarCorreoTalento(
                        correo
                    )
                );
            }
        ) || null;

    if (!talentoSeleccionado) {

        mostrarNotificacion(
            "No fue posible encontrar el perfil."
        );

        return;
    }

    const persona =
        talentoSeleccionado;

    asignarTextoTalento(
        "avatarDetalleTalento",
        obtenerInicialesTalento(
            persona.nombre
        )
    );

    asignarTextoTalento(
        "nombreDetalleTalento",
        persona.nombre
    );

    asignarTextoTalento(
        "correoDetalleTalento",
        persona.correo
    );

    asignarTextoTalento(
        "areaDetalleTalento",
        persona.area
    );

    asignarTextoTalento(
        "rolDetalleTalento",
        persona.rolPrincipal
    );

    asignarTextoTalento(
        "scoreDetalleTalento",
        persona.score +
        " / 100"
    );

    const botonScore =
        document.getElementById(
            "botonScoreDetalleTalento"
        );

    if (botonScore) {

        botonScore.onclick =
            function () {

                mostrarDetalleInnovationScore(
                    persona.correo
                );
            };
    }

    asignarTextoTalento(
        "disponibilidadDetalleTalento",
        persona.disponibilidad > 0
            ? persona.disponibilidad +
              " horas por semana"
            : "Sin información"
    );

    asignarTextoTalento(
        "proyectosActivosDetalleTalento",
        persona.proyectosActivos.length
    );

    asignarTextoTalento(
        "proyectosCompletadosDetalleTalento",
        persona.proyectosCompletados.length
    );

    asignarTextoTalento(
        "hitosCompletadosDetalleTalento",
        persona.hitosCompletados.length
    );

    asignarTextoTalento(
        "ideasDetalleTalento",
        persona.ideas.length
    );

    asignarTextoTalento(
        "ideasAprobadasDetalleTalento",
        persona.ideasAprobadas.length
    );

    asignarTextoTalento(
        "horasDetalleTalento",
        Math.round(
            persona.horasAhorradas
        ) +
        " h/año"
    );

    mostrarHabilidadesDetalleTalento(
        persona
    );

    mostrarAprendizajeDetalleTalento(
        persona
    );

    mostrarProyectosDetalleTalento(
        persona
    );

    mostrarReconocimientosDetalleTalento(
        persona
    );

    document
        .getElementById(
            "panelDetalleTalento"
        )
        ?.classList
        .add(
            "visible"
        );

    document.body.classList.add(
        "modal-abierto"
    );
}


function mostrarHabilidadesDetalleTalento(
    persona
) {

    const contenedor =
        document.getElementById(
            "habilidadesDetalleTalento"
        );

    if (!contenedor) {
        return;
    }

    const habilidades =
        persona.habilidadesDominadas;

    contenedor.innerHTML =
        habilidades.length > 0
            ? habilidades
                .map(
                    function (habilidad) {

                        return `
                            <article class="habilidad-detalle">

                                <strong>
                                    ${escaparTalento(
                                        obtenerNombreHabilidadTalento(
                                            habilidad
                                        )
                                    )}
                                </strong>

                                <span>
                                    ${escaparTalento(
                                        habilidad.nivel ||
                                        "Sin nivel"
                                    )}
                                </span>

                            </article>
                        `;
                    }
                )
                .join("")
            : `
                <div class="tabla-vacia">
                    No hay habilidades dominadas registradas.
                </div>
            `;
}


function mostrarAprendizajeDetalleTalento(
    persona
) {

    const contenedor =
        document.getElementById(
            "aprendizajeDetalleTalento"
        );

    if (!contenedor) {
        return;
    }

    const habilidades =
        persona.habilidadesAprendizaje;

    contenedor.innerHTML =
        habilidades.length > 0
            ? habilidades
                .map(
                    function (habilidad) {

                        return `
                            <article class="habilidad-detalle">

                                <strong>
                                    ${escaparTalento(
                                        obtenerNombreHabilidadTalento(
                                            habilidad
                                        )
                                    )}
                                </strong>

                                <span>
                                    ${escaparTalento(
                                        habilidad.objetivo ||
                                        "Desea aprender"
                                    )}
                                </span>

                            </article>
                        `;
                    }
                )
                .join("")
            : `
                <div class="tabla-vacia">
                    No hay intereses de aprendizaje registrados.
                </div>
            `;
}


function mostrarProyectosDetalleTalento(
    persona
) {

    const contenedor =
        document.getElementById(
            "proyectosDetalleTalento"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        persona.proyectos.length > 0
            ? persona.proyectos
                .map(
                    function (proyecto) {

                        const participacion =
                            obtenerParticipacionTalento(
                                proyecto,
                                persona.correo
                            );

                        return `
                            <article class="proyecto-talento-item">

                                <strong>
                                    ${escaparTalento(
                                        proyecto.titulo ||
                                        proyecto.nombre ||
                                        proyecto.id
                                    )}
                                </strong>

                                <span>
                                    ${escaparTalento(
                                        proyecto.estado ||
                                        "Activo"
                                    )}
                                    ·
                                    ${escaparTalento(
                                        participacion?.rol ||
                                        "Contributor"
                                    )}
                                    ·
                                    ${limitarNumeroTalento(
                                        proyecto.avance,
                                        0,
                                        100
                                    )}%
                                </span>

                            </article>
                        `;
                    }
                )
                .join("")
            : `
                <div class="tabla-vacia">
                    No participa en proyectos.
                </div>
            `;
}


function mostrarReconocimientosDetalleTalento(
    persona
) {

    const contenedor =
        document.getElementById(
            "reconocimientosDetalleTalento"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        persona.reconocimientos
            .map(
                function (reconocimiento) {

                    return `
                        <span class="reconocimiento-talento">
                            ${escaparTalento(
                                reconocimiento
                            )}
                        </span>
                    `;
                }
            )
            .join("");
}


/*
==================================================
PANEL DEL PERFIL
==================================================
*/

function configurarPanelTalento() {

    document
        .getElementById(
            "cerrarPanelDetalleTalento"
        )
        ?.addEventListener(
            "click",
            cerrarDetalleTalento
        );

    document
        .getElementById(
            "panelDetalleTalento"
        )
        ?.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target.id ===
                    "panelDetalleTalento"
                ) {

                    cerrarDetalleTalento();
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

                cerrarDetalleInnovationScore();

                cerrarDetalleTalento();
            }
        }
    );
}


function cerrarDetalleTalento() {

    document
        .getElementById(
            "panelDetalleTalento"
        )
        ?.classList
        .remove(
            "visible"
        );

    document.body.classList.remove(
        "modal-abierto"
    );

    talentoSeleccionado =
        null;
}


/*
==================================================
UTILIDADES
==================================================
*/

function normalizarCorreoTalento(
    correo
) {

    return String(
        correo ||
        ""
    )
        .trim()
        .toLowerCase();
}


function normalizarTalento(
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


function convertirCorreoNombreTalento(
    correo
) {

    return String(
        correo ||
        "Colaborador"
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


function obtenerInicialesTalento(
    nombre
) {

    const partes =
        String(
            nombre ||
            "Usuario"
        )
            .split(" ")
            .filter(Boolean);

    if (
        partes.length === 1
    ) {

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


function limitarNumeroTalento(
    valor,
    minimo,
    maximo
) {

    const numero =
        Number(
            valor
        );

    if (
        Number.isNaN(
            numero
        )
    ) {

        return minimo;
    }

    return Math.min(
        maximo,
        Math.max(
            minimo,
            numero
        )
    );
}


function formatearPuntosTalento(
    valor
) {

    const numero =
        Number(
            valor ||
            0
        );

    return Number.isInteger(
        numero
    )
        ? String(
            numero
        )
        : numero.toFixed(
            1
        );
}


function asignarTextoTalento(
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


function escaparTalento(
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


function escaparAtributoTalento(
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
