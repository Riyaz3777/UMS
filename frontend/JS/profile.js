const API_URL = https://ums-2te7.onrender.com; 
// ⚠️ Replace with Render backend URL after deployment

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html"; // not logged in → redirect to login
}

// ========== Fetch Profile ==========
async function fetchProfile() {
  try {
    const res = await fetch(https://ums-2te7.onrender.com, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("profileDetails").innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Role:</strong> ${data.role}</p>
      `;

      // pre-fill form
      document.getElementById("name").value = data.name;
      document.getElementById("email").value = data.email;
    } else {
      alert(data.message || "Failed to load profile");
    }
  } catch (error) {
    console.error(error);
    alert("Error fetching profile");
  }
}

// ========== Update Profile ==========
const updateForm = document.getElementById("updateForm");
if (updateForm) {
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      const res = await fetch(https://ums-2te7.onrender.com, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated!");
        fetchProfile();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
    }
  });
}

// ========== Change Password ==========
const passwordForm = document.getElementById("passwordForm");
if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;

    try {
      const res = await fetch(https://ums-2te7.onrender.com, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
      } else {
        alert(data.message || "Password change failed");
      }
    } catch (error) {
      console.error(error);
    }
  });
}

// ========== Logout ==========
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

// Load profile on page load
fetchProfile();

