/**
 * Signup module for Inventory Management System
 * Handles user registration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

/**
 * Handle signup form submission
 * @param {Event} event - The form submission event
 */
function handleSignup(event) {
    event.preventDefault();
    
    // Get form data
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('signupError');
    
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showError(errorElement, 'Passwords do not match');
        return;
    }
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email is already in use
    if (users.some(user => user.email === email)) {
        showError(errorElement, 'Email is already in use');
        return;
    }
    
    // Create new user object
    const newUser = {
        id: generateUserId(),
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    // Add user to users array
    users.push(newUser);
    
    // Save users array back to local storage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create session (log user in)
    const currentUser = { ...newUser };
    delete currentUser.password; // Don't store password in session
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

/**
 * Display error message
 * @param {HTMLElement} element - The error element to display message in
 * @param {string} message - The error message to display
 */
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            element.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Generate a unique user ID
 * @returns {string} A unique ID for the user
 */
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
} 