/* Auth system for user login and signup */
document.addEventListener('DOMContentLoaded', function() {
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    const currentUser = getCurrentUser();

    // Redirect to login if not logged in
    if (isProtectedPage && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Redirect logged in users from login/signup pages
    if ((currentPage.includes('login.html') || currentPage.includes('signup.html') || currentPage === 'index.html') && currentUser) {
        if (currentPage === 'index.html') {
            const signInLink = document.querySelector('a[href="login.html"]');
            if (signInLink) {
                signInLink.href = 'dashboard.html';
                signInLink.textContent = 'Dashboard';
            }
        } else {
            window.location.href = 'dashboard.html';
            return;
        }
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Show user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.firstName || 'User';
    }

    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay && currentUser) {
        userDisplay.classList.remove('hidden');
    }
});

/* Get user data from storage */
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/* Logout user */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Create users storage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

/* Check if user is logged in */
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

/* Protect pages that need login */
function requireAuth() {
    const securePages = [
        'dashboard.html',
        'inventory.html',
        'update-profile.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (securePages.includes(currentPage) && !isLoggedIn()) {
        console.log('Unauthorized access attempt to', currentPage);
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

/* Handle login */
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user.id
        }));
        
        window.location.href = 'dashboard.html';
    } else {
        if (errorElement) {
            errorElement.classList.remove('hidden');
        }
    }
}

/* Handle signup */
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('signupError');
    
    if (password !== confirmPassword) {
        if (errorElement) {
            errorElement.textContent = "Passwords don't match";
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.email === email)) {
        if (errorElement) {
            errorElement.textContent = "Email already in use";
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    localStorage.setItem('currentUser', JSON.stringify({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        id: newUser.id
    }));
    
    window.location.href = 'dashboard.html';
}

/* Update user name display */
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

/* Start auth system */
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) {
        return;
    }
    
    updateUserInfo();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const isLogoutLink = 
                link.closest('.border-t') !== null || 
                link.querySelector('.fa-sign-out-alt') !== null;
            
            if (isLogoutLink) {
                e.preventDefault();
                logout();
            }
        });
    });
}); 