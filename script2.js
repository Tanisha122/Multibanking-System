// Constants for account types
const ACCOUNTS = {
    A: 'Savings Account',
    B: 'Current Account',
    C: 'FD Account',
};

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

// Refactor the transaction handling for reusability
const getTransactions = (account) => {
    const transactionsMap = {
        A: [
            { amount: '-Rs. 100', fromTo: 'Big Bite', time: '2024-12-14 12:30', label: 'Payment' },
            { amount: '+Rs. 50', fromTo: 'Account C', time: '2024-12-14 10:00', label: 'Transfer' },
        ],
        B: [
            { amount: '+Rs. 200', fromTo: 'Account A', time: '2024-12-13 16:00', label: 'Transfer' },
            { amount: '-Rs. 300', fromTo: 'Food court', time: '2024-12-12 14:20', label: 'Payment' },
        ],
        C: [
            { amount: 'Rs. 150', fromTo: 'Account A', time: '2024-12-15 09:45', label: 'Refund' },
            { amount: 'Rs. 75', fromTo: 'Account B', time: '2024-12-11 08:30', label: 'Withdrawal' },
        ],
    };
    return transactionsMap[account] || [];
};

// Function to toggle showing recent transactions based on account clicked
function toggleTransactions(account) {
    const transactionsSection = document.getElementById('recentTransactions');
    const transactionBody = document.getElementById('transactionBody');
    const insightsSection = document.querySelector('.insights'); // Accounts section

// Select account elements
const accounts = document.querySelectorAll('.account');

accounts.forEach(account => {
  account.addEventListener('click', () => {
    // Remove highlight from all accounts
    accounts.forEach(acc => acc.classList.remove('highlight'));
    // Add highlight to the clicked account
    account.classList.add('highlight');
  });
});

    transactionsSection.style.display = 'block';
    insightsSection.classList.add('center-accounts');
    transactionBody.innerHTML = ''; // Clear previous rows

    const transactions = getTransactions(account);
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.amount}</td>
            <td>${transaction.fromTo}</td>
            <td>${transaction.time}</td>
            <td class="${transaction.label === 'Payment' ? 'warning' : 'primary'}">${transaction.label}</td>
        `;
        transactionBody.appendChild(row);
    });
}

// Function to close the Recent Transactions section when clicking anywhere else
document.addEventListener('click', function(event) {
    const transactionsSection = document.getElementById('recentTransactions');
    const accountsSection = document.querySelectorAll('.account');  // Account A, B, and C sections
    const isClickInsideAccount = Array.from(accountsSection).some(account => account.contains(event.target));
    const isClickInsideTransactions = transactionsSection.contains(event.target);

    if (!isClickInsideAccount && !isClickInsideTransactions) {
        transactionsSection.style.display = 'none';  // Close the recent transactions section
        const insightsSection = document.querySelector('.insights');
        insightsSection.classList.remove('center-accounts'); // Restore account position
    }
});

