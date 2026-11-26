// Seed Data
const defaultClients = [
  { id: 1, name: "Amit Sharma", phone: "+91 9876543210", nominee: "Mrs. Sharma (Wife)", medical: "No major issues" },
  { id: 2, name: "Priya Patel", phone: "+91 9876543211", nominee: "Mr. Patel (Husband)", medical: "Mild Diabetes" }
];

const defaultPolicies = [
  { id: "LIC-101", clientId: 1, type: "Endowment Plan", sumAssured: 500000, premium: 24000, year: 1, status: "Active" },
  { id: "LIC-102", clientId: 2, type: "Health Insurance", sumAssured: 300000, premium: 15000, year: 2, status: "Renewal Due" }
];

let clients = JSON.parse(localStorage.getItem("lic_clients")) || defaultClients;
let policies = JSON.parse(localStorage.getItem("lic_policies")) || defaultPolicies;

function saveData() {
  localStorage.setItem("lic_clients", JSON.stringify(clients));
  localStorage.setItem("lic_policies", JSON.stringify(policies));
  updateDashboard();
}

// Login Handling
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("login-username").value;
  const role = document.getElementById("login-role").value;
  document.getElementById("display-user").textContent = `${user} (${role})`;
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-container").style.display = "flex";
  initApp();
});

document.getElementById("logout-btn").addEventListener("click", () => {
  document.getElementById("app-container").style.display = "none";
  document.getElementById("auth-screen").style.display = "flex";
});

// Sidebar Navigation
document.querySelectorAll(".nav-links li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
    item.classList.add("active");
    const target = item.getAttribute("data-target");
    document.getElementById(target).classList.add("active");
    document.getElementById("page-title").textContent = item.textContent.trim();
    document.getElementById("sidebar").classList.remove("open");
  });
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// Render Clients
function renderClients(filterText = "") {
  const tbody = document.getElementById("clients-tbody");
  tbody.innerHTML = "";
  clients
    .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()) || c.phone.includes(filterText))
    .forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>#${c.id}</td>
          <td>${c.name}</td>
          <td>${c.phone}</td>
          <td>${c.nominee}</td>
          <td>${c.medical}</td>
          <td>
            <button class="btn-outline" onclick="deleteClient(${c.id})">Delete</button>
          </td>
        </tr>`;
    });
}

function deleteClient(id) {
  clients = clients.filter(c => c.id !== id);
  saveData();
  renderClients();
}

document.getElementById("client-search").addEventListener("input", (e) => {
  renderClients(e.target.value);
});

// Render Policies
function renderPolicies(statusFilter = "All") {
  const tbody = document.getElementById("policies-tbody");
  tbody.innerHTML = "";
  policies
    .filter(p => statusFilter === "All" || p.status === statusFilter)
    .forEach(p => {
      const client = clients.find(c => c.id === p.clientId);
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${client ? client.name : "Unknown"}</td>
          <td>${p.type}</td>
          <td>₹${p.sumAssured.toLocaleString()}</td>
          <td>₹${p.premium.toLocaleString()}</td>
          <td><strong>${p.status}</strong></td>
          <td><button class="btn-outline" onclick="deletePolicy('${p.id}')">Remove</button></td>
        </tr>`;
    });
}

function deletePolicy(id) {
  policies = policies.filter(p => p.id !== id);
  saveData();
  renderPolicies();
}

document.getElementById("policy-filter").addEventListener("change", (e) => {
  renderPolicies(e.target.value);
});

// Commission Calculator
function calculateCommission() {
  const premium = parseFloat(document.getElementById("calc-premium").value) || 0;
  const rate = parseFloat(document.getElementById("calc-year").value) || 0;
  const commission = premium * rate;
  document.getElementById("calc-output").textContent = `Commission: ₹${commission.toLocaleString()}`;
}

// Dashboard KPIs & Chart
function updateDashboard() {
  document.getElementById("kpi-clients").textContent = clients.length;
  document.getElementById("kpi-policies").textContent = policies.filter(p => p.status === "Active").length;
  const totalPrem = policies.reduce((sum, p) => sum + p.premium, 0);
  document.getElementById("kpi-premiums").textContent = `₹${totalPrem.toLocaleString()}`;
  document.getElementById("kpi-commission").textContent = `₹${(totalPrem * 0.20).toLocaleString()}`;
}

function renderChart() {
  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Endowment", "Health", "Money Back", "Child Plan", "Pension", "Term"],
      datasets: [{
        label: "Policies Sold",
        data: [12, 19, 7, 9, 5, 14],
        backgroundColor: "#1E40AF"
      }]
    }
  });
}

function initApp() {
  renderClients();
  renderPolicies();
  updateDashboard();
  renderChart();
}