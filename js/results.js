document.addEventListener('DOMContentLoaded', function () {
    processResults();
    document.querySelectorAll('input[name="resultType"]').forEach(input => {
        input.addEventListener('change', processResults);
    });
});

async function fetchResults() {
    const url = "https://script.google.com/macros/s/AKfycbwHdBpMhFAcfPjP8Tae0vm-daDzC9feE6fWaqADPqzR43d2eqR-SFNWLwW4X11p0ypS/exec";

    try {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error reading data:", error);
        return null;
    }
}

async function processResults() {
    const rawData = await fetchResults();
    if (!rawData || rawData.length === 0) return console.error("No data received");

    const selectedType = document.querySelector('input[name="resultType"]:checked').value;
    
    // Procesowanie wyników dla kierowców
    const driversData = processDriversData(rawData, selectedType);
    displayTable('drivers-standings', driversData);

    // Procesowanie wyników dla drużyn
    const teamsData = processTeamsData(rawData, selectedType);
    displayTable('teams-standings', teamsData);
}

function processDriversData(rawData, resultType) {
    const driversData = rawData.slice(1).map(row => {
        if (!row[1]) return null;

        const driver = row[1];
        const team = row[2];
        const time = parseInt(getStageTime(row, resultType)) || 0;

        return { driver, team, time, dnf: time === 0 };
    }).filter(Boolean); // Usuwamy null (czyli te wiersze, które miały pustą nazwę kierowcy)

    return driversData
        .sort((a, b) => {
            if (a.dnf && !b.dnf) return 1;
            if (!a.dnf && b.dnf) return -1;
            return a.time - b.time;
        })
        .map(({ driver, team, time, dnf }, index) => [
            dnf ? "-" : index + 1,
            driver,
            team,
            dnf ? "DNF" : formatTime(time)
        ]);
}


function processTeamsData(rawData, resultType) {
    const teams = {};

    rawData.slice(1).forEach(row => {
        if (row.length < 4) return;

        const team = row[2];
        const time = parseInt(getStageTime(row, resultType)) || 0;

        if (!teams[team]) {
            teams[team] = { team, time: 0, dnf: false, driversCount: 0 };
        }

        teams[team].time += time;
        teams[team].driversCount++;

        if (time === 0) {
            teams[team].dnf = true;
        }
    });

    return Object.values(teams)
        .sort((a, b) => {
            if (a.dnf && !b.dnf) return 1;
            if (!a.dnf && b.dnf) return -1;
            return a.time - b.time;
        })
        .map(({ team, time, dnf }, index) => [
            dnf ? "-" : index + 1,
            team,
            dnf ? "DNF" : formatTime(time)
        ]);
}

function getStageTime(row, resultType) {
    const stageIndex = {
        "SS1": 4, "SS2": 5, "SS3": 6, "SS4": 7, "SS5": 8, "SS6": 9,
        "SS7": 10, "SS8": 11, "SS9": 12, "SS10": 13, "SS11": 14, "SS12": 15
    };

    if (resultType === "overall") return row[3];
    return row[stageIndex[resultType]] || 0; 
}

function displayTable(tableId, data) {
    const table = document.getElementById(tableId);
    if (!table) return;

    table.querySelector('tbody').innerHTML = '';

    data.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            row.appendChild(td);
        });
        table.querySelector('tbody').appendChild(row);
    });
}

function formatTime(ms) {
    if (ms === 0) return "DNF";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}
