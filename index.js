// Check authentication status with Replit Auth
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/user', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            return { isAuthenticated: true, user };
        }
        
        return { isAuthenticated: false, user: null };
    } catch (error) {
        console.error('Auth check failed:', error);
        return { isAuthenticated: false, user: null };
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const loginLink = document.getElementById('login-link');
    const userProfileDiv = document.getElementById('user-profile');
    const toPanelLink = document.getElementById('to-panel-link');
    const getStartedLink = document.getElementById('get-started-link');
    
    // Check authentication with backend
    const { isAuthenticated, user } = await checkAuth();

    function updateHeaderStatus() {
        if (isAuthenticated) {
            if (loginLink) {
                loginLink.style.display = 'none';
            }
            if (userProfileDiv) {
                userProfileDiv.style.display = 'flex';
            }
        } else {
            if (loginLink) {
                loginLink.style.display = 'block';
            }
            if (userProfileDiv) {
                userProfileDiv.style.display = 'none';
            }
        }
    }

    function updateButtonAccess() {
        if (isAuthenticated) {
            if (toPanelLink) {
                toPanelLink.style.display = 'inline-block';
            }
            if (getStartedLink) {
                getStartedLink.style.display = 'inline-block';
            }
        } else {
            if (toPanelLink) {
                toPanelLink.style.display = 'none';
            }
            if (getStartedLink) {
                getStartedLink.style.display = 'none';
            }
        }
    }

    updateHeaderStatus();
    updateButtonAccess();
    
    // Update login link to use Replit Auth
    if (loginLink) {
        loginLink.href = '/api/login';
    }
});