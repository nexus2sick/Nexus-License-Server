require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const licenseRoutes = require("./routes/licenses");

const app = express();


app.use(cors());
app.use(express.json());


require("./database");

// routes
app.use("/api/licenses", licenseRoutes);


app.use(express.static(path.join(__dirname, "web")));


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

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("running on", PORT);
});