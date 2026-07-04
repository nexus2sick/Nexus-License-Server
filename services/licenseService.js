const db = require("../database");
const { generateLicenseKey } = require("./keyGenerator");

function createLicenses(amount, duration) {

    amount = parseInt(amount);
duration = parseInt(duration);

    const licenses = [];

    const insert = db.prepare(`
        INSERT INTO licenses (license, duration, createdAt, expiresAt, active, banned, hwid)
        VALUES (?, ?, ?, ?, 1, 0, NULL)
    `);

    const check = db.prepare(`
        SELECT license FROM licenses WHERE license = ?
    `);

    for (let i = 0; i < amount; i++) {
        let key;

        do {
            key = generateLicenseKey();
        } while (check.get(key));

        const now = Date.now();
        const expiresAt = duration === -1 ? null : now + duration * 24 * 60 * 60 * 1000;

        insert.run(key, duration, now, expiresAt);

        licenses.push(key);
    }

    return licenses;
}

function verifyLicense(license, hwid) {
    const find = db.prepare(`
        SELECT * FROM licenses WHERE license = ?
    `);

    const updateHWID = db.prepare(`
        UPDATE licenses SET hwid = ? WHERE license = ?
    `);

    const data = find.get(license);

    const now = Date.now();

let daysRemaining = 0;
let lifetime = false;

if (data && data.expiresAt === null) {
    lifetime = true;
} else if (data && data.expiresAt) {
    daysRemaining = Math.ceil((data.expiresAt - now) / (1000 * 60 * 60 * 24));
}

    if (!data)
        return { success: false, reason: "INVALID_LICENSE" };

    if (!data.active)
        return { success: false, reason: "INACTIVE" };

    if (data.banned)
        return { success: false, reason: "BANNED" };

    if (data.expiresAt && Date.now() > data.expiresAt)
        return { success: false, reason: "EXPIRED" };

    // HWID bind
    if (!data.hwid) {
        updateHWID.run(hwid, license);

        return {
    success: true,
    reason: "FIRST_LOGIN",
    daysRemaining,
    lifetime
};
    }

    if (data.hwid !== hwid)
        return {
            success: false,
            reason: "HWID_MISMATCH"
        };

    return {
    success: true,
    reason: "VALID",
    daysRemaining,
    lifetime
};
}

module.exports = {
    createLicenses,
    verifyLicense
};