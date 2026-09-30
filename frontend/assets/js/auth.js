/* ==========================================================================
   Auth JS - Handles Login, Registration & Password Strength Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Login Form Submission Handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const submitBtn = document.getElementById('login-btn');

      if (!email || !password) {
        showToast('Please enter both email and password.', 'error');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Authenticating...</span>';

        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });

        setToken(data.token);
        setUser(data.user);

        showToast(data.message || 'Login successful!', 'success');

        setTimeout(() => {
          if (data.user.role === 'Admin') {
            window.location.href = '/admin-dashboard';
          } else {
            window.location.href = '/profile';
          }
        }, 1000);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Sign In';
      }
    });
  }

  // Register Form Submission Handler
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('strength-bar');

    if (passwordInput && strengthBar) {
      passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        if (val.length === 0) {
          strengthBar.className = 'strength-bar';
        } else if (val.length < 6) {
          strengthBar.className = 'strength-bar weak';
        } else if (val.length >= 6 && /[A-Z]/.test(val) && /[0-9]/.test(val)) {
          strengthBar.className = 'strength-bar strong';
        } else {
          strengthBar.className = 'strength-bar medium';
        }
      });
    }

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const phone = document.getElementById('phone')?.value.trim() || '';
      const role = document.getElementById('role')?.value || 'User';
      const submitBtn = document.getElementById('register-btn');

      if (!fullName || !email || !password) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Creating Account...</span>';

        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, password, phone, role })
        });

        setToken(data.token);
        setUser(data.user);

        showToast('Account created successfully!', 'success');

        setTimeout(() => {
          if (data.user.role === 'Admin') {
            window.location.href = '/admin-dashboard';
          } else {
            window.location.href = '/profile';
          }
        }, 1200);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Create Account';
      }
    });
  }
});
