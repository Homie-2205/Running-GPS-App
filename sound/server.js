require("dotenv").config();

const express = require("express");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUSHBULLET_API_URL = "https://api.pushbullet.com/v2/pushes";

app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/send-push", async (req, res) => {
  const accessToken = process.env.PUSHBULLET_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(503).json({
      success: false,
      error: "Falta configurar PUSHBULLET_ACCESS_TOKEN en el servidor."
    });
  }

  const title = typeof req.body?.title === "string"
    ? req.body.title.trim().slice(0, 100)
    : "Running App";
  const body = typeof req.body?.body === "string"
    ? req.body.body.trim().slice(0, 1000)
    : "Notificación desde la aplicación";

  try {
    const response = await fetch(PUSHBULLET_API_URL, {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "note",
        title: title || "Running App",
        body: body || "Notificación desde la aplicación"
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error("Pushbullet respondió con estado:", response.status);
      return res.status(502).json({
        success: false,
        error: "Pushbullet no pudo enviar la notificación."
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error al contactar Pushbullet:", error.message);
    return res.status(502).json({
      success: false,
      error: "No se pudo contactar el servicio de notificaciones."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
