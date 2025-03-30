let people = [];
let intervals = [];

// Add a person and create their timer
function addPerson() {
    const name = document.getElementById('personName').value;
    if (name) {
        people.push({ name, start: 0, elapsed: 0 });
        displayTimers();
        document.getElementById('personName').value = '';
    }
}

// Display timers for all people
function displayTimers() {
    const container = document.getElementById('timers');
    container.innerHTML = '';
    people.forEach((person, index) => {
        container.innerHTML += `
            <div class="timer">
                <strong>${person.name}</strong>
                <span id="time${index}">0:00:000</span>
                <button onclick="startTimer(${index})">Start</button>
                <button onclick="pauseTimer(${index})">Pause</button>
                <button onclick="resetTimer(${index})">Reset</button>
                <button onclick="removePerson(${index})">Remove</button>
                </div>
            `;
    });
}

// Start timer for a person
function startTimer(index) {
    if (people[index].start === 0) {
        people[index].start = Date.now() - people[index].elapsed;
    }
    intervals[index] = setInterval(() => updateTimer(index), 10);
}

// Pause timer for a person
function pauseTimer(index) {
    clearInterval(intervals[index]);
    people[index].elapsed = Date.now() - people[index].start;
    updateTimer(index);
}

// Reset timer for a person
function resetTimer(index) {
    clearInterval(intervals[index]);
    people[index].start = 0;
    people[index].elapsed = 0;
    document.getElementById(`time${index}`).textContent = '0:00:000';
}

// Update the timer display
function updateTimer(index) {
    const elapsedTime = Date.now() - people[index].start;
    const ms = elapsedTime % 1000;
    const s = Math.floor((elapsedTime / 1000) % 60);
    const m = Math.floor(elapsedTime / 60000);
    document.getElementById(`time${index}`).textContent = `${m}:${s < 10 ? '0' : ''}${s}:${ms < 100 ? '0' : ''}${ms}`;
}

// Save results to a text file
function saveResults() {
    let result = '';
    people.forEach(person => {
        const elapsedTime = person.elapsed;
        const ms = elapsedTime % 1000;
        const s = Math.floor((elapsedTime / 1000) % 60);
        const m = Math.floor(elapsedTime / 60000);
        result += `${person.name};${person.elapsed};${m}:${s < 10 ? '0' : ''}${s}:${ms < 100 ? '0' : ''}${ms}\n`;
    });

    const blob = new Blob([result], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.txt';
    link.click();
}

function removePerson(index) {
    clearInterval(intervals[index]);
    people.splice(index, 1);
    intervals.splice(index, 1);
    displayTimers();
}