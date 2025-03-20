/**
 * Authentication module for Inventory Management System
 * Handles user registration, login, and session management
 */

// Check authentication state on page load
document.addEventListener('DOMContentLoaded', function() {
    // Pages that require authentication
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check if the current page is protected
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    const currentUser = getCurrentUser();

    // For protected pages: redirect to login if not authenticated
    if (isProtectedPage && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // For login/signup pages: redirect to dashboard if already authenticated
    if ((currentPage.includes('login.html') || currentPage.includes('signup.html') || currentPage === 'index.html') && currentUser) {
        // Do not automatically redirect from index page
        if (currentPage === 'index.html') {
            // Just update UI, don't redirect
            const signInLink = document.querySelector('a[href="login.html"]');
            if (signInLink) {
                signInLink.href = 'dashboard.html';
                signInLink.textContent = 'Dashboard';
            }
        } else {
            // Only redirect from login/signup pages
            window.location.href = 'dashboard.html';
            return;
        }
    }
    
    // Set up logout functionality if button exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Display user name if element exists
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.firstName || 'User';
    }

    // Check for user display area
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay && currentUser) {
        userDisplay.classList.remove('hidden');
    }
});

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