/* ==========================================================================
   API Helper Functions & Toast Notification Engine
   ========================================================================== */

const API_BASE_URL = '/api';

// Toast Notification Manager
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  if (type === 'warning') icon = '🔔';

  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Token Storage Helpers
function getToken() {
  return localStorage.getItem('ums_token');
}

function setToken(token) {
  localStorage.setItem('ums_token', token);
}

function getUser() {
  const user = localStorage.getItem('ums_user');
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  localStorage.setItem('ums_user', JSON.stringify(user));
}

function removeAuth() {
  localStorage.removeItem('ums_token');
  localStorage.removeItem('ums_user');
}

// Generic Authenticated Fetch Request Wrapper
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // If unauthorized/token expired, redirect to login unless on public auth routes
      if (response.status === 401 && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
        removeAuth();
        showToast('Session expired. Please log in again.', 'warning');
        setTimeout(() => window.location.href = '/login', 1500);
      }
      throw new Error(data.message || 'An error occurred during request execution.');
    }

    return data;
  } catch (err) {
    throw err;
  }
}

// Render dynamic navbar user pill & role badges
function setupNavbar() {
  const user = getUser();
  const userPillContainer = document.getElementById('nav-user-pill');
  const adminNavLink = document.getElementById('nav-admin-link');

  if (user && userPillContainer) {
    const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U';
    userPillContainer.innerHTML = `
      <a href="/profile" class="user-pill">
        <div class="avatar-circle">${initials}</div>
        <div style="font-size: 0.85rem;">
          <div style="font-weight: 700; color: var(--text-main);">${user.fullName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${user.role}</div>
        </div>
      </a>
      <button onclick="logoutUser()" class="btn btn-secondary btn-sm" style="margin-left: 0.5rem;" title="Sign Out">Logout</button>
    `;
  }

  if (adminNavLink) {
    if (user && user.role === 'Admin') {
      adminNavLink.style.display = 'flex';
    } else {
      adminNavLink.style.display = 'none';
    }
  }
}

function logoutUser() {
  removeAuth();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => window.location.href = '/login', 1000);
}

document.addEventListener('DOMContentLoaded', setupNavbar);
