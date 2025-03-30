document.addEventListener('DOMContentLoaded', function() {
    processResults();
    
    openTab('drivers'); 
});

async function fetchResults() {
    const url = "https://script.google.com/macros/s/AKfycbwHdBpMhFAcfPjP8Tae0vm-daDzC9feE6fWaqADPqzR43d2eqR-SFNWLwW4X11p0ypS/exec"; 
    
    try {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error reading data:", error);
        return null;
    }
}

async function processResults() {
    const rawData = await fetchResults();
    
    if (!rawData || rawData.length === 0) {
        console.error("No data received");
        return;
    }

    // Process drivers standings
    const driversHeaders = ['Pos', 'Driver', 'Team', 'Points'];
    const driversData = processDriversData(rawData);
    displayTable('drivers-standings', driversHeaders, driversData);

    // Process teams standings
    const teamsHeaders = ['Pos', 'Team', 'Points'];
    const teamsData = processTeamsData(rawData);
    displayTable('teams-standings', teamsHeaders, teamsData);
}

function processDriversData(rawData) {
    // Assuming your Google Sheets data has columns: Position, Driver, Team, Points
    // Adjust according to your actual data structure
    return rawData.slice(1) // Skip header row
        .filter(row => row.length >= 4) // Ensure we have all columns
        .map(row => [row[0], row[1], row[2], row[3]]); // Position, Driver, Team, Points
}

function processTeamsData(rawData) {
    // This is a simplified example - you might need a different approach
    // to calculate team standings from your data
    const teamMap = {};
    
    rawData.slice(1).forEach(row => {
        if (row.length >= 4) {
            const teamName = row[2]; // Team name
            const points = parseInt(row[3]) || 0; // Points
            
            if (!teamMap[teamName]) {
                teamMap[teamName] = 0;
            }
            teamMap[teamName] += points;
        }
    });
    
    // Convert to array and sort by points
    return Object.entries(teamMap)
        .sort((a, b) => b[1] - a[1])
        .map(([team, points], index) => [index + 1, team, points]);
}

function displayTable(tableId, headers, data) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Clear existing content
    table.querySelector('tbody').innerHTML = '';
    
    // Add rows
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