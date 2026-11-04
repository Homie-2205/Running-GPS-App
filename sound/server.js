const express = require("express");
const path = require("node:path");

const app = express();
const port = process.env.PORT || 3000;
const PUSHBULLET_API_URL = "https://api.pushbullet.com/v2/pushes";

app.use(express.json({ limit: "10kb" }));

function getText(value, fallback, maxLength) {
  if (typeof value !== "string") return fallback;

  const text = value.trim();
  return text ? text.slice(0, maxLength) : fallback;
}

async function sendPushbulletNote(title, body) {
  const accessToken = process.env.PUSHBULLET_ACCESS_TOKEN;

  if (!accessToken) {
    const error = new Error("Push notifications are not configured.");
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(PUSHBULLET_API_URL, {
    method: "POST",
    headers: {
      "Access-Token": accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type: "note", title, body })
  });

  if (!response.ok) {
    const error = new Error("Pushbullet request failed.");
    error.statusCode = 502;
    throw error;
  }
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/send-push", async (req, res) => {
  const title = getText(req.body?.title, "Website notification", 100);
  const body = getText(req.body?.body, "Hello from your website!", 1000);

  try {
    await sendPushbulletNote(title, body);
    return res.json({ success: true });
  } catch (error) {
    console.error("Push notification failed:", error.message);
    return res.status(error.statusCode || 502).json({
      error:
        error.statusCode === 503
          ? "Push notifications are not configured."
          : "Notification service unavailable."
    });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
