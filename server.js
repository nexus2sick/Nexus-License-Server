require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const licenseRoutes = require("./routes/licenses");

const app = express();

// middleware obligatorio
app.use(cors());
app.use(express.json());

// DB init
require("./database");

// routes
app.use("/api/licenses", licenseRoutes);

// static panel (si tienes web)
app.use(express.static(path.join(__dirname, "web")));

// health check
app.get("/", (req, res) => {
    res.json({
        name: "Nexus License Server",
        status: "OK"
    });
});


app.post("/api/licenses/verify", (req, res) => {
  const { license, hwid } = req.body;

  return res.json({
    success: true,
    reason: "VALID"
  });
});

app.listen(PORT, () => {
  console.log("running on", PORT);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("running on", PORT);
});
>>>>>>> 9077ac0 (Update license system)
