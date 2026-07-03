const express = require("express");
const router = express.Router();

const { createLicenses, verifyLicense } = require("../services/licenseService");

// HEALTH CHECK
router.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "licenses route working"
    });
});

// CREATE LICENSES
router.post("/create", (req, res) => {
    try {
        const { amount, duration } = req.body;

        if (!amount || !duration) {
            return res.status(400).json({
                success: false,
                message: "amount y duration son requeridos"
            });
        }

        const licenses = createLicenses(amount, duration);

        res.json({
            success: true,
            licenses
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// VERIFY LICENSE 🔥
router.post("/verify", (req, res) => {
    try {
        console.log("BODY RECIBIDO:", req.body);

        const { license, hwid } = req.body;

        if (!license || !hwid) {
            return res.status(400).json({
                success: false,
                message: "license y hwid son requeridos"
            });
        }

        const result = verifyLicense(license, hwid);
        return res.json(result);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;