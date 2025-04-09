document.addEventListener("DOMContentLoaded", () => {
    const navbarMenu = document.querySelector(".navbar .links");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const hideMenuBtn = navbarMenu.querySelector(".close-btn");
    const showPopupBtn = document.querySelector(".login-btn");
    const signUpButton = document.querySelector(".signup form button[type='submit']");
    const errorMessageDiv = document.querySelector(".error-message");
    const formPopup = document.querySelector(".form-popup");
    const hidePopupBtns = formPopup.querySelectorAll(".close-btn");
    const signupLoginLinks = formPopup.querySelectorAll(".bottom-link a");

    // Forgot Password Popup
    const forgotPasswordBtn = document.querySelector(".forgot-pass-link");
    const signupForm = document.querySelector(".signup form");
    const forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
    const forgotPasswordForm = forgotPasswordPopup.querySelector("form");

    // Create "Email sent" message
    const emailSentMessage = document.createElement("p");
    emailSentMessage.textContent = "Email sent!";
    emailSentMessage.style.color = "green";
    emailSentMessage.style.textAlign = "center";
    emailSentMessage.style.display = "none"; // Initially hidden
    forgotPasswordPopup.querySelector(".form-content").appendChild(emailSentMessage);

    // Toggle visibility of an element
    const toggleElement = (element, className) => {
        element.classList.toggle(className);
    };

    // Show mobile menu
    hamburgerBtn.addEventListener("click", () => {
        toggleElement(navbarMenu, "show-menu");
        hamburgerBtn.setAttribute("aria-expanded", navbarMenu.classList.contains("show-menu"));
    });

    // Hide mobile menu
    hideMenuBtn.addEventListener("click", () => {
        toggleElement(navbarMenu, "show-menu");
        hamburgerBtn.setAttribute("aria-expanded", "false");
    });

    // Show login popup
    showPopupBtn.addEventListener("click", () => {
        document.body.classList.toggle("show-popup");
        toggleElement(formPopup, "show-popup");
    });

    // Hide login/signup popup using all close buttons
    hidePopupBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            toggleElement(formPopup, "show-popup");
            document.body.classList.remove("show-popup"); // Hide the background blur
        });
    });

    // Show or hide signup form using event delegation
    formPopup.addEventListener("click", (e) => {
        if (e.target.matches(".bottom-link a")) {
            e.preventDefault();
            const isSignupLink = e.target.id === 'signup-link';
            formPopup.classList.toggle("show-signup", isSignupLink);
            formPopup.classList.toggle("show-login", !isSignupLink);
        }
    });

    // Select the password input field and the eye icon
    const passwordInput = document.getElementById("login-password");
    const togglePassword = document.getElementById("toggle-password");

    // Show password when hovering over the eye icon
    togglePassword.addEventListener("mouseover", () => {
        passwordInput.setAttribute("type", "text"); // Show the password
    });

    // Hide password when mouse leaves the eye icon
    togglePassword.addEventListener("mouseout", () => {
        passwordInput.setAttribute("type", "password"); // Hide the password
    });

    // Function to display error messages
    const showError = (message, element) => {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = "block";
        element.classList.add("error"); // Add a class to highlight the invalid input
    };

    // Function to clear error messages
    const clearError = (element) => {
        errorMessageDiv.style.display = "none";
        element.classList.remove("error"); // Remove error class
    };

    // Validate phone number format
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
    };

    // Validate password match
    const validatePassword = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    // Password and phone number validation on signup
    signUpButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const phoneNumber = document.getElementById("phone").value; // Get phone number

        console.log("Password:", password); // Debugging log
        console.log("Confirm Password:", confirmPassword); // Debugging log
        console.log("Phone Number:", phoneNumber); // Debugging log

        const phoneInput = document.getElementById("phone");
        const passwordInput = document.getElementById("password");

        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            showError("Phone number must be exactly 10 digits.", phoneInput);
            return; // Exit if the phone number is invalid
        } else {
            clearError(phoneInput);
        }

        // Validate password
        if (!validatePassword(password, confirmPassword)) {
            showError("Passwords do not match. Please try again.", passwordInput);
            return; // Exit if passwords don't match
        } else {
            clearError(passwordInput);
            alert("Passwords match! Proceeding with submission."); // Proceed with form submission
            signupForm.submit();
        }
    });

    // Show forgot password popup
    forgotPasswordBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default behavior
        toggleElement(forgotPasswordPopup, "show-popup");
        document.body.classList.add("show-popup");
    });

    // Hide forgot password popup on close button click
    forgotPasswordPopup.querySelector(".close-btn").addEventListener("click", () => {
        toggleElement(forgotPasswordPopup, "show-popup");
        document.body.classList.remove("show-popup");
    });

    // Close forgot password popup on ESC key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && forgotPasswordPopup.classList.contains("show-popup")) {
            toggleElement(forgotPasswordPopup, "show-popup");
            document.body.classList.remove("show-popup");
        }
    });

    // Submit the forgot password form and display the "Email sent" message
    forgotPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        emailSentMessage.style.display = "block"; // Show the "Email sent" message
        setTimeout(() => {
            toggleElement(forgotPasswordPopup, "show-popup");
            document.body.classList.remove("show-popup"); // Hide the popup after showing the message
            emailSentMessage.style.display = "none"; // Hide the message after popup closes
        }, 2000); // Close popup after 2 seconds
    });

    // Back to login button inside Forgot Password popup
    document.querySelector(".back-to-login").addEventListener("click", (e) => {
        e.preventDefault();
        toggleElement(forgotPasswordPopup, "show-popup");
        toggleElement(formPopup, "show-popup");
        document.body.classList.add("show-popup"); // Show the login popup
    });

    // Handle login form submission and redirect to dashboard (index2.html)
    const loginForm = document.querySelector(".login form");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from submitting in a traditional way

        // Directly redirect to the dashboard page
        window.location.href = "index2.html"; // Redirect to dashboard
    });
});
