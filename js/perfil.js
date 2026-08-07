/*
==================================================
OCTOFLOW - PERFIL DEL COLABORADOR
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarPerfil
);


/*
==================================================
INICIAR
==================================================
*/

function iniciarPerfil() {

    cargarInformacionPersonal();

    cargarResumenHabilidades();
}


/*
==================================================
INFORMACIÓN PERSONAL
==================================================
*/

function cargarInformacionPersonal() {

    const nombre =
        localStorage.getItem(
            "octoflowNombre"
        ) || "";

    const apellido =
        localStorage.getItem(
            "octoflowApellido"
        ) || "";

    const correo =
        localStorage.getItem(
            "octoflowCorreo"
        ) || "";

    const rol =
        localStorage.getItem(
            "octoflowRol"
        ) || "colaborador";

    const nombreCompletoGuardado =
        localStorage.getItem(
            "octoflowNombreCompleto"
        ) || "";

    const nombreCompleto =
        nombreCompletoGuardado.trim() ||
        [nombre, apellido]
            .filter(Boolean)
            .join(" ")
            .trim() ||
        obtenerNombreDesdeCorreoPerfil(
            correo
        );

    const nombreVisible =
        nombre.trim() ||
        nombreCompleto
            .split(" ")
            .filter(Boolean)[0] ||
        "";

    const apellidoVisible =
        apellido.trim() ||
        obtenerApellidoPerfil(
            nombreCompleto
        );

    const rolVisible =
        rol === "gerente"
            ? "Gerente"
            : "Colaborador";

    const iniciales =
        obtenerInicialesPerfil(
            nombreCompleto
        );

    /*
    Campos personales.
    */

    asignarValorPerfil(
        "perfilNombre",
        nombreVisible
    );

    asignarValorPerfil(
        "perfilApellido",
        apellidoVisible
    );

    asignarValorPerfil(
        "perfilCorreo",
        correo
    );

    asignarValorPerfil(
        "perfilRol",
        rolVisible
    );

    /*
    Elementos visibles del perfil.
    */

    document
        .querySelectorAll(
            "[data-nombre-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    nombreCompleto ||
                    "Usuario";
            }
        );

    document
        .querySelectorAll(
            "[data-correo-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    correo;
            }
        );

    document
        .querySelectorAll(
            "[data-rol-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    rolVisible;
            }
        );

    document
        .querySelectorAll(
            "[data-avatar-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    iniciales;
            }
        );
}


/*
==================================================
RESUMEN DE HABILIDADES
==================================================
*/

function cargarResumenHabilidades() {

    const correo =
        normalizarPerfil(
            localStorage.getItem(
                "octoflowCorreo"
            )
        );

    const habilidades =
        leerColeccionPerfil(
            "octoflowHabilidades"
        )
            .filter(
                function (habilidad) {

                    return normalizarPerfil(
                        habilidad.correo
                    ) === correo;
                }
            );

    const avanzadas =
        habilidades.filter(
            function (habilidad) {

                const nivel =
                    normalizarPerfil(
                        habilidad.nivel
                    );

                return (
                    nivel === "avanzado" ||
                    nivel === "experto"
                );
            }
        ).length;

    const interesesAprendizaje =
        habilidades.filter(
            function (habilidad) {

                const objetivo =
                    normalizarPerfil(
                        habilidad.objetivo
                    );

                return (
                    objetivo.includes(
                        "aprender"
                    ) ||
                    objetivo.includes(
                        "mejorar"
                    )
                );
            }
        ).length;

    const perfilHabilidades =
        leerColeccionPerfil(
            "octoflowPerfilesHabilidades"
        )
            .find(
                function (perfil) {

                    return normalizarPerfil(
                        perfil.correo
                    ) === correo;
                }
            );

    const disponibilidad =
        Number(
            perfilHabilidades?.disponibilidad ||
            0
        );

    asignarTextoPerfil(
        "perfilTotalHabilidades",
        habilidades.length
    );

    asignarTextoPerfil(
        "perfilHabilidadesAvanzadas",
        avanzadas
    );

    asignarTextoPerfil(
        "perfilInteresesAprendizaje",
        interesesAprendizaje
    );

    asignarTextoPerfil(
        "perfilDisponibilidad",
        disponibilidad > 0
            ? disponibilidad + " h/sem."
            : "No definida"
    );
}


/*
==================================================
UTILIDADES
==================================================
*/

function leerColeccionPerfil(clave) {

    const datos =
        localStorage.getItem(
            clave
        );

    if (!datos) {

        return [];
    }

    try {

        const coleccion =
            JSON.parse(datos);

        return Array.isArray(coleccion)
            ? coleccion
            : [];

    } catch (error) {

        console.error(
            "No fue posible leer " + clave,
            error
        );

        return [];
    }
}


function asignarValorPerfil(
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


function asignarTextoPerfil(
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


function obtenerNombreDesdeCorreoPerfil(
    correo
) {

    return String(correo || "Usuario")
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map(
            function (palabra) {

                return (
                    palabra.charAt(0).toUpperCase() +
                    palabra.slice(1).toLowerCase()
                );
            }
        )
        .join(" ");
}


function obtenerApellidoPerfil(
    nombreCompleto
) {

    const partes =
        String(nombreCompleto || "")
            .split(" ")
            .filter(Boolean);

    return partes.length > 1
        ? partes.slice(1).join(" ")
        : "";
}


function obtenerInicialesPerfil(
    nombreCompleto
) {

    const partes =
        String(nombreCompleto || "Usuario")
            .split(" ")
            .filter(Boolean);

    if (partes.length === 1) {

        return partes[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        partes[0].charAt(0) +
        partes[partes.length - 1].charAt(0)
    ).toUpperCase();
}


function normalizarPerfil(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}