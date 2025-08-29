const API_URL = "https://ums-2te7.onrender.com/api/auth"; // Render backend

// ---------------- REGISTER ----------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  });
}

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role && data.role.toLowerCase() === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "profile.html";
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  });
}

// ---------------- PROFILE ----------------
if (document.getElementById("name")) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) window.location.href = "login.html";
  document.getElementById("role").innerText = role;

  fetch(`${API_URL}/profile`, {
    headers: { "Authorization": `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    })
    .then((data) => {
      document.getElementById("name").innerText = data.name;
      document.getElementById("email").innerText = data.email;
    })
    .catch((err) => {
  console.error("Profile fetch error:", err);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  alert("Session expired. Please login again.");
  window.location.href = "login.html";
});

}

// ---------------- ADMIN DASHBOARD ----------------
if (document.getElementById("usersTable")) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login.html";

  const usersTable = document.getElementById("usersTable");

  const fetchUsers = async () => {
  try {
    const res = await fetch("https://ums-2te7.onrender.com/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Read raw text first
    const text = await res.text();

    let users;
    try {
      users = JSON.parse(text);
    } catch (err) {
      console.error("Backend did not return JSON. Response was:", text);
      alert("Failed to fetch users: backend returned invalid data.");
      return;
    }

    usersTable.innerHTML = "";
    users.forEach((user) => {
      usersTable.innerHTML += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="editUser('${user._id}')">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("Fetch users error:", err);
    alert("Failed to fetch users");
  }
};

  fetchUsers();

  window.editUser = async (id) => {
    const name = prompt("Enter new name:");
    const email = prompt("Enter new email:");
    const role = prompt("Enter new role:");
    try {
      await fetch(`https://ums-2te7.onrender.com/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, role }),
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  window.deleteUser = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`https://ums-2te7.onrender.com/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
}

// ----------------
// ---------------- LOGOUT ----------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  });
}







