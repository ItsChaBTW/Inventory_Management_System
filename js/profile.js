/**
 * Profile Management Module for Inventory Management System
 * Handles loading and updating user profile information
 */

// Load user profile data
function loadUserProfile() {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login if no user is logged in
        window.location.href = 'login.html';
        return;
    }

    // Populate form fields with user data
    document.getElementById('firstName').value = currentUser.firstName || '';
    document.getElementById('lastName').value = currentUser.lastName || '';
    document.getElementById('email').value = currentUser.email || '';
    
    // Set user name in header
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        element.textContent = currentUser.firstName || 'User';
    });
    
    // Add event listener to form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

// Handle profile update form submission
function handleProfileUpdate(event) {
    event.preventDefault();
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get form data
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!firstName || !lastName || !email) {
        showUpdateMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showUpdateMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Check if email is already in use by another user
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userWithSameEmail = users.find(user => user.email === email && user.id !== currentUser.id);
    if (userWithSameEmail) {
        showUpdateMessage('Email is already in use by another account', 'error');
        return;
    }
    
    // Check if password change is requested
    let passwordChange = false;
    if (currentPassword || newPassword || confirmPassword) {
        // All password fields must be filled for a password change
        if (!currentPassword || !newPassword || !confirmPassword) {
            showUpdateMessage('All password fields are required to change password', 'error');
            return;
        }
        
        // New passwords must match
        if (newPassword !== confirmPassword) {
            showUpdateMessage('New passwords do not match', 'error');
            return;
        }
        
        // Current password must match
        const userObj = users.find(user => user.id === currentUser.id);
        if (!userObj || userObj.password !== currentPassword) {
            showUpdateMessage('Current password is incorrect', 'error');
            return;
        }
        
        passwordChange = true;
    }
    
    // Update user data in users array
    const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
            const updatedUser = {
                ...user,
                firstName,
                lastName,
                email
            };
            
            if (passwordChange) {
                updatedUser.password = newPassword;
            }
            
            return updatedUser;
        }
        return user;
    });
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user in session
    const updatedCurrentUser = {
        ...currentUser,
        firstName,
        lastName,
        email
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    
    // Show success message
    showUpdateMessage('Profile updated successfully', 'success');
    
    // Update displayed user name
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        element.textContent = firstName || 'User';
    });
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Display update status message
function showUpdateMessage(message, type) {
    const messageElement = document.getElementById('updateMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
        
        if (type === 'success') {
            messageElement.classList.add('bg-green-100', 'text-green-800');
        } else {
            messageElement.classList.add('bg-red-100', 'text-red-800');
        }
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get current user from localStorage
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
} 