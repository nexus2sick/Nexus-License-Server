console.log("APP JS CARGADO");
const API = "/api/licenses";

const output = document.getElementById("output");

function log(data) {
    output.innerText = JSON.stringify(data, null, 2);
}

async function create() {
    const amount = document.getElementById("amount").value;
    const duration = document.getElementById("duration").value;

    const res = await fetch(`${API}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, duration })
    });

    log(await res.json());
}

async function verify() {
    const license = document.getElementById("license").value;
    const hwid = document.getElementById("hwid").value;

    const res = await fetch(`${API}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license, hwid })
    });

    log(await res.json());
}

async function ban() {
    const license = document.getElementById("license").value;

    const res = await fetch(`${API}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license })
    });

    log(await res.json());
}

async function reset() {
    const license = document.getElementById("license").value;

    const res = await fetch(`${API}/reset-hwid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license })
    });

    log(await res.json());
}