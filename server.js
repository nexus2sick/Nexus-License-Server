const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log("running on", PORT);
});