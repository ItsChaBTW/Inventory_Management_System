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

/**
 * Authentication functionality for Inventory Management System
 */

// Check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Redirect to login if not authenticated
function requireAuth() {
    // List of pages that require authentication
    const securePages = [
        'dashboard.html',
        'inventory.html',
        'update-profile.html'
    ];
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Check if this is a secure page
    if (securePages.includes(currentPage) && !isLoggedIn()) {
        console.log('Unauthorized access attempt to', currentPage);
        // Redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in localStorage (in a real app, use secure tokens instead)
        localStorage.setItem('currentUser', JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user.id
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error message
        if (errorElement) {
            errorElement.classList.remove('hidden');
        }
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('signupError');
    
    // Validate password match
    if (password !== confirmPassword) {
        if (errorElement) {
            errorElement.textContent = "Passwords don't match";
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        if (errorElement) {
            errorElement.textContent = "Email already in use";
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password // Note: In a real app, hash the password before storing
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        id: newUser.id
    }));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Update UI with user info
function updateUserInfo() {
    const userNameElements = document.querySelectorAll('#userName');
    
    if (userNameElements.length > 0) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            userNameElements.forEach(element => {
                element.textContent = currentUser.firstName;
            });
        }
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authorized to access this page
    if (!requireAuth()) {
        return; // Stop initialization if unauthorized
    }
    
    // Update UI with user info
    updateUserInfo();
    
    // Add event listeners for login/signup forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Setup logout functionality
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle clicks on logout links (those inside the sidebar or dropdown)
            const isLogoutLink = 
                link.closest('.border-t') !== null || // In sidebar
                link.querySelector('.fa-sign-out-alt') !== null; // Has logout icon
            
            if (isLogoutLink) {
                e.preventDefault();
                logout();
            }
        });
    });
}); 