// Load user profile from Replit Auth
async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/user', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            
            // Update UI with user data
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            const userAvatar = document.getElementById('user-avatar');
            
            if (userName) {
                const fullName = [user.firstName, user.lastName]
                    .filter(Boolean)
                    .join(' ') || 'User';
                userName.textContent = fullName;
            }
            
            if (userEmail) {
                userEmail.textContent = user.email || 'No email';
            }
            
            if (userAvatar && user.profileImageUrl) {
                userAvatar.src = user.profileImageUrl;
            }
        } else {
            // Not authenticated, redirect to login
            window.location.href = '/api/login';
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
        window.location.href = '/api/login';
    }
}

document.addEventListener('DOMContentLoaded', loadUserProfile);
