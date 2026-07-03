const express = require("express");
const router = express.Router();

const { createLicenses, verifyLicense } = require("../services/licenseService");

// HEALTH CHECK (ESTO evita tu error "Cannot GET")
router.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "licenses route working"
    });
});
// CREATE
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

// VERIFY
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
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// BAN
router.post("/ban", (req, res) => {
    const db = require("../database");

    const { license } = req.body;

    const stmt = db.prepare(`
        UPDATE licenses
        SET banned = 1
        WHERE license = ?
    `);

    stmt.run(license);

    res.json({
        success: true,
        message: "banned"
    });
});

// UNBAN
router.post("/unban", (req, res) => {
    const db = require("../database");

    const { license } = req.body;

    const stmt = db.prepare(`
        UPDATE licenses
        SET banned = 0
        WHERE license = ?
    `);

    stmt.run(license);

    res.json({
        success: true,
        message: "unbanned"
    });
});

// RESET HWID
router.post("/reset-hwid", (req, res) => {
    const db = require("../database");

    const { license } = req.body;

    const stmt = db.prepare(`
        UPDATE licenses
        SET hwid = NULL
        WHERE license = ?
    `);

    const result = stmt.run(license);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "not found"
        });
    }

    res.json({
        success: true,
        message: "hwid reset"
    });
});

module.exports = router;