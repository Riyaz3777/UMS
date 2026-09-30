/* ==========================================================================
   Profile JS - User Profile View, Edit & Change Password
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');

  if (!getToken()) {
    window.location.href = '/login';
    return;
  }

  // Load User Profile Data
  async function loadProfile() {
    try {
      const data = await apiFetch('/auth/me');
      const user = data.user;
      setUser(user);

      // Populate elements
      if (document.getElementById('profile-name')) {
        document.getElementById('profile-name').innerText = user.fullName;
      }
      if (document.getElementById('profile-email-badge')) {
        document.getElementById('profile-email-badge').innerText = user.email;
      }
      if (document.getElementById('profile-role-badge')) {
        document.getElementById('profile-role-badge').innerText = user.role;
        document.getElementById('profile-role-badge').className = `badge badge-${user.role.toLowerCase()}`;
      }
      if (document.getElementById('profile-status-badge')) {
        document.getElementById('profile-status-badge').innerText = user.status;
        document.getElementById('profile-status-badge').className = `badge badge-${user.status.toLowerCase()}`;
      }

      // Populate Inputs
      if (document.getElementById('fullName')) document.getElementById('fullName').value = user.fullName || '';
      if (document.getElementById('email')) document.getElementById('email').value = user.email || '';
      if (document.getElementById('phone')) document.getElementById('phone').value = user.phone || '';
      if (document.getElementById('bio')) document.getElementById('bio').value = user.bio || '';

      const avatarInitials = document.getElementById('avatar-big');
      if (avatarInitials) {
        avatarInitials.innerText = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U';
      }
    } catch (err) {
      showToast('Failed to load profile details.', 'error');
    }
  }

  await loadProfile();

  // Profile Update Form Handler
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const bio = document.getElementById('bio').value.trim();
      const submitBtn = document.getElementById('update-profile-btn');

      if (!fullName) {
        showToast('Full name cannot be empty.', 'error');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Saving...';

        const data = await apiFetch('/users/profile', {
          method: 'PUT',
          body: JSON.stringify({ fullName, phone, bio })
        });

        setUser(data.user);
        setupNavbar();
        showToast(data.message || 'Profile updated successfully!', 'success');
        await loadProfile();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Save Changes';
      }
    });
  }

  // Change Password Form Handler
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmNewPassword = document.getElementById('confirmNewPassword').value;
      const submitBtn = document.getElementById('change-pwd-btn');

      if (!currentPassword || !newPassword) {
        showToast('Please provide both current and new passwords.', 'error');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        showToast('New passwords do not match.', 'error');
        return;
      }

      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters long.', 'error');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Updating...';

        const data = await apiFetch('/users/change-password', {
          method: 'PUT',
          body: JSON.stringify({ currentPassword, newPassword })
        });

        showToast(data.message || 'Password changed successfully!', 'success');
        passwordForm.reset();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Update Password';
      }
    });
  }
});
