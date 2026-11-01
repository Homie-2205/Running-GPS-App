const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use("/sound", express.static(path.join(__dirname, "sound")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
