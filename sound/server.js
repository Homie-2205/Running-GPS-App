const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/send-push", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.pushbullet.com/v2/pushes",
      {
        method: "POST",
        headers: {
          "Access-Token": process.env.o.uL0DsrOie9eAxEdln6CcYaNCY7wCbFC8,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "note",
          title: req.body.title || "Website notification",
          body: req.body.body || "Hello from your website!"
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(result);
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: "Notification failed" });
  }
});

app.listen(process.env.PORT || 3000);
