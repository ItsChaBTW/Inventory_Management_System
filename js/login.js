/**
 * Login module for Inventory Management System
 * Handles user login functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in, redirect to dashboard if so
    const currentUser = getCurrentUser();
    if (currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Get form element
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
function handleLogin(event) {
    event.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    // Validate inputs
    if (!email || !password) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (user && user.password === password) {
        // Store current user in local storage (in real app, don't store password)
        const currentUser = { ...user };
        delete currentUser.password; // Don't store password in session
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showError(errorElement, 'Invalid email or password');
    }
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
 * Get the current user from local storage
 * @returns {Object|null} The current user object or null if not logged in
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
} 