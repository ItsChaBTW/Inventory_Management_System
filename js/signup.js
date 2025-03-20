document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('signupError');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(errorElement, 'Passwords do not match');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.email === email)) {
        showError(errorElement, 'Email is already in use');
        return;
    }
    
    const newUser = {
        id: generateUserId(),
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = { ...newUser };
    delete currentUser.password;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    window.location.href = 'dashboard.html';
}

/**
 * @param {HTMLElement} element 
 * @param {string} message 
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
 * @returns {string} 
 */
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * @param {string} email
 * @returns {boolean} 
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
} 