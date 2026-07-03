require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const licenseRoutes = require("./routes/licenses");

const app = express();

/* =======================
   MIDDLEWARES IMPORTANTES
======================= */
app.use(cors());

// 🔥 ESTO ES LO QUE TE ESTABA ROMPIENDO EL /VERIFY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   DATABASE INIT
======================= */
require("./database");

/* =======================
   API ROUTES
======================= */
app.use("/api/licenses", licenseRoutes);

/* =======================
   DASHBOARD WEB PANEL
======================= */
app.use(express.static(path.join(__dirname, "web")));

/* =======================
   ROOT
======================= */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "web", "index.html"));
});

/* =======================
   DEBUG ROUTE (opcional)
======================= */
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Server running correctly"
    });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 running on", PORT);
});