const express = require("express");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUSHBULLET_API_URL = "https://api.pushbullet.com/v2/pushes";

// Middleware
app.use(express.json({ limit: "10kb" }));

// Helpers
function getText(value, fallback, maxLength) {
  if (typeof value !== "string") return fallback;

  const text = value.trim();
  return text ? text.slice(0, maxLength) : fallback;
}

// Pushbullet service
async function sendPushbulletNote({ accessToken, title, body }) {
  const response = await fetch(PUSHBULLET_API_URL, {
    method: "POST",
    headers: {
      "Access-Token": accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type: "note", title, body })
  });

  if (!response.ok) {
    throw new Error(`Pushbullet returned status ${response.status}`);
  }
}

// Routes
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
      error: "Push notifications are not configured."
    });
  }

  const title = getText(req.body?.title, "Website notification", 100);
  const body = getText(req.body?.body, "Hello from your website!", 1000);

  try {
    await sendPushbulletNote({ accessToken, title, body });
    return res.json({ success: true });
  } catch (error) {
    console.error("Push notification failed:", error.message);
    return res.status(502).json({
      error: "Notification service unavailable."
    });
  }
});

// Start the server when this file is run directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
