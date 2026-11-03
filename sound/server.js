const express = require("express");
const path = require("node:path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/send-push", async (req, res) => {
  const accessToken = process.env.o.uL0DsrOie9eAxEdln6CcYaNCY7wCbFC8;

  if (!accessToken) {
    return res.status(503).json({
      error: "Push notifications are not configured."
    });
  }

  const title =
    typeof req.body?.title === "string" && req.body.title.trim()
      ? req.body.title.trim().slice(0, 100)
      : "Website notification";

  const body =
    typeof req.body?.body === "string" && req.body.body.trim()
      ? req.body.body.trim().slice(0, 1000)
      : "Hello from your website!";

  try {
    const response = await fetch("https://api.pushbullet.com/v2/pushes", {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type: "note", title, body })
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
