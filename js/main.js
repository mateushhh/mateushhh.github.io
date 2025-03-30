// Shared functions across all pages

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Common initialization code can go here
});

// Tab functionality for Results page
function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active-tab');
    }
    
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active-tab');
    event.currentTarget.classList.add('active');
}