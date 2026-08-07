/*
==================================================
OCTOFLOW - MÓDULO DE HABILIDADES
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloHabilidades
);


/*
==================================================
INICIAR
==================================================
*/

function iniciarModuloHabilidades() {

    /*
    Primero corregimos registros antiguos que
    pudieron haberse guardado sin correo.
    */

    //repararHabilidadesSinCorreo();

    configurarFormularioHabilidad();

    configurarFormularioPerfil();

    cargarPerfilHabilidades();

    mostrarHabilidades();

    actualizarResumenHabilidades();
}


/*
==================================================
CONFIGURACIÓN DE FORMULARIOS
==================================================
*/

function configurarFormularioHabilidad() {

    const formulario =
        document.getElementById(
            "formularioHabilidad"
        );

    const herramienta =
        document.getElementById(
            "nombreHerramienta"
        );

    if (formulario) {

        formulario.addEventListener(
            "submit",
            guardarHabilidad
        );

        formulario.addEventListener(
            "reset",
            function () {

                setTimeout(
                    function () {

                        mostrarCampoOtraHerramienta();

                    },
                    0
                );
            }
        );
    }

    if (herramienta) {

        herramienta.addEventListener(
            "change",
            mostrarCampoOtraHerramienta
        );
    }
}


function configurarFormularioPerfil() {

    const formulario =
        document.getElementById(
            "formularioPerfilHabilidades"
        );

    if (formulario) {

        formulario.addEventListener(
            "submit",
            guardarPerfilHabilidades
        );
    }
}


/*
==================================================
OTRA HERRAMIENTA
==================================================
*/

function mostrarCampoOtraHerramienta() {

    const selector =
        document.getElementById(
            "nombreHerramienta"
        );

    const campo =
        document.getElementById(
            "campoOtraHerramienta"
        );

    if (!selector || !campo) {

        return;
    }

    if (selector.value === "Otra") {

        campo.classList.remove(
            "oculto"
        );

    } else {

        campo.classList.add(
            "oculto"
        );
    }
}


/*
==================================================
PERFIL GENERAL
==================================================
*/

function guardarPerfilHabilidades(evento) {

    evento.preventDefault();

    const correo =
        obtenerCorreoActual();

    if (!correo) {

        window.location.href =
            "../index.html";

        return;
    }

    const perfiles =
        obtenerPerfilesHabilidades();

    const nuevoPerfil = {

        correo:
            correo,

        disponibilidad:
            Number(
                document
                    .getElementById(
                        "disponibilidadSemanal"
                    )
                    ?.value || 0
            ) || 0,

        areaPrincipal:
            document
                .getElementById(
                    "areaPrincipal"
                )
                ?.value || "",

        areasInteres:
            document
                .getElementById(
                    "areasInteres"
                )
                ?.value
                ?.trim() || "",

        disponibleChampion:
            document
                .getElementById(
                    "disponibleChampion"
                )
                ?.checked === true,

        disponibleLearner:
            document
                .getElementById(
                    "disponibleLearner"
                )
                ?.checked === true,

        fechaActualizacion:
            new Date().toISOString()
    };

    const indice =
        perfiles.findIndex(
            function (perfil) {

                return (
                    normalizar(
                        perfil.correo
                    ) ===
                    normalizar(
                        correo
                    )
                );
            }
        );

    if (indice >= 0) {

        perfiles[indice] =
            nuevoPerfil;

    } else {

        perfiles.push(
            nuevoPerfil
        );
    }

    localStorage.setItem(
        "octoflowPerfilesHabilidades",
        JSON.stringify(
            perfiles
        )
    );

    mostrarMensajePerfil(
        "Perfil actualizado correctamente.",
        "exito"
    );

    cargarPerfilHabilidades();

    actualizarResumenHabilidades();
}


/*
==================================================
GUARDAR HABILIDAD
==================================================
*/

function guardarHabilidad(evento) {

    evento.preventDefault();

    const correo =
        obtenerCorreoActual();

    /*
    No permitimos guardar una habilidad sin
    identificar al usuario.
    */

    if (!correo) {

        mostrarMensajeHabilidad(
            "No fue posible identificar tu sesión. Vuelve a iniciar sesión.",
            "error"
        );

        return;
    }

    const selectorHerramienta =
        document.getElementById(
            "nombreHerramienta"
        );

    if (!selectorHerramienta) {

        return;
    }

    let herramienta =
        selectorHerramienta.value;

    if (herramienta === "Otra") {

        herramienta =
            document
                .getElementById(
                    "otraHerramienta"
                )
                ?.value
                ?.trim() || "";
    }

    if (!herramienta) {

        mostrarMensajeHabilidad(
            "Selecciona o escribe una herramienta.",
            "error"
        );

        return;
    }

    const nivel =
        document
            .getElementById(
                "nivelHerramienta"
            )
            ?.value || "";

    const objetivo =
        document
            .getElementById(
                "interesHerramienta"
            )
            ?.value || "";

    const experiencia =
        document
            .getElementById(
                "experienciaHerramienta"
            )
            ?.value || "";

    const comentarios =
        document
            .getElementById(
                "comentariosHerramienta"
            )
            ?.value
            ?.trim() || "";

    const habilidades =
        obtenerTodasLasHabilidades();

    const indiceExistente =
        habilidades.findIndex(
            function (registro) {

                return (
                    normalizar(
                        registro.correo
                    ) ===
                    normalizar(
                        correo
                    )
                    &&
                    normalizar(
                        registro.herramienta
                    ) ===
                    normalizar(
                        herramienta
                    )
                );
            }
        );

    const registro = {

        id:
            indiceExistente >= 0
                ? habilidades[
                    indiceExistente
                ].id
                : generarIdHabilidad(),

        /*
        IMPORTANTE:
        siempre se guarda el correo de la
        sesión activa.
        */

        correo:
            correo,

        herramienta:
            herramienta,

        nivel:
            nivel,

        objetivo:
            objetivo,

        experiencia:
            experiencia,

        comentarios:
            comentarios,

        fechaActualizacion:
            new Date().toISOString()
    };

    if (indiceExistente >= 0) {

        habilidades[
            indiceExistente
        ] = registro;

    } else {

        habilidades.push(
            registro
        );
    }

    localStorage.setItem(
        "octoflowHabilidades",
        JSON.stringify(
            habilidades
        )
    );

    evento.target.reset();

    mostrarCampoOtraHerramienta();

    mostrarMensajeHabilidad(
        indiceExistente >= 0
            ? "Habilidad actualizada correctamente."
            : "Habilidad agregada correctamente.",
        "exito"
    );

    mostrarHabilidades();

    actualizarResumenHabilidades();
}


/*
==================================================
OBTENER CORREO ACTUAL
==================================================
*/

function obtenerCorreoActual() {

    /*
    El login actual de OctoFlow utiliza
    sessionStorage.

    Dejamos localStorage únicamente como
    respaldo para datos de versiones anteriores.
    */

    return (
        sessionStorage.getItem(
            "octoflowCorreo"
        )
        ||
        localStorage.getItem(
            "octoflowCorreo"
        )
        ||
        ""
    )
        .trim()
        .toLowerCase();
}


/*
==================================================
REPARAR HABILIDADES ANTIGUAS
==================================================
*/

function repararHabilidadesSinCorreo() {

    const correo =
        obtenerCorreoActual();

    if (!correo) {

        return;
    }

    const habilidades =
        obtenerTodasLasHabilidades();

    if (
        habilidades.length === 0
    ) {

        return;
    }

    let huboCambios =
        false;

    habilidades.forEach(
        function (habilidad) {

            /*
            Algunas habilidades antiguas fueron
            guardadas como:

            correo: ""

            Las asignamos al usuario actualmente
            conectado para hacer compatible la
            información antigua.
            */

            if (
                !String(
                    habilidad.correo || ""
                ).trim()
            ) {

                habilidad.correo =
                    correo;

                huboCambios =
                    true;
            }
        }
    );

    if (huboCambios) {

        localStorage.setItem(
            "octoflowHabilidades",
            JSON.stringify(
                habilidades
            )
        );

        console.log(
            "OctoFlow: habilidades antiguas reparadas para",
            correo
        );
    }
}


/*
==================================================
OBTENER TODAS LAS HABILIDADES
==================================================
*/

function obtenerTodasLasHabilidades() {

    const datos =
        localStorage.getItem(
            "octoflowHabilidades"
        );

    if (!datos) {

        return [];
    }

    try {

        const habilidades =
            JSON.parse(
                datos
            );

        return Array.isArray(
            habilidades
        )
            ? habilidades
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer las habilidades.",
            error
        );

        return [];
    }
}


/*
==================================================
OBTENER HABILIDADES DEL USUARIO
==================================================
*/

function obtenerHabilidadesUsuario() {

    const correo =
        obtenerCorreoActual();

    if (!correo) {

        return [];
    }

    return obtenerTodasLasHabilidades()
        .filter(
            function (habilidad) {

                return (
                    normalizar(
                        habilidad.correo
                    ) ===
                    normalizar(
                        correo
                    )
                );
            }
        );
}


/*
==================================================
OBTENER PERFILES
==================================================
*/

function obtenerPerfilesHabilidades() {

    const datos =
        localStorage.getItem(
            "octoflowPerfilesHabilidades"
        );

    if (!datos) {

        return [];
    }

    try {

        const perfiles =
            JSON.parse(
                datos
            );

        return Array.isArray(
            perfiles
        )
            ? perfiles
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer los perfiles.",
            error
        );

        return [];
    }
}


/*
==================================================
OBTENER PERFIL DEL USUARIO
==================================================
*/

function obtenerPerfilUsuario() {

    const correo =
        obtenerCorreoActual();

    if (!correo) {

        return null;
    }

    return obtenerPerfilesHabilidades()
        .find(
            function (perfil) {

                return (
                    normalizar(
                        perfil.correo
                    ) ===
                    normalizar(
                        correo
                    )
                );
            }
        ) || null;
}


/*
==================================================
CARGAR PERFIL
==================================================
*/

function cargarPerfilHabilidades() {

    const perfil =
        obtenerPerfilUsuario();

    if (!perfil) {

        return;
    }

    asignarValor(
        "disponibilidadSemanal",
        String(
            perfil.disponibilidad || 1
        )
    );

    asignarValor(
        "areaPrincipal",
        perfil.areaPrincipal || ""
    );

    asignarValor(
        "areasInteres",
        perfil.areasInteres || ""
    );

    asignarCheckbox(
        "disponibleChampion",
        Boolean(
            perfil.disponibleChampion
        )
    );

    asignarCheckbox(
        "disponibleLearner",
        Boolean(
            perfil.disponibleLearner
        )
    );
}


/*
==================================================
MOSTRAR HABILIDADES
==================================================
*/

function mostrarHabilidades() {

    const contenedor =
        document.getElementById(
            "listaHabilidades"
        );

    if (!contenedor) {

        return;
    }

    const habilidades =
        obtenerHabilidadesUsuario()
            .sort(
                function (a, b) {

                    return String(
                        a.herramienta
                    ).localeCompare(
                        String(
                            b.herramienta
                        ),
                        "es"
                    );
                }
            );

    if (
        habilidades.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="tabla-vacia">
                Todavía no has registrado habilidades.
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        habilidades
            .map(
                function (
                    habilidad
                ) {

                    return `
                        <article class="tarjeta-habilidad">

                            <div class="habilidad-cabecera">

                                <div>

                                    <h4>
                                        ${escapar(
                                            habilidad.herramienta
                                        )}
                                    </h4>

                                    <span
                                        class="
                                            nivel-habilidad
                                            ${obtenerClaseNivel(
                                                habilidad.nivel
                                            )}
                                        "
                                    >
                                        ${escapar(
                                            habilidad.nivel
                                        )}
                                    </span>

                                </div>

                                <button
                                    class="boton-eliminar-habilidad"
                                    type="button"
                                    onclick="eliminarHabilidad(
                                        '${escaparAtributo(
                                            habilidad.id
                                        )}'
                                    )"
                                >
                                    Eliminar
                                </button>

                            </div>

                            <div class="detalle-habilidad">

                                <span>
                                    Objetivo
                                </span>

                                <strong>
                                    ${escapar(
                                        habilidad.objetivo
                                    )}
                                </strong>

                            </div>

                            <div class="detalle-habilidad">

                                <span>
                                    Experiencia
                                </span>

                                <strong>
                                    ${escapar(
                                        habilidad.experiencia
                                    )}
                                </strong>

                            </div>

                            ${
                                habilidad.comentarios
                                    ? `
                                        <p class="comentario-habilidad">
                                            ${escapar(
                                                habilidad.comentarios
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                            <div class="rol-sugerido-habilidad">

                                ${obtenerRolPorHabilidad(
                                    habilidad
                                )}

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/*
==================================================
ELIMINAR HABILIDAD
==================================================
*/

function eliminarHabilidad(id) {

    const confirmar =
        window.confirm(
            "¿Deseas eliminar esta habilidad?"
        );

    if (!confirmar) {

        return;
    }

    const habilidades =
        obtenerTodasLasHabilidades()
            .filter(
                function (
                    habilidad
                ) {

                    return (
                        habilidad.id !== id
                    );
                }
            );

    localStorage.setItem(
        "octoflowHabilidades",
        JSON.stringify(
            habilidades
        )
    );

    mostrarHabilidades();

    actualizarResumenHabilidades();

    if (
        typeof mostrarNotificacion ===
        "function"
    ) {

        mostrarNotificacion(
            "Habilidad eliminada."
        );
    }
}


/*
==================================================
RESUMEN Y ROL RECOMENDADO
==================================================
*/

function actualizarResumenHabilidades() {

    const habilidades =
        obtenerHabilidadesUsuario();

    const perfil =
        obtenerPerfilUsuario();

    const expertas =
        habilidades.filter(
            function (
                habilidad
            ) {

                const nivel =
                    normalizar(
                        habilidad.nivel
                    );

                return (
                    nivel === "avanzado" ||
                    nivel === "experto"
                );
            }
        ).length;

    const aprendizaje =
        habilidades.filter(
            function (
                habilidad
            ) {

                const objetivo =
                    normalizar(
                        habilidad.objetivo
                    );

                return (
                    objetivo ===
                        "quiero aprender"
                    ||
                    objetivo ===
                        "mejorar nivel"
                );
            }
        ).length;

    actualizarTexto(
        "totalHabilidades",
        habilidades.length
    );

    actualizarTexto(
        "totalExpertas",
        expertas
    );

    actualizarTexto(
        "totalAprendizaje",
        aprendizaje
    );

    actualizarTexto(
        "rolRecomendado",
        obtenerRolGeneral(
            expertas,
            aprendizaje,
            perfil
        )
    );
}


/*
==================================================
ROL GENERAL
==================================================
*/

function obtenerRolGeneral(
    expertas,
    aprendizaje,
    perfil
) {

    if (
        perfil?.disponibleChampion &&
        expertas > 0
    ) {

        return "Champion";
    }

    if (
        perfil?.disponibleLearner &&
        aprendizaje > 0
    ) {

        return "Learner";
    }

    if (
        expertas > 0
    ) {

        return "Contributor";
    }

    if (
        aprendizaje > 0
    ) {

        return "Learner";
    }

    return "Por definir";
}


/*
==================================================
ROL POR HABILIDAD
==================================================
*/

function obtenerRolPorHabilidad(
    habilidad
) {

    const nivel =
        normalizar(
            habilidad.nivel
        );

    const objetivo =
        normalizar(
            habilidad.objetivo
        );

    if (
        nivel === "experto" ||
        nivel === "avanzado" ||
        objetivo === "puedo ensenar"
    ) {

        return `
            <span class="etiqueta-rol champion">
                Perfil Champion
            </span>
        `;
    }

    if (
        objetivo === "quiero aprender" ||
        objetivo === "mejorar nivel"
    ) {

        return `
            <span class="etiqueta-rol learner">
                Perfil Learner
            </span>
        `;
    }

    return `
        <span class="etiqueta-rol contributor">
            Perfil Contributor
        </span>
    `;
}


/*
==================================================
GENERAR ID
==================================================
*/

function generarIdHabilidad() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
        "function"
    ) {

        return (
            "SK-" +
            window.crypto.randomUUID()
        );
    }

    return (
        "SK-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() *
            1000
        )
    );
}


/*
==================================================
CLASE DEL NIVEL
==================================================
*/

function obtenerClaseNivel(
    nivel
) {

    const valor =
        normalizar(
            nivel
        );

    if (
        valor === "experto" ||
        valor === "avanzado"
    ) {

        return "nivel-alto";
    }

    if (
        valor === "intermedio"
    ) {

        return "nivel-medio";
    }

    return "nivel-inicial";
}


/*
==================================================
MENSAJES
==================================================
*/

function mostrarMensajeHabilidad(
    texto,
    tipo
) {

    mostrarMensaje(
        "mensajeHabilidad",
        texto,
        tipo
    );
}


function mostrarMensajePerfil(
    texto,
    tipo
) {

    mostrarMensaje(
        "mensajePerfilHabilidades",
        texto,
        tipo
    );
}


function mostrarMensaje(
    id,
    texto,
    tipo
) {

    const elemento =
        document.getElementById(
            id
        );

    if (!elemento) {

        return;
    }

    elemento.className =
        "mensaje-formulario " +
        tipo;

    elemento.textContent =
        texto;

    setTimeout(
        function () {

            elemento.className =
                "mensaje-formulario";

            elemento.textContent =
                "";

        },
        3500
    );
}


/*
==================================================
ASIGNAR VALOR
==================================================
*/

function asignarValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {

        elemento.value =
            valor;
    }
}


/*
==================================================
ASIGNAR CHECKBOX
==================================================
*/

function asignarCheckbox(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {

        elemento.checked =
            valor;
    }
}


/*
==================================================
ACTUALIZAR TEXTO
==================================================
*/

function actualizarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );

    if (elemento) {

        elemento.textContent =
            valor;
    }
}


/*
==================================================
NORMALIZAR TEXTO
==================================================
*/

function normalizar(
    texto
) {

    return String(
        texto || ""
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


/*
==================================================
ESCAPAR HTML
==================================================
*/

function escapar(
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


/*
==================================================
ESCAPAR ATRIBUTO
==================================================
*/

function escaparAtributo(
    texto
) {

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
