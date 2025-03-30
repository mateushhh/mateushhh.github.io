// Calendar data - in a real app, this would come from an API
document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar');
    
    // Sample data - replace with your Google Sheets data
    const events = [
        {
            id: 1,
            name: "Rally Monte Carlo",
            date: "January 25-28, 2024",
            location: "Monte Carlo, Monaco",
            status: "completed",
            image: "monte-carlo.jpg"
        },
        {
            id: 2,
            name: "Rally Sweden",
            date: "February 15-18, 2024",
            location: "Umeå, Sweden",
            status: "completed",
            image: "sweden.jpg"
        },
        {
            id: 3,
            name: "Rally Mexico",
            date: "March 7-10, 2024",
            location: "León, Mexico",
            status: "upcoming",
            image: "mexico.jpg"
        },
        // Add more events as needed
    ];
    
    // Render events
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        let statusClass, statusText;
        switch(event.status) {
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'Completed';
                break;
            case 'ongoing':
                statusClass = 'status-ongoing';
                statusText = 'Ongoing';
                break;
            default:
                statusClass = 'status-upcoming';
                statusText = 'Upcoming';
        }
        
        eventCard.innerHTML = `
            <div class="event-image" style="background-image: url('assets/${event.image}')"></div>
            <div class="event-info">
                <div class="event-date">${event.date}</div>
                <h3 class="event-title">${event.name}</h3>
                <div class="event-location">${event.location}</div>
                <span class="event-status ${statusClass}">${statusText}</span>
            </div>
        `;
        
        calendarContainer.appendChild(eventCard);
    });
    
    // In a real app, you would fetch this data from Google Sheets
    // fetchCalendarData();
});

// Function to fetch calendar data from Google Sheets
async function fetchCalendarData() {
    try {
        // Replace with your Google Sheets API endpoint
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Calendar!A1:E100?key=YOUR_API_KEY');
        const data = await response.json();
        
        // Process the data and update the calendar
        // This will depend on your specific Google Sheets structure
        console.log('Calendar data:', data);
        
    } catch (error) {
        console.error('Error fetching calendar data:', error);
    }
}