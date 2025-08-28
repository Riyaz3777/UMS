// --------------------- API URLs ---------------------
const API_AUTH = "https://ums-2te7.onrender.com/api/auth";
const API_USERS = "https://ums-2te7.onrender.com/api/users";

// --------------------- REGISTER ---------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_AUTH}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  });
}

// --------------------- LOGIN ---------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role === "Admin") window.location.href = "admin.html";
        else window.location.href = "profile.html";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  });
}

// --------------------- LOGOUT ---------------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "index.html";
  });
}

// --------------------- PAGE PROTECTION ---------------------
const token = localStorage.getItem("token");
if (token) {
  const role = localStorage.getItem("role");

  // Profile page
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  if (userName && userEmail) {
    fetch(`${API_USERS}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        userName.textContent = data.name;
        userEmail.textContent = data.email;
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }

  // Admin page
  const usersTableBody = document.querySelector("#usersTable tbody");
  if (usersTableBody && role === "Admin") {
    fetch(`${API_USERS}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((users) => {
        usersTableBody.innerHTML = "";
        users.forEach((user) => {
          const row = `<tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
          </tr>`;
          usersTableBody.innerHTML += row;
        });
      })
      .catch((err) => console.error("Admin fetch error:", err));
  }
} else {
  if (
    window.location.pathname.includes("profile.html") ||
    window.location.pathname.includes("admin.html")
  ) {
    window.location.href = "index.html";
  }
}
