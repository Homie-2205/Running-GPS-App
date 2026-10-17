const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Comprobar que el servidor funciona
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        service: "Google Meet Videollamadas",
        message: "Servidor funcionando correctamente"
    });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(Servidor activo en el puerto ${PORT});
});

