const profileDiv = document.getElementById("profile");
const form = document.getElementById("updateForm");
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

// Fetch profile
async function loadProfile() {
  const res = await fetch("http://localhost:5000/api/users/me", {
    headers: { Authorization: "Bearer " + token }
  });
  const user = await res.json();
  profileDiv.innerHTML = `<p><b>Name:</b> ${user.name}<br><b>Email:</b> ${user.email}</p>`;
}
loadProfile();

// Update name
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const res = await fetch("http://localhost:5000/api/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  alert("Updated!");
  loadProfile();
});

// Logout
document.getElementById("logout").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};
