// Replit Auth - Automatically redirect to Replit login page
// This replaces the old hardcoded login system
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Redirect to Replit Auth login
            window.location.href = '/api/login';
        });
    }
    
    // Also add a direct redirect button
    const loginButton = document.querySelector('.sign-in');
    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/api/login';
        });
    }
});