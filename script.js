document.addEventListener('DOMContentLoaded', async () => {
    let db = [];
    const input = document.getElementById('food-input');
    const btn = document.getElementById('search-btn');
    const results = document.getElementById('results');

    // 1. Datenbank laden
    try {
        const response = await fetch('food_db.json');
        db = await response.json();
    } catch (e) {
        console.error("Datenbank konnte nicht geladen werden. Prüfe food_db.json");
    }

    // 2. Suche ausführen
    function search() {
        const query = input.value.toLowerCase().trim();
        const found = db.find(f => f.name.toLowerCase().includes(query));

        if (found) {
            document.getElementById('food-title').textContent = found.name;
            renderTable('table-macros', found.macros);
            renderTable('table-vitamins', found.vitamins);
            renderTable('table-minerals', found.minerals);
            renderTable('table-aminos', found.aminos);
            results.classList.remove('hidden');
        } else {
            alert("Nicht gefunden. Versuche 'Ei'.");
        }
    }

    function renderTable(id, data) {
        const table = document.getElementById(id);
        table.innerHTML = '<tr><th>Stoff</th><th>Menge</th></tr>';
        for (const [key, val] of Object.entries(data)) {
            table.innerHTML += `<tr><td>${key}</td><td>${val}</td></tr>`;
        }
    }

    btn.onclick = search;
    input.onkeydown = (e) => { if(e.key === 'Enter') search(); };
});
