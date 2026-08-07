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
DATOS DE SESIÓN
==================================================
*/

function obtenerCorreoPerfil() {

    return (
        sessionStorage.getItem(
            "octoflowCorreo"
        ) ||
        localStorage.getItem(
            "octoflowCorreo"
        ) ||
        ""
    );
}


function obtenerNombrePerfil() {

    return (
        sessionStorage.getItem(
            "octoflowNombre"
        ) ||
        localStorage.getItem(
            "octoflowNombre"
        ) ||
        ""
    );
}


function obtenerApellidoSesionPerfil() {

    return (
        sessionStorage.getItem(
            "octoflowApellido"
        ) ||
        localStorage.getItem(
            "octoflowApellido"
        ) ||
        ""
    );
}


function obtenerNombreCompletoPerfil() {

    return (
        sessionStorage.getItem(
            "octoflowNombreCompleto"
        ) ||
        localStorage.getItem(
            "octoflowNombreCompleto"
        ) ||
        ""
    );
}


function obtenerRolPerfil() {

    return (
        sessionStorage.getItem(
            "octoflowRol"
        ) ||
        localStorage.getItem(
            "octoflowRol"
        ) ||
        "colaborador"
    );
}


/*
==================================================
INFORMACIÓN PERSONAL
==================================================
*/

function cargarInformacionPersonal() {

    const correo =
        obtenerCorreoPerfil();

    const nombre =
        obtenerNombrePerfil();

    const apellido =
        obtenerApellidoSesionPerfil();

    const rol =
        obtenerRolPerfil();

    const nombreCompletoGuardado =
        obtenerNombreCompletoPerfil();

    /*
    Construimos el nombre completo usando,
    en este orden:

    1. Nombre completo guardado en sesión.
    2. Nombre + apellido.
    3. Nombre generado desde el correo.
    */

    const nombreCompleto =
        nombreCompletoGuardado.trim() ||
        [nombre, apellido]
            .filter(Boolean)
            .join(" ")
            .trim() ||
        obtenerNombreDesdeCorreoPerfil(
            correo
        );

    /*
    Si no existe nombre individual,
    tomamos el primer nombre del nombre completo.
    */

    const nombreVisible =
        nombre.trim() ||
        nombreCompleto
            .split(" ")
            .filter(Boolean)[0] ||
        "";

    /*
    Si no existe apellido guardado,
    obtenemos todo lo que viene después
    del primer nombre.
    */

    const apellidoVisible =
        apellido.trim() ||
        obtenerApellidoPerfil(
            nombreCompleto
        );

    const rolVisible =
        normalizarPerfil(
            rol
        ) === "gerente"
            ? "Gerente"
            : "Colaborador";

    const iniciales =
        obtenerInicialesPerfil(
            nombreCompleto
        );


    /*
    ==============================================
    CAMPOS PERSONALES
    ==============================================
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
    ==============================================
    NOMBRE VISIBLE
    ==============================================
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


    /*
    ==============================================
    CORREO VISIBLE
    ==============================================
    */

    document
        .querySelectorAll(
            "[data-correo-usuario]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    correo ||
                    "Sin correo";
            }
        );


    /*
    ==============================================
    ROL VISIBLE
    ==============================================
    */

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


    /*
    ==============================================
    AVATAR
    ==============================================
    */

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
            obtenerCorreoPerfil()
        );

    if (!correo) {

        asignarTextoPerfil(
            "perfilTotalHabilidades",
            0
        );

        asignarTextoPerfil(
            "perfilHabilidadesAvanzadas",
            0
        );

        asignarTextoPerfil(
            "perfilInteresesAprendizaje",
            0
        );

        asignarTextoPerfil(
            "perfilDisponibilidad",
            "No definida"
        );

        return;
    }


    /*
    ==============================================
    HABILIDADES DEL USUARIO ACTUAL
    ==============================================
    */

    const todasLasHabilidades =
        leerColeccionPerfil(
            "octoflowHabilidades"
        );

    const habilidades =
        todasLasHabilidades
            .filter(
                function (habilidad) {

                    return (
                        normalizarPerfil(
                            habilidad.correo
                        ) === correo
                    );
                }
            );


    /*
    ==============================================
    AVANZADO / EXPERTO
    ==============================================
    */

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


    /*
    ==============================================
    INTERESES DE APRENDIZAJE
    ==============================================
    */

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


    /*
    ==============================================
    PERFIL DE HABILIDADES
    ==============================================
    */

    const perfiles =
        leerColeccionPerfil(
            "octoflowPerfilesHabilidades"
        );

    const perfilHabilidades =
        perfiles.find(
            function (perfil) {

                return (
                    normalizarPerfil(
                        perfil.correo
                    ) === correo
                );
            }
        ) || null;


    /*
    ==============================================
    DISPONIBILIDAD
    ==============================================
    */

    const disponibilidad =
        Number(
            perfilHabilidades?.disponibilidad ||
            perfilHabilidades?.disponibilidadSemanal ||
            0
        );


    /*
    ==============================================
    MOSTRAR RESULTADOS
    ==============================================
    */

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
            ? disponibilidad +
              " h/sem."
            : "No definida"
    );
}


/*
==================================================
LEER COLECCIONES
==================================================
*/

function leerColeccionPerfil(
    clave
) {

    const datos =
        localStorage.getItem(
            clave
        );

    if (!datos) {

        return [];
    }

    try {

        const coleccion =
            JSON.parse(
                datos
            );

        return Array.isArray(
            coleccion
        )
            ? coleccion
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


/*
==================================================
ASIGNAR VALOR
==================================================
*/

function asignarValorPerfil(
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


/*
==================================================
ASIGNAR TEXTO
==================================================
*/

function asignarTextoPerfil(
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


/*
==================================================
OBTENER NOMBRE DESDE CORREO
==================================================
*/

function obtenerNombreDesdeCorreoPerfil(
    correo
) {

    const usuario =
        String(
            correo || ""
        )
            .split("@")[0];

    if (!usuario) {

        return "Usuario";
    }

    return usuario
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


/*
==================================================
OBTENER APELLIDO
==================================================
*/

function obtenerApellidoPerfil(
    nombreCompleto
) {

    const partes =
        String(
            nombreCompleto || ""
        )
            .split(" ")
            .filter(Boolean);

    return partes.length > 1
        ? partes
            .slice(1)
            .join(" ")
        : "";
}


/*
==================================================
INICIALES
==================================================
*/

function obtenerInicialesPerfil(
    nombreCompleto
) {

    const partes =
        String(
            nombreCompleto ||
            "Usuario"
        )
            .split(" ")
            .filter(Boolean);

    if (partes.length === 0) {

        return "U";
    }

    if (partes.length === 1) {

        return partes[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        partes[0]
            .charAt(0)
        +
        partes[
            partes.length - 1
        ]
            .charAt(0)
    ).toUpperCase();
}


/*
==================================================
NORMALIZAR
==================================================
*/

function normalizarPerfil(
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
