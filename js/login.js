document.addEventListener('DOMContentLoaded', function() {
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
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    if (!email || !password) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(u => u.email === email);
    
    if (user && user.password === password) {
        const currentUser = { ...user };
        delete currentUser.password; 
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
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