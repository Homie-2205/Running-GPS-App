
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Cambia estos valores antes de publicar.
const ACCESS_CODE = process.env.ACCESS_CODE || "CAMBIA-ESTE-CODIGO";
const ROOM_ID = "CristianLlamada2026";

let ownerSocket = null;
const pendingCalls = new Map();

io.on("connection", (socket) => {

    socket.on("registrar-dueno", (codigo) => {
        if (codigo !== ACCESS_CODE) {
            socket.emit("error-llamada", "Código incorrecto.");
            return;
        }

        ownerSocket = socket.id;
        socket.data.esDueno = true;

        socket.emit("registrado", "Listo para recibir llamadas.");

        console.log("Dueño conectado:", socket.id);
    });

    socket.on("solicitar-llamada", () => {

        if (!ownerSocket || !io.sockets.sockets.has(ownerSocket)) {
            socket.emit(
                "error-llamada",
                "El teléfono no está conectado. Intenta más tarde."
            );
            return;
        }

        const callId = socket.id;

        pendingCalls.set(callId, {
            cliente: socket.id,
            dueno: ownerSocket
        });

        io.to(ownerSocket).emit("llamada-entrante", {
            callId: callId
        });

        socket.emit("estado-llamada", "Llamada solicitada.");
    });

    socket.on("responder-llamada", (callId) => {
        if (!socket.data.esDueno) return;

        const call = pendingCalls.get(callId);

        if (!call || call.dueno !== socket.id) return;

        if (!io.sockets.sockets.has(call.cliente)) {
            pendingCalls.delete(callId);
            socket.emit("error-llamada", "El cliente se desconectó.");
            return;
        }

        io.to(call.cliente).emit("llamada-aceptada", {
            room: ROOM_ID
        });

        socket.emit("llamada-aceptada", {
            room: ROOM_ID
        });

        pendingCalls.delete(callId);
    });

    socket.on("rechazar-llamada", (callId) => {
        if (!socket.data.esDueno) return;

        const call = pendingCalls.get(callId);

        if (!call || call.dueno !== socket.id) return;

        io.to(call.cliente).emit("llamada-rechazada");

        pendingCalls.delete(callId);
    });

    socket.on("disconnect", () => {
        if (ownerSocket === socket.id) {
            ownerSocket = null;
            console.log("El dueño se desconectó.");
        }

        for (const [id, call] of pendingCalls) {
            if (call.cliente === socket.id || call.dueno === socket.id) {
                pendingCalls.delete(id);
            }
        }
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(Servidor activo en el puerto ${PORT});
});

