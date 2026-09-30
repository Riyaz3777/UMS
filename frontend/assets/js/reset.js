/* ==========================================================================
   Reset Password JS - OTP Generation & Password Reset
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const requestOtpForm = document.getElementById('request-otp-form');
  const resetPasswordForm = document.getElementById('reset-password-form');
  const otpDisplayBox = document.getElementById('otp-display-box');

  if (requestOtpForm) {
    requestOtpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('request-email').value.trim();
      const submitBtn = document.getElementById('request-otp-btn');

      if (!email) {
        showToast('Please enter your email address.', 'error');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Generating OTP...';

        const data = await apiFetch('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });

        showToast(data.message, 'success');

        if (data.otp && otpDisplayBox) {
          otpDisplayBox.style.display = 'block';
          otpDisplayBox.innerHTML = `
            <div style="font-weight:700; color:var(--accent-pink); margin-bottom:0.3rem;">Verification OTP Code:</div>
            <div style="font-size:1.8rem; font-weight:800; letter-spacing:0.3em; color:var(--text-main);">${data.otp}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">(Valid for 15 minutes)</div>
          `;
        }

        // Auto-fill email in reset step
        if (document.getElementById('reset-email')) {
          document.getElementById('reset-email').value = email;
        }

        // Show step 2
        document.getElementById('step-1-card').style.display = 'none';
        document.getElementById('step-2-card').style.display = 'block';
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Send Verification OTP';
      }
    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reset-email').value.trim();
      const otp = document.getElementById('reset-otp').value.trim();
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-new-password').value;
      const submitBtn = document.getElementById('reset-pwd-btn');

      if (!email || !otp || !newPassword) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Resetting Password...';

        const data = await apiFetch('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ email, otp, newPassword })
        });

        showToast(data.message || 'Password reset successfully!', 'success');

        setTimeout(() => window.location.href = '/login', 1500);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Reset Password';
      }
    });
  }
});
