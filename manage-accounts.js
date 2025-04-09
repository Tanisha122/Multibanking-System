// Selecting elements for side menu, menu button, close button, and theme toggler
const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');
const themeToggler = document.querySelector('.theme-toggler');

// Event listener to open the side menu
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('visible'); // Add a class to show side menu
});

// Event listener to close the side menu
closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('visible'); // Remove class to hide side menu
});

// Event listener for toggling theme (light/dark mode)
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    // Save theme state to local storage
    const isDark = document.body.classList.contains('dark-theme-variables');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Apply saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
        themeToggler.querySelector('span:nth-child(2)').classList.add('active');
    }
});

// Function to toggle the new account creation form
function toggleNewAccountForm() {
    const form = document.getElementById('newAccountForm'); // The form element
    const insightsSection = document.querySelector('.insights'); // Section containing account options

    // Toggle the form visibility
    form.style.display = form.style.display === 'none' ? 'block' : 'none';

    // Adjust the layout of the insights section
    if (form.style.display === 'block') {
        insightsSection.classList.add('center-accounts');
    } else {
        insightsSection.classList.remove('center-accounts');
    }
}

// Event listener for the "Create New Account" button
const createAccountBtn = document.getElementById('createAccountBtn'); // The button ID
if (createAccountBtn) {
    createAccountBtn.addEventListener('click', toggleNewAccountForm);
}

// Function to close the form when clicking outside
document.addEventListener('click', function(event) {
    const form = document.getElementById('newAccountForm');
    const isClickInsideForm = form.contains(event.target);
    const isClickInsideButton = event.target.id === 'createAccountBtn';

    if (!isClickInsideForm && !isClickInsideButton) {
        form.style.display = 'none'; // Close the form
        const insightsSection = document.querySelector('.insights');
        insightsSection.classList.remove('center-accounts'); // Restore layout
    }
});

// Function to toggle the account details section
function toggleTransactions(accountType) {
    // Handle visibility of account details section
    const accountsContainer = document.getElementById('accounts-container');
    const newAccountForm = document.getElementById('newAccountForm');

    if (accountType === 'A') {
        // Toggle the "View Accounts" section
        if (accountsContainer.style.display === 'none' || accountsContainer.style.display === '') {
            accountsContainer.style.display = 'block';
        } else {
            accountsContainer.style.display = 'none';
        }
    }
    
    if (accountType === 'S') {
        alert("View details of Savings Account");
        // Handle display of Savings account details
        // Example: You can add a modal or separate section to display details
    }
    
    if (accountType === 'C') {
        alert("View details of Current Account");
        // Handle display of Current account details
    }
    
    if (accountType === 'F') {
        alert("View details of FD Account");
        // Handle display of FD account details
    }
    
    if (accountType === 'B') {
        // Toggle visibility of the New Account form
        if (newAccountForm.style.display === 'none' || newAccountForm.style.display === '') {
            newAccountForm.style.display = 'block';
        } else {
            newAccountForm.style.display = 'none';
        }
    }
}
