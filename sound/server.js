// ==========================================
// 1. CONFIGURATION & SETUP
// ==========================================
require("dotenv").config();

const express = require("express");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUSHBULLET_API_URL = "https://pushbullet.com";

// Security Best Practice: Limit JSON payload size to prevent DDoS attempts
app.use(express.json({ limit: "10kb" }));


// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

/**
 * Validates, trims, and truncates text input to prevent overflow or injection.
 * @param {*} value - The input value to check.
 * @param {string} fallback - The backup text if validation fails.
 * @param {number} maxLength - The maximum character limit allowed.
 * @returns {string} Cleaned, length-limited text.
 */
function getText(value, fallback, maxLength) {
  if (typeof value !== "string") return fallback;

  const text = value.trim();
  return text ? text.slice(0, maxLength) : fallback;
}


// ==========================================
// 3. CORE BUSINESS LOGIC (EXTERNAL APIS)
// ==========================================

/**
 * Sends a POST request to Pushbullet's API to broadcast a note notification.
 * @param {Object} params
 * @param {string} params.accessToken - Secret token for Pushbullet.
 * @param {string} params.title - Title of the notification.
 * @param {string} params.body - Body message of the notification.
 */
async function sendPushbulletNote({ accessToken, title, body }) {
  const response = await fetch(PUSHBULLET_API_URL, {
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

  if (!response.ok) {
    throw new Error(`Pushbullet returned status ${response.status}`);
  }

  return response.json();
}


// ==========================================
// 4. ROUTES / ENDPOINTS
// ==========================================

// GET / - Serves the HTML frontend webpage
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET /health - Simple uptime check for cloud infrastructure monitoring
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// POST /send-push - Secure proxy endpoint that forwards notifications to Pushbullet
app.post("/send-push", async (req, res) => {
  const accessToken = process.env.PUSHBULLET_ACCESS_TOKEN;

  // 1. Guard Clause: Check if API key is injected
  if (!accessToken) {
    return res.status(503).json({
      error: "Push notifications are not configured."
    });
  }

  // 2. Sanitize user-provided payload strings
  const title = getText(req.body?.title, "Website notification", 100);
  const body = getText(req.body?.body, "Hello from your website!", 1000);

  // 3. Attempt Delivery
  try {
    const result = await sendPushbulletNote({ accessToken, title, body });
    return res.json({ success: true, result });
  } catch (error) {
    console.error("Push notification failed:", error.message);
    
    // Abstract the error: Do not leak detailed network stacks to client
    return res.status(502).json({
      error: "Notification service unavailable."
    });
  }
});


// ==========================================
// 5. SERVER BOOTSTRAP / EXPORT
// ==========================================

// Only start listening if this file is run directly (useful for testing frameworks)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
