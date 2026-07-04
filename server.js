require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const basicAuth = require("express-basic-auth");

const licenseRoutes = require("./routes/licenses");

const app = express();

/* =======================
   MIDDLEWARES IMPORTANTES
======================= */
app.use(cors());
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
   PROTEGER DASHBOARD WEB PANEL
======================= */
const dashboardAuth = basicAuth({
    users: {
    nexus_owner: "JenueL309"
},
    challenge: true,
    unauthorizedResponse: "Unauthorized"
});

app.use("/", dashboardAuth, express.static(path.join(__dirname, "web")));

/* =======================
   ROOT
======================= */
app.get("/", dashboardAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "web", "index.html"));
});

/* =======================
   DEBUG ROUTE
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