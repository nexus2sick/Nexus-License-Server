const express = require("express");
const router = express.Router();

const { createLicenses, verifyLicense } = require("../services/licenseService");

// Crear licencias
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
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Verificar licencia
router.post("/verify", (req, res) => {
    try {
        const { license, hwid } = req.body;

        if (!license || !hwid) {
            return res.status(400).json({
                success: false,
                message: "license y hwid son requeridos"
            });
        }

        const result = verifyLicense(license, hwid);

        res.json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.post("/ban", (req, res) => {
    try {
        const { license } = req.body;

        const db = require("../database");

        const stmt = db.prepare(`
            UPDATE licenses
            SET banned = 1
            WHERE license = ?
        `);

        stmt.run(license);

        res.json({
            success: true,
            message: "license baneada"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.post("/unban", (req, res) => {
    try {
        const { license } = req.body;

        const db = require("../database");

        const stmt = db.prepare(`
            UPDATE licenses
            SET banned = 0
            WHERE license = ?
        `);

        stmt.run(license);

        res.json({
            success: true,
            message: "license desbaneada"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.post("/reset-hwid", (req, res) => {
    try {
        const { license } = req.body;

        if (!license) {
            return res.status(400).json({
                success: false,
                message: "license es requerida"
            });
        }

        const db = require("../database");

        const stmt = db.prepare(`
            UPDATE licenses
            SET hwid = NULL
            WHERE license = ?
        `);

        const result = stmt.run(license);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "license no encontrada"
            });
        }

        res.json({
            success: true,
            message: "HWID reseteado"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
module.exports = router;