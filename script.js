document.addEventListener('DOMContentLoaded', async () => {
    let db = [];
    const input = document.getElementById('food-input');
    const btn = document.getElementById('search-btn');
    const results = document.getElementById('results');
    const loader = document.getElementById('loader');
    
    // NEU: Container für Vorschläge erstellen
    const suggestionsBox = document.createElement('div');
    suggestionsBox.id = 'suggestions';
    suggestionsBox.className = 'suggestions-box hidden';
    input.parentNode.appendChild(suggestionsBox);

    async function init() {
        loader.classList.remove('hidden');
        try {
            const response = await fetch('food_db.json');
            db = await response.json();
        } catch (e) {
            console.error("Datenbank-Fehler!");
        } finally {
            loader.classList.add('hidden');
        }
    }

    // NEU: Autocomplete Logik
    input.addEventListener('input', () => {
        const val = input.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';
        
        if (val.length < 2) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        const matches = db.filter(f => f.name.toLowerCase().includes(val)).slice(0, 5);
        
        if (matches.length > 0) {
            matches.forEach(m => {
                const div = document.createElement('div');
                div.textContent = m.name;
                div.onclick = () => {
                    input.value = m.name;
                    suggestionsBox.classList.add('hidden');
                    runSearch(m.name);
                };
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.classList.remove('hidden');
        } else {
            suggestionsBox.classList.add('hidden');
        }
    });

    function runSearch(specificName = null) {
        const query = (specificName || input.value).toLowerCase().trim();
        const found = db.find(f => f.name.toLowerCase() === query || f.name.toLowerCase().includes(query));

        if (found) {
            document.getElementById('food-title').textContent = found.name;
            fillTable('table-macros', found.macros);
            fillTable('table-vitamins', found.vitamins);
            fillTable('table-minerals', found.minerals);
            fillTable('table-aminos', found.aminos);
            results.classList.remove('hidden');
            suggestionsBox.classList.add('hidden');
        }
    }

    function fillTable(id, data) {
        const table = document.getElementById(id);
        table.innerHTML = '<tr><th>Stoff</th><th>Menge</th></tr>';
        if (data) {
            for (const [key, val] of Object.entries(data)) {
                table.innerHTML += `<tr><td>${key}</td><td>${val}</td></tr>`;
            }
        }
    }

    await init();
    btn.onclick = () => runSearch();
    input.onkeydown = (e) => { if(e.key === 'Enter') runSearch(); };
});
