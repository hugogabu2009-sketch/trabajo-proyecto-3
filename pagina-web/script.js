/*
========================================
 ASISTENTE IA + HISTORIAL DE SESIÓN
========================================
*/

(() => {
    "use strict";

    const STORAGE_KEY = "asistenteIA_historial";

    let historial = cargarHistorial();
    let cargando = false;

    // Iniciar cuando se carga la página
    document.addEventListener("DOMContentLoaded", iniciar);

    function iniciar() {
        crearAsistente();
        mostrarHistorial();
    }

    // ========================================
    // CREAR INTERFAZ
    // ========================================

    function crearAsistente() {

        const asistente = document.createElement("section");

        asistente.id = "asistente-ia";

        asistente.innerHTML = `
            <div class="ia-header">

                <div>
                    <h2>🤖 Asistente IA</h2>
                    <span id="ia-status">
                        Listo para responder
                    </span>
                </div>

                <button
                    id="ia-clear"
                    type="button"
                    title="Borrar historial"
                >
                    🗑️
                </button>

            </div>

            <div
                id="ia-messages"
                class="ia-messages"
            ></div>

            <form
                id="ia-form"
                class="ia-form"
            >

                <textarea
                    id="ia-input"
                    rows="2"
                    placeholder="Escribe tu pregunta..."
                    aria-label="Pregunta para el asistente"
                    required
                ></textarea>

                <button
                    id="ia-send"
                    type="submit"
                >
                    Enviar
                </button>

            </form>
        `;

        document.body.appendChild(asistente);

        agregarEstilos();

        document
            .getElementById("ia-form")
            .addEventListener(
                "submit",
                enviarPregunta
            );

        document
            .getElementById("ia-clear")
            .addEventListener(
                "click",
                borrarHistorial
            );

        document
            .getElementById("ia-input")
            .addEventListener(
                "keydown",
                controlarTeclado
            );
    }


    // ========================================
    // ESTILOS
    // ========================================

    function agregarEstilos() {

        if (document.getElementById("ia-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "ia-styles";

        style.textContent = `

            #asistente-ia {

                width: min(900px, 100%);

                margin: 40px auto;

                background: white;

                border: 1px solid #111;

                border-radius: 14px;

                overflow: hidden;

                box-shadow:
                    0 8px 25px
                    rgba(0,0,0,0.15);

                font-family:
                    Arial,
                    sans-serif;
            }


            /* CABECERA */

            .ia-header {

                display: flex;

                align-items: center;

                justify-content: space-between;

                padding: 18px 20px;

                background:
                    rgb(9, 9, 65);

                color: white;
            }


            .ia-header h2 {

                margin: 0 0 4px;

                font-size: 22px;
            }


            #ia-status {

                font-size: 13px;

                opacity: 0.8;
            }


            #ia-clear {

                border: 0;

                border-radius: 8px;

                padding: 9px 12px;

                cursor: pointer;

                background: white;

                font-size: 16px;
            }


            #ia-clear:hover {

                background: #eeeeee;
            }


            /* MENSAJES */

            .ia-messages {

                min-height: 280px;

                max-height: 500px;

                overflow-y: auto;

                padding: 20px;

                background: #f5f7f6;
            }


            .ia-welcome {

                text-align: center;

                color: #555;

                padding: 60px 20px;
            }


            .ia-message {

                display: flex;

                margin-bottom: 16px;
            }


            .ia-message.user {

                justify-content: flex-end;
            }


            .ia-message.assistant {

                justify-content: flex-start;
            }


            .ia-bubble {

                max-width: 80%;

                padding: 12px 15px;

                border-radius: 12px;

                line-height: 1.5;

                white-space: pre-wrap;

                overflow-wrap: anywhere;
            }


            /* MENSAJE DEL USUARIO */

            .ia-message.user .ia-bubble {

                background:
                    rgb(9, 9, 65);

                color: white;

                border-bottom-right-radius: 3px;
            }


            /* MENSAJE DE LA IA */

            .ia-message.assistant .ia-bubble {

                background: white;

                color: #222;

                border: 1px solid #d6d6d6;

                border-bottom-left-radius: 3px;
            }


            .ia-label {

                display: block;

                margin-bottom: 5px;

                font-size: 11px;

                font-weight: bold;

                opacity: 0.65;
            }


            /* FORMULARIO */

            .ia-form {

                display: flex;

                gap: 10px;

                padding: 15px;

                background: white;

                border-top:
                    1px solid #ddd;
            }


            #ia-input {

                flex: 1;

                resize: none;

                border:
                    1px solid #aaa;

                border-radius: 9px;

                padding: 12px;

                font: inherit;

                outline: none;
            }


            #ia-input:focus {

                border-color:
                    rgb(9, 9, 65);

                box-shadow:
                    0 0 0 2px
                    rgba(9,9,65,0.12);
            }


            #ia-send {

                align-self: stretch;

                border: 0;

                border-radius: 9px;

                padding: 0 20px;

                background:
                    rgb(9, 9, 65);

                color: white;

                font-weight: bold;

                cursor: pointer;
            }


            #ia-send:hover {

                opacity: 0.9;
            }


            #ia-send:disabled,
            #ia-input:disabled {

                opacity: 0.55;

                cursor: not-allowed;
            }


            /* ANIMACIÓN */

            .ia-loading {

                display: inline-flex;

                gap: 5px;

                align-items: center;
            }


            .ia-dot {

                width: 7px;

                height: 7px;

                border-radius: 50%;

                background: #555;

                animation:
                    ia-bounce 1s infinite;
            }


            .ia-dot:nth-child(2) {

                animation-delay: 0.15s;
            }


            .ia-dot:nth-child(3) {

                animation-delay: 0.3s;
            }


            @keyframes ia-bounce {

                0%,
                60%,
                100% {

                    transform:
                        translateY(0);
                }

                30% {

                    transform:
                        translateY(-5px);
                }
            }


            /* CELULARES */

            @media (max-width: 600px) {

                #asistente-ia {

                    margin: 25px auto;

                    border-radius: 10px;
                }


                .ia-form {

                    flex-direction: column;
                }


                #ia-send {

                    min-height: 45px;
                }


                .ia-bubble {

                    max-width: 90%;
                }
            }

        `;

        document.head.appendChild(style);
    }


    // ========================================
    // ENVIAR PREGUNTA
    // ========================================

    async function enviarPregunta(event) {

        event.preventDefault();

        if (cargando) {
            return;
        }

        const input =
            document.getElementById(
                "ia-input"
            );

        const pregunta =
            input.value.trim();

        if (!pregunta) {
            return;
        }


        // Mostrar pregunta
        agregarMensaje(
            "user",
            pregunta
        );

        input.value = "";

        cambiarEstado(true);


        try {

            /*
             * Se envía la pregunta al servidor.
             *
             * El servidor deberá tener:
             *
             * POST /api/chat
             */

            const respuesta =
                await fetch(
                    "/api/chat",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            message:
                                pregunta,

                            history:
                                historial

                        })
                    }
                );


            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP " +
                    respuesta.status
                );
            }


            const datos =
                await respuesta.json();


            if (!datos.reply) {

                throw new Error(
                    "El servidor no devolvió una respuesta."
                );
            }


            // Mostrar respuesta IA
            agregarMensaje(
                "assistant",
                datos.reply
            );


        } catch (error) {

            console.error(
                "Error del asistente:",
                error
            );


            agregarMensaje(
                "assistant",
                "No pude conectarme con el asistente. Verifica que el servidor de IA esté funcionando."
            );


        } finally {

            cambiarEstado(false);

            input.focus();
        }
    }


    // ========================================
    // AGREGAR MENSAJE
    // ========================================

    function agregarMensaje(
        role,
        content
    ) {

        const mensaje = {

            role: role,

            content: content,

            timestamp:
                new Date().toISOString()
        };


        historial.push(mensaje);

        guardarHistorial();

        mostrarMensaje(mensaje);

        bajarChat();
    }


    // ========================================
    // MOSTRAR HISTORIAL
    // ========================================

    function mostrarHistorial() {

        const contenedor =
            document.getElementById(
                "ia-messages"
            );

        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = "";


        if (historial.length === 0) {

            contenedor.innerHTML = `

                <div class="ia-welcome">

                    <strong>
                        ¡Hola!
                    </strong>

                    <br><br>

                    Soy tu asistente IA.

                    <br>

                    Escribe una pregunta
                    para comenzar.

                </div>

            `;

            return;
        }


        historial.forEach(
            mostrarMensaje
        );

        bajarChat();
    }


    // ========================================
    // MOSTRAR UN MENSAJE
    // ========================================

    function mostrarMensaje(
        mensaje
    ) {

        const contenedor =
            document.getElementById(
                "ia-messages"
            );

        if (!contenedor) {
            return;
        }


        const bienvenida =
            contenedor.querySelector(
                ".ia-welcome"
            );

        if (bienvenida) {
            bienvenida.remove();
        }


        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "ia-message " +
            mensaje.role;


        const burbuja =
            document.createElement(
                "div"
            );

        burbuja.className =
            "ia-bubble";


        const etiqueta =
            document.createElement(
                "span"
            );

        etiqueta.className =
            "ia-label";


        if (mensaje.role === "user") {

            etiqueta.textContent = "TÚ";

        } else {

            etiqueta.textContent =
                "ASISTENTE IA";
        }


        const texto =
            document.createElement(
                "span"
            );

        /*
         * textContent evita que una respuesta
         * pueda insertar HTML o JavaScript
         * dentro de la página.
         */

        texto.textContent =
            mensaje.content;


        burbuja.appendChild(
            etiqueta
        );

        burbuja.appendChild(
            texto
        );

        wrapper.appendChild(
            burbuja
        );

        contenedor.appendChild(
            wrapper
        );
    }


    // ========================================
    // GUARDAR HISTORIAL
    // ========================================

    function guardarHistorial() {

        try {

            sessionStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(
                    historial
                )
            );

        } catch (error) {

            console.error(
                "No se pudo guardar el historial:",
                error
            );
        }
    }


    // ========================================
    // CARGAR HISTORIAL
    // ========================================

    function cargarHistorial() {

        try {

            const guardado =
                sessionStorage.getItem(
                    STORAGE_KEY
                );


            if (!guardado) {
                return [];
            }


            const datos =
                JSON.parse(
                    guardado
                );


            if (
                !Array.isArray(
                    datos
                )
            ) {

                return [];
            }


            return datos;

        } catch (error) {

            console.error(
                "No se pudo cargar el historial:",
                error
            );

            return [];
        }
    }


    // ========================================
    // BORRAR HISTORIAL
    // ========================================

    function borrarHistorial() {

        if (
            historial.length === 0
        ) {

            return;
        }


        const confirmar =
            confirm(
                "¿Seguro que quieres borrar todo el historial de esta sesión?"
            );


        if (!confirmar) {
            return;
        }


        historial = [];


        sessionStorage.removeItem(
            STORAGE_KEY
        );


        mostrarHistorial();
    }


    // ========================================
    // ESTADO DEL ASISTENTE
    // ========================================

    function cambiarEstado(
        valor
    ) {

        cargando = valor;


        const input =
            document.getElementById(
                "ia-input"
            );

        const boton =
            document.getElementById(
                "ia-send"
            );

        const estado =
            document.getElementById(
                "ia-status"
            );


        input.disabled = valor;

        boton.disabled = valor;


        if (valor) {

            estado.textContent =
                "Pensando...";


            boton.innerHTML = `

                <span class="ia-loading">

                    <span class="ia-dot"></span>

                    <span class="ia-dot"></span>

                    <span class="ia-dot"></span>

                </span>

            `;

        } else {

            estado.textContent =
                "Listo para responder";

            boton.textContent =
                "Enviar";
        }
    }


    // ========================================
    // BAJAR CHAT AL ÚLTIMO MENSAJE
    // ========================================

    function bajarChat() {

        const contenedor =
            document.getElementById(
                "ia-messages"
            );

        if (!contenedor) {
            return;
        }


        contenedor.scrollTop =
            contenedor.scrollHeight;
    }


    // ========================================
    // TECLADO
    // ========================================

    function controlarTeclado(
        event
    ) {

        /*
         * Enter = enviar
         *
         * Shift + Enter =
         * nueva línea
         */

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            document
                .getElementById(
                    "ia-form"
                )
                .requestSubmit();
        }
    }

})();