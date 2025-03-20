/**
 * Animations for Inventory Management System
 */

// Show loading animation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Create loader overlay
    const loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'loader-overlay';
    
    // Create running man animation
    const runningMan = document.createElement('div');
    runningMan.className = 'running-man';
    
    const figure = document.createElement('div');
    figure.className = 'figure';
    
    runningMan.appendChild(figure);
    loaderOverlay.appendChild(runningMan);
    document.body.appendChild(loaderOverlay);
    
    // Hide loader after a short delay (to ensure it's visible even on fast loads)
    setTimeout(function() {
        loaderOverlay.classList.add('loader-hidden');
        
        // Remove from DOM after transition completes
        setTimeout(function() {
            document.body.removeChild(loaderOverlay);
        }, 500); // Match this to the CSS transition time
    }, 1000); // Adjust timing as needed (1 second)
    
    // Apply animation classes to elements
    applyAnimationClasses();
});

// Apply animation classes to appropriate elements
function applyAnimationClasses() {
    // Apply logo animation
    const logoElements = document.querySelectorAll('.sidebar a:first-child');
    logoElements.forEach(el => el.classList.add('logo-animate'));
    
    // Apply card hover animations
    const cards = document.querySelectorAll('.bg-white.rounded-xl');
    cards.forEach(card => card.classList.add('card-hover'));
    
    // Apply button animations
    const buttons = document.querySelectorAll('button:not(.px-3.py-1)');
    buttons.forEach(button => button.classList.add('btn-animate'));
    
    // Apply table row animations
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => row.classList.add('table-row-animate'));
    
    // Apply sidebar link animations
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');
    sidebarLinks.forEach(link => link.classList.add('sidebar-link-animate'));
    
    // Apply input field animations
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.classList.add('input-animate'));
    
    // Apply icon animations
    const icons = document.querySelectorAll('.fa-user, .fa-cog, .fa-sync-alt');
    icons.forEach(icon => icon.classList.add('icon-spin'));
    
    // Add page transition to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }
    
    // Add pulse animation to notification elements
    const notifications = document.querySelectorAll('.bg-yellow-100, .bg-red-100');
    notifications.forEach(notification => notification.classList.add('pulse'));
}

// Function to show notification with animation
window.showNotification = function(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification-animate fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50';
    
    // Set background color based on type
    if (type === 'success') {
        notification.classList.add('bg-green-100', 'text-green-800', 'border-l-4', 'border-green-500');
    } else if (type === 'error') {
        notification.classList.add('bg-red-100', 'text-red-800', 'border-l-4', 'border-red-500');
    } else if (type === 'warning') {
        notification.classList.add('bg-yellow-100', 'text-yellow-800', 'border-l-4', 'border-yellow-500');
    }
    
    // Add message
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="mr-3">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div>${message}</div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        // Remove from DOM after transition
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced form submission animation
document.addEventListener('submit', function(e) {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        // Add loading spinner
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate form processing (remove in production)
        if (!e.target.hasAttribute('data-no-simulate')) {
            e.preventDefault();
            setTimeout(function() {
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Done!';
                
                setTimeout(function() {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success notification
                    window.showNotification('Operation completed successfully!', 'success');
                }, 1000);
            }, 1500);
        }
    }
});

// Add animation when deleting items
window.animateDeleteItem = function(element) {
    if (element) {
        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 500);
    }
}

// Export functions to be used in HTML
window.applyAnimationClasses = applyAnimationClasses; 