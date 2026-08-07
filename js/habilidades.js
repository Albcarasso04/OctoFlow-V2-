/*
==================================================
OCTOFLOW - MÓDULO DE HABILIDADES
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloHabilidades
);


function iniciarModuloHabilidades() {

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

        correo: correo,

        disponibilidad:
            Number(
                document
                    .getElementById(
                        "disponibilidadSemanal"
                    )
                    .value
            ) || 0,

        areaPrincipal:
            document
                .getElementById(
                    "areaPrincipal"
                )
                .value,

        areasInteres:
            document
                .getElementById(
                    "areasInteres"
                )
                .value
                .trim(),

        disponibleChampion:
            document
                .getElementById(
                    "disponibleChampion"
                )
                .checked,

        disponibleLearner:
            document
                .getElementById(
                    "disponibleLearner"
                )
                .checked,

        fechaActualizacion:
            new Date().toISOString()

    };

    const indice =
        perfiles.findIndex(
            function (perfil) {

                return normalizar(
                    perfil.correo
                ) === normalizar(
                    correo
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
        JSON.stringify(perfiles)
    );

    mostrarMensajePerfil(
        "Perfil actualizado correctamente.",
        "exito"
    );

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

    const selectorHerramienta =
        document.getElementById(
            "nombreHerramienta"
        );

    let herramienta =
        selectorHerramienta.value;

    if (herramienta === "Otra") {

        herramienta =
            document
                .getElementById(
                    "otraHerramienta"
                )
                .value
                .trim();
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
            .value;

    const objetivo =
        document
            .getElementById(
                "interesHerramienta"
            )
            .value;

    const experiencia =
        document
            .getElementById(
                "experienciaHerramienta"
            )
            .value;

    const comentarios =
        document
            .getElementById(
                "comentariosHerramienta"
            )
            .value
            .trim();

    const habilidades =
        obtenerTodasLasHabilidades();

    const indiceExistente =
        habilidades.findIndex(
            function (registro) {

                return (
                    normalizar(
                        registro.correo
                    ) === normalizar(
                        correo
                    )
                    &&
                    normalizar(
                        registro.herramienta
                    ) === normalizar(
                        herramienta
                    )
                );
            }
        );

    const registro = {

        id:
            indiceExistente >= 0
                ? habilidades[indiceExistente].id
                : generarIdHabilidad(),

        correo: correo,

        herramienta: herramienta,

        nivel: nivel,

        objetivo: objetivo,

        experiencia: experiencia,

        comentarios: comentarios,

        fechaActualizacion:
            new Date().toISOString()

    };

    if (indiceExistente >= 0) {

        habilidades[indiceExistente] =
            registro;

    } else {

        habilidades.push(
            registro
        );
    }

    localStorage.setItem(
        "octoflowHabilidades",
        JSON.stringify(habilidades)
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
OBTENER INFORMACIÓN
==================================================
*/

function obtenerCorreoActual() {

    return localStorage.getItem(
        "octoflowCorreo"
    ) || "";
}


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
            JSON.parse(datos);

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


function obtenerHabilidadesUsuario() {

    const correo =
        obtenerCorreoActual();

    return obtenerTodasLasHabilidades()
        .filter(
            function (habilidad) {

                return normalizar(
                    habilidad.correo
                ) === normalizar(
                    correo
                );
            }
        );
}


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
            JSON.parse(datos);

        return Array.isArray(
            perfiles
        )
            ? perfiles
            : [];

    } catch (error) {

        return [];
    }
}


function obtenerPerfilUsuario() {

    const correo =
        obtenerCorreoActual();

    return obtenerPerfilesHabilidades()
        .find(
            function (perfil) {

                return normalizar(
                    perfil.correo
                ) === normalizar(
                    correo
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

    if (habilidades.length === 0) {

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
                function (habilidad) {

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
                function (habilidad) {

                    return habilidad.id !== id;
                }
            );

    localStorage.setItem(
        "octoflowHabilidades",
        JSON.stringify(habilidades)
    );

    mostrarHabilidades();

    actualizarResumenHabilidades();

    mostrarNotificacion(
        "Habilidad eliminada."
    );
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
            function (habilidad) {

                return (
                    habilidad.nivel === "Avanzado" ||
                    habilidad.nivel === "Experto"
                );
            }
        ).length;

    const aprendizaje =
        habilidades.filter(
            function (habilidad) {

                return (
                    habilidad.objetivo ===
                        "Quiero aprender"
                    ||
                    habilidad.objetivo ===
                        "Mejorar nivel"
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

    if (expertas > 0) {

        return "Contributor";
    }

    if (aprendizaje > 0) {

        return "Learner";
    }

    return "Por definir";
}


function obtenerRolPorHabilidad(
    habilidad
) {

    if (
        habilidad.nivel === "Experto" ||
        habilidad.nivel === "Avanzado" ||
        habilidad.objetivo === "Puedo enseñar"
    ) {

        return `
            <span class="etiqueta-rol champion">
                Perfil Champion
            </span>
        `;
    }

    if (
        habilidad.objetivo ===
            "Quiero aprender"
        ||
        habilidad.objetivo ===
            "Mejorar nivel"
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
UTILIDADES
==================================================
*/

function generarIdHabilidad() {

    return (
        "SK-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() * 1000
        )
    );
}


function obtenerClaseNivel(nivel) {

    const valor =
        normalizar(nivel);

    if (
        valor === "experto" ||
        valor === "avanzado"
    ) {

        return "nivel-alto";
    }

    if (valor === "intermedio") {

        return "nivel-medio";
    }

    return "nivel-inicial";
}


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
        document.getElementById(id);

    if (!elemento) {

        return;
    }

    elemento.className =
        "mensaje-formulario " + tipo;

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


function asignarValor(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.value =
            valor;
    }
}


function asignarCheckbox(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.checked =
            valor;
    }
}


function actualizarTexto(
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


function normalizar(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function escapar(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto ?? "";

    return elemento.innerHTML;
}


function escaparAtributo(texto) {

    return String(texto || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}