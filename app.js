document.addEventListener('DOMContentLoaded', () => {
  // Handle signup form submission
  const signupForm = document.querySelector('.signup form');
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Collect form data
      const firstName = signupForm.querySelector('input[placeholder="First Name"]').value;
      const lastName = signupForm.querySelector('input[placeholder="Last Name"]').value;
      const email = signupForm.querySelector('input[type="email"]').value;
      const username = signupForm.querySelector('input[placeholder="Username"]').value;
      const phone = signupForm.querySelector('input[placeholder="Phone Number"]').value;
      const password = signupForm.querySelector('input[placeholder="Create Password"]').value;
      const confirmPassword = signupForm.querySelector('input[placeholder="Confirm Password"]').value;

      // Validate passwords
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Send data to the server
      fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, username, phone, password }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => { throw new Error(text); });
          }
          return response.text();
        })
        .then((message) => {
          alert(message); // Show success message
          window.location.href = 'login.html'; // Redirect to login page
        })
        .catch((error) => alert(error.message));
    });
  }

  // Handle login form submission
  const loginForm = document.querySelector('.login form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Collect form data
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      // Send login request to the server
      fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Invalid credentials');
          return response.json();
        })
        .then((data) => {
          sessionStorage.setItem('username', data.username); // Store username
          window.location.href = 'dashboard.html'; // Redirect to dashboard
        })
        .catch((error) => {
          alert(error.message);
          console.error('Error logging in:', error);
        });
    });
  }

  // Fetch and display users (admin/dashboard feature)
  const userList = document.getElementById('user-list');
  if (userList) {
    fetch('http://localhost:4000/users')
      .then((response) => response.json())
      .then((data) => {
        userList.innerHTML = ''; // Clear existing user list

        data.forEach((user) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${user.username} (${user.email})`;
          userList.appendChild(listItem);
        });
      })
      .catch((error) => console.error('Error fetching users:', error));
  }

  // Display logged-in username
  const welcomeMessage = document.getElementById('welcome-message');
  if (welcomeMessage) {
    const username = sessionStorage.getItem('username');
    if (username) {
      welcomeMessage.textContent = `Welcome, ${username}`;
    } else {
      welcomeMessage.textContent = 'Welcome, Guest';
    }
  }
});
