document.addEventListener('DOMContentLoaded', function() {
    // Sample data - replace with Google Sheets API call
    const teamsData = [
        {
            id: 1,
            name: "Toyota Gazoo Racing",
            logo: "toyota-logo.png",
            drivers: [
                { number: 69, name: "Kalle Rovanperä" },
                { number: 33, name: "Elfyn Evans" }
            ]
        },
        {
            id: 2,
            name: "Hyundai Shell Mobis",
            logo: "hyundai-logo.png",
            drivers: [
                { number: 11, name: "Thierry Neuville" },
                { number: 6, name: "Dani Sordo" }
            ]
        },
        {
            id: 3,
            name: "M-Sport Ford",
            logo: "ford-logo.png",
            drivers: [
                { number: 42, name: "Craig Breen" },
                { number: 44, name: "Gus Greensmith" }
            ]
        }
    ];
    
    // Render team cards
    const teamCardsContainer = document.getElementById('team-cards');
    
    teamsData.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        
        teamCard.innerHTML = `
            <div class="team-logo">
                <img src="assets/${team.logo}" alt="${team.name}">
            </div>
            <div class="team-info">
                <h3 class="team-name">${team.name}</h3>
                ${team.drivers.map(driver => `
                    <div class="driver">
                        <span class="driver-number">#${driver.number}</span>
                        <span class="driver-name">${driver.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        teamCardsContainer.appendChild(teamCard);
    });
    
    // In a real app, you would fetch this data from Google Sheets
    // fetchTeamsData();
});

// Function to fetch teams data from Google Sheets
async function fetchTeamsData() {
    try {
        // Replace with your Google Sheets API endpoint
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Teams!A1:E100?key=YOUR_API_KEY');
        const data = await response.json();
        
        // Process the data and update the team cards
        console.log('Teams data:', data);
        
    } catch (error) {
        console.error('Error fetching teams data:', error);
    }
}