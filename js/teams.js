document.addEventListener('DOMContentLoaded', function() {
    fetchTeamsData();
});

async function fetchTeamsData() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwHdBpMhFAcfPjP8Tae0vm-daDzC9feE6fWaqADPqzR43d2eqR-SFNWLwW4X11p0ypS/exec');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw data from API:', data);
        
        printDriversByTeam(data);
        
    } catch (error) {
        console.error('Error:', error);
        const teamCardsContainer = document.getElementById('team-cards');
        if (teamCardsContainer) {
            teamCardsContainer.innerHTML = `
                <div class="error-message">
                    Failed to load team data. Please try again later.
                    <br><small>${error.message}</small>
                </div>
            `;
        }
    }
}

function getNationalityDisplay(countryCode) {
    if (!countryCode) return '';
    
    const normalizedCode = countryCode.trim().toUpperCase();
    const flagCode = normalizedCode.slice(0, 2).toLowerCase();
    
    return `
        <span class="nationality-flag-container" title="${normalizedCode}">
            <img src="https://flagcdn.com/24x18/${flagCode}.png"
                 alt="${normalizedCode}"
                 class="nationality-flag"
                 onerror="this.parentElement.innerHTML = '${normalizedCode}'">
        </span>
    `;
}

function getDriverImage(imageName) {
    if (!imageName) {
        return getDriverPlaceholder('?');
    }
    
    return `${imageName}`;
}

function getDriverPlaceholder(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23ddd'/><text x='50%' y='50%' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%23666'>${initials}</text></svg>`;
}

function printDriversByTeam(rows) {
    if (!rows || rows.length < 2) {
        throw new Error('No driver data available');
    }
    
    const headers = rows[0];
    const driversData = rows.slice(1);
    const teamCardsContainer = document.getElementById('team-cards');
    
    if (!teamCardsContainer) {
        console.error('Team cards container not found');
        return;
    }
    
    teamCardsContainer.innerHTML = '<h3>Teams and Drivers</h3>';
    
    const teams = {};
    
    driversData.forEach((row, index) => {
        try {
            if (!row || row.length < 3) {
                console.warn(`Skipping incomplete row ${index + 1}`);
                return;
            }
            
            const driverName = row[1] ? row[1].trim() : '';
            if (!driverName) return;
            
            const teamName = row[2] ? row[2].trim() : 'No team';
            
            if (!teams[teamName]) {
                teams[teamName] = [];
            }
            
            teams[teamName].push({
                number: parseInt(row[0]) || 0,
                name: driverName,
                nationality: getNationalityDisplay(row[17]),
                image: getDriverImage(row[16])
            });
            
        } catch (e) {
            console.error(`Error processing row ${index + 1}:`, e);
        }
    });
    
    for (const [teamName, drivers] of Object.entries(teams)) {
        const teamSection = document.createElement('div');
        teamSection.className = 'team-section';
        
        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';
        teamHeader.innerHTML = `<h4>${teamName}</h4>`;
        
        const driversContainer = document.createElement('div');
        driversContainer.className = 'drivers-container';
        
        const driversGrid = document.createElement('div');
        driversGrid.className = 'drivers-grid-container';
        
        drivers.forEach(driver => {
            const driverCard = document.createElement('div');
            driverCard.className = 'driver-card';
            driverCard.innerHTML = `
                <div class="driver-image-container">
                    <img src="${driver.image}" alt="${driver.name}" 
                         onerror="this.onerror=null;this.src='${getDriverPlaceholder(driver.name)}'">
                    <span class="driver-number">#${driver.number}</span>
                    <span class="driver-nationality">${driver.nationality}</span>
                </div>
                <div class="driver-info">
                    <h4 class="driver-name">${driver.name}</h4>
                </div>
            `;
            driversGrid.appendChild(driverCard);
        });
        
        driversContainer.appendChild(driversGrid);
        teamSection.appendChild(teamHeader);
        teamSection.appendChild(driversContainer);
        teamCardsContainer.appendChild(teamSection);
    }
}