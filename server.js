require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Inicializa la base de datos
require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const licenseRoutes = require("./routes/licenses");

console.log("✅ licenses.js loaded");

app.use("/api/licenses", licenseRoutes);
app.use(express.static(path.join(__dirname, "web")));

app.get("/", (req, res) => {
    res.json({
        name: "Nexus License Server",
        version: "1.0.0",
        status: "online"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Nexus License Server running on port ${PORT}`);
});