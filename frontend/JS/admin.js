const API_URL = https://ums-2te7.onrender.com; 
// ⚠️ Replace with Render backend URL

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// If not logged in or not admin → redirect
if (!token || role !== "admin") {
  window.location.href = "index.html";
}

// ========== Fetch All Users ==========
async function fetchUsers() {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await res.json();

    if (res.ok) {
      const list = document.getElementById("usersList");
      list.innerHTML = "";

      users.forEach((u) => {
        list.innerHTML += `
          <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>
              <select onchange="updateRole('${u._id}', this.value)">
                <option value="User" ${u.role === "User" ? "selected" : ""}>User</option>
                <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
              </select>
            </td>
            <td>
              <button onclick="deleteUser('${u._id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    } else {
      alert(users.message || "Failed to load users");
    }
  } catch (err) {
    console.error(err);
    alert("Error loading users");
  }
}

// ========== Add New User ==========
const addUserForm = document.getElementById("addUserForm");
if (addUserForm) {
  addUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newRole").value;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User added!");
        fetchUsers();
        addUserForm.reset();
      } else {
        alert(data.message || "Failed to add user");
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// ========== Update User Role ==========
async function updateRole(userId, role) {
  try {
    const res = await fetch(https://ums-2te7.onrender.com, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Role updated!");
      fetchUsers();
    } else {
      alert(data.message || "Failed to update role");
    }
  } catch (err) {
    console.error(err);
  }
}

// ========== Delete User ==========
async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(https://ums-2te7.onrender.com, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      alert("User deleted!");
      fetchUsers();
    } else {
      alert(data.message || "Failed to delete user");
    }
  } catch (err) {
    console.error(err);
  }
}

// ========== Search / Filter ==========
function filterUsers() {
  let search = document.getElementById("search").value.toLowerCase();
  let rows = document.querySelectorAll("#usersList tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(search) ? "" : "none";
  });
}

// ========== Logout ==========
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

// Load users on page load
fetchUsers();


