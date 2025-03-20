/**
 * Authentication module for Inventory Management System
 * Handles user registration, login, and session management
 */

// Check if user is logged in, redirect if not
document.addEventListener('DOMContentLoaded', function() {
    // Only apply auth check if we're on a page that requires auth (dashboard)
    if (window.location.pathname.includes('dashboard')) {
        checkAuth();
    }
    
    // Set up logout functionality if button exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Display user name if element exists
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const currentUser = getCurrentUser();
        if (currentUser) {
            userNameElement.textContent = currentUser.firstName || 'User';
        }
    }
});

/**
 * Check if user is authenticated, redirect to login if not
 */
function checkAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
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

/**
 * Log the user out by removing their data from local storage
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize the users array in local storage if it doesn't exist
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
} 