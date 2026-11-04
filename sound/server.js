const express = require("express");
const path = require("node:path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

function getText(value, fallback, maxLength) {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  return text ? text.slice(0, maxLength) : fallback;
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/send-push", async (req, res) => {
  const accessToken = o.2P5XGoxR9JtpN6oUAThbNrMgJu5wwUQq

  if (!accessToken) {
    return res.status(503).json({
      error: "Push notifications are not configured."
    });
  }

  const title = getText(req.body?.title, "Website notification", 100);
  const body = getText(req.body?.body, "Hello from your website!", 1000);

  try {
    const response = await fetch("https://api.pushbullet.com/v2/pushes", {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "note",
        title,
        body
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Pushbullet request failed"
      });
    }

    return res.json({ success: true, result });
  } catch (error) {
    console.error("Push notification failed:", error.message);
    return res.status(502).json({
      error: "Notification service unavailable"
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
