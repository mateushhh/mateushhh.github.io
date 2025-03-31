document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('calendar');

    fetchCalendarData();
});

async function fetchCalendarData() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby13VfHFS-1pXlXYQ-CLLjs1NU9hODLS8pt3oG6Av8yWddRvoE6ISAPC0xG1iyFnEv7/exec');
        const data = await response.json();
        
        const events = data.slice(1).map(row => {
            return {
                id: row[0],
                name: row[1],
                date: formatDateForDisplay(row[2]),
                status: row[3].toLowerCase(),
                image: row[4],
            };
        });
        
        renderEvents(events);
    } catch (error) {
        console.error('Error fetching calendar data:', error);
    }
}

function renderEvents(events) {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = '';
    
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
            <div class="event-image" style="background-image: url('${event.image}')"></div>
            <div class="event-info">
                <div class="event-date">${event.date}</div>
                <h3 class="event-title">${event.name}</h3>
                <span class="event-status ${statusClass}">${statusText}</span>
            </div>
        `;
        
        calendarContainer.appendChild(eventCard);
    });
}

function formatDateForDisplay(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch {
        return dateString;
    }
}