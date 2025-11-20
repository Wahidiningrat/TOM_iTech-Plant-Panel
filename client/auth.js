// Authentication utility for Replit Auth
export async function checkAuth() {
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

export function login() {
  window.location.href = '/api/login';
}

export function logout() {
  window.location.href = '/api/logout';
}
