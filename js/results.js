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
    
    const driversData = processDriversData(rawData, selectedType);
    displayTable('drivers-standings', driversData);

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
    }).filter(Boolean);

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
    const stageIndices = {
        "SS1": 4, "SS2": 5, "SS3": 6, "SS4": 7, "SS5": 8, "SS6": 9,
        "SS7": 10, "SS8": 11, "SS9": 12, "SS10": 13, "SS11": 14, "SS12": 15
    };

    const teams = {};

    rawData.slice(1).forEach(row => {
        const team = row[2];
        if (!team) return;

        if (!teams[team]) {
            teams[team] = {
                stageSums: {},
                stageCounts: {},
                hasFinished: false
            };
        }

        // Loop through each stage if overall is selected and calculate the sum of average times from each stage.
        const stagesToConsider = resultType === "overall"
            ? Object.values(stageIndices)
            : [resultType === "overall" ? 3 : stageIndices[resultType]];

        stagesToConsider.forEach(index => {
            const time = parseInt(row[index]) || 0;
            if (time > 0) {
                teams[team].hasFinished = true;
                if (!teams[team].stageSums[index]) {
                    teams[team].stageSums[index] = 0;
                    teams[team].stageCounts[index] = 0;
                }
                teams[team].stageSums[index] += time;
                teams[team].stageCounts[index] += 1;
            }
        });
    });

    return Object.entries(teams)
        .map(([team, data]) => {
            let totalAvg = 0;

            if (resultType === "overall") {
                for (const stageIndex in data.stageSums) {
                    const count = data.stageCounts[stageIndex];
                    if (count > 0) {
                        totalAvg += Math.floor(data.stageSums[stageIndex] / count);
                    }
                }
            } else {
                const stageIndex = resultType === "overall" ? 3 : stageIndices[resultType];
                const count = data.stageCounts[stageIndex] || 0;
                totalAvg = count > 0 ? Math.floor(data.stageSums[stageIndex] / count) : 0;
            }

            return {
                team,
                avgTime: totalAvg,
                hasFinished: data.hasFinished
            };
        })
        .sort((a, b) => {
            if (!a.hasFinished && b.hasFinished) return 1;
            if (a.hasFinished && !b.hasFinished) return -1;
            return a.avgTime - b.avgTime;
        })
        .map(({ team, avgTime, hasFinished }, index) => [
            hasFinished ? index + 1 : "-",
            team,
            hasFinished ? formatTime(avgTime) : "DNF"
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
