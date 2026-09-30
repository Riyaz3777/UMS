/* ==========================================================================
   Admin Dashboard JS - Full User CRUD, Analytics Metrics, Live Search & Filter
   ========================================================================== */

let currentPage = 1;
let currentSearch = '';
let currentRole = 'All';
let currentStatus = 'All';
let selectedUserId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = getUser();
  if (!getToken() || !user || user.role !== 'Admin') {
    showToast('Admin privilege required to view dashboard.', 'error');
    setTimeout(() => window.location.href = '/profile.html', 1500);
    return;
  }

  // Initialize
  await loadStats();
  await loadUsers();

  // Search input handler with debounce
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        currentPage = 1;
        loadUsers();
      }, 350);
    });
  }

  // Filter selects
  const roleSelect = document.getElementById('filter-role');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      currentRole = e.target.value;
      currentPage = 1;
      loadUsers();
    });
  }

  const statusSelect = document.getElementById('filter-status');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentStatus = e.target.value;
      currentPage = 1;
      loadUsers();
    });
  }

  // Add User Modal Form
  const addUserForm = document.getElementById('add-user-form');
  if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('add-fullName').value.trim();
      const email = document.getElementById('add-email').value.trim();
      const password = document.getElementById('add-password').value;
      const role = document.getElementById('add-role').value;
      const status = document.getElementById('add-status').value;
      const phone = document.getElementById('add-phone').value.trim();

      try {
        const data = await apiFetch('/admin/users', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, password, role, status, phone })
        });
        showToast(data.message || 'User created successfully!', 'success');
        closeModal('add-user-modal');
        addUserForm.reset();
        await loadStats();
        await loadUsers();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Edit User Modal Form
  const editUserForm = document.getElementById('edit-user-form');
  if (editUserForm) {
    editUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!selectedUserId) return;

      const fullName = document.getElementById('edit-fullName').value.trim();
      const email = document.getElementById('edit-email').value.trim();
      const role = document.getElementById('edit-role').value;
      const status = document.getElementById('edit-status').value;
      const phone = document.getElementById('edit-phone').value.trim();
      const password = document.getElementById('edit-password').value;

      const payload = { fullName, email, role, status, phone };
      if (password) payload.password = password;

      try {
        const data = await apiFetch(`/admin/users/${selectedUserId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast(data.message || 'User updated successfully!', 'success');
        closeModal('edit-user-modal');
        await loadStats();
        await loadUsers();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
});

// Load Dashboard Metrics
async function loadStats() {
  try {
    const data = await apiFetch('/admin/stats');
    if (data.success && data.stats) {
      document.getElementById('stat-total-users').innerText = data.stats.totalUsers || 0;
      document.getElementById('stat-active-users').innerText = data.stats.activeUsers || 0;
      document.getElementById('stat-admins').innerText = data.stats.adminCount || 0;
      document.getElementById('stat-new-users').innerText = data.stats.newThisWeek || 0;
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

// Load Users Data Table
async function loadUsers() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem;">Loading users data...</td></tr>`;

  try {
    const query = `?page=${currentPage}&limit=8&search=${encodeURIComponent(currentSearch)}&role=${currentRole}&status=${currentStatus}`;
    const data = await apiFetch(`/admin/users${query}`);

    if (!data.users || data.users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No users found matching query.</td></tr>`;
      renderPagination(1, 1);
      return;
    }

    const currentUser = getUser();

    tbody.innerHTML = data.users.map(u => {
      const isSelf = currentUser && currentUser.id === u._id;
      const formattedDate = new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <div class="avatar-circle" style="width:32px; height:32px; font-size:0.8rem;">${u.fullName ? u.fullName.substring(0, 2).toUpperCase() : 'U'}</div>
              <div>
                <div style="font-weight:600;">${u.fullName} ${isSelf ? '<span style="font-size:0.7rem; color:var(--accent-pink);">(You)</span>' : ''}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">${u.phone || 'No phone'}</div>
              </div>
            </div>
          </td>
          <td>${u.email}</td>
          <td><span class="badge badge-${u.role.toLowerCase()}">${u.role}</span></td>
          <td><span class="badge badge-${u.status.toLowerCase()}">${u.status}</span></td>
          <td style="font-size:0.85rem; color:var(--text-muted);">${formattedDate}</td>
          <td>
            <div class="table-actions">
              <button onclick="openEditModal('${u._id}')" class="btn btn-secondary btn-sm" title="Edit User">✏️ Edit</button>
              ${!isSelf ? `<button onclick="confirmDeleteUser('${u._id}', '${u.fullName.replace(/'/g, "\\'")}')" class="btn btn-danger btn-sm" title="Delete User">🗑️ Delete</button>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPagination(data.currentPage, data.totalPages);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #ef4444;">Error loading user list: ${err.message}</td></tr>`;
  }
}

// Render Table Pagination Controls
function renderPagination(page, totalPages) {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
      <span style="font-size:0.85rem; color:var(--text-muted);">Page ${page} of ${totalPages}</span>
      <div style="display:flex; gap:0.5rem;">
        <button onclick="changePage(${page - 1})" class="btn btn-secondary btn-sm" ${page <= 1 ? 'disabled' : ''}>← Previous</button>
        <button onclick="changePage(${page + 1})" class="btn btn-secondary btn-sm" ${page >= totalPages ? 'disabled' : ''}>Next →</button>
      </div>
    </div>
  `;
}

function changePage(newPage) {
  currentPage = newPage;
  loadUsers();
}

// Modal Helpers
function openModal(modalId) {
  document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

// Open Edit Modal with Prepopulated Values
async function openEditModal(userId) {
  selectedUserId = userId;
  try {
    const data = await apiFetch(`/admin/users/${userId}`);
    const user = data.user;

    document.getElementById('edit-fullName').value = user.fullName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-role').value = user.role;
    document.getElementById('edit-status').value = user.status;
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-password').value = '';

    openModal('edit-user-modal');
  } catch (err) {
    showToast('Failed to fetch user data for editing.', 'error');
  }
}

// Delete User Modal Trigger
function confirmDeleteUser(userId, userName) {
  selectedUserId = userId;
  document.getElementById('delete-username-target').innerText = userName;
  openModal('delete-modal');
}

async function executeUserDelete() {
  if (!selectedUserId) return;
  try {
    const data = await apiFetch(`/admin/users/${selectedUserId}`, { method: 'DELETE' });
    showToast(data.message || 'User deleted.', 'success');
    closeModal('delete-modal');
    await loadStats();
    await loadUsers();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
