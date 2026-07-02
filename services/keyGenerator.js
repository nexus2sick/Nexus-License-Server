const { randomBytes } = require("crypto");

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomPart(length = 6) {
    let result = "";

    while (result.length < length) {
        const byte = randomBytes(1)[0];
        result += CHARS[byte % CHARS.length];
    }

    return result;
}

function generateLicenseKey() {
    return `NEXUS-${randomPart()}-${randomPart()}-${randomPart()}-${randomPart()}`;
}

module.exports = {
    generateLicenseKey
};