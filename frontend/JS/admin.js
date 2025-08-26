const token = localStorage.getItem("token");
const tbody = document.getElementById("userTable");

if (!token) window.location.href = "login.html";

async function loadUsers() {
  const res = await fetch("http://localhost:5000/api/users", {
    headers: { Authorization: "Bearer " + token }
  });
  const users = await res.json();

  tbody.innerHTML = "";
  users.forEach((u) => {
    tbody.innerHTML += `
      <tr>
        <td>${u._id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td><button onclick="deleteUser('${u._id}')">Delete</button></td>
      </tr>
    `;
  });
}

async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;
  await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  loadUsers();
}

loadUsers();

document.getElementById("logout").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};
