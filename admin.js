let complaints =
JSON.parse(localStorage.getItem("complaints")) || [];

let table =
document.getElementById("complaintList");

function loadComplaints() {

table.innerHTML = "";

let pending = 0;
let resolved = 0;

complaints.forEach((c, index) => {

    if (c.status === "Pending") {
        pending++;
    }

    if (c.status === "Resolved") {
        resolved++;
    }

    table.innerHTML += `
    <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.department}</td>
        <td>${c.category}</td>
        <td>${c.priority}</td>
        <td>${c.complaint}</td>

        <td>
            <select
                class="form-select"
                onchange="updateStatus(${index}, this.value)">
                <option value="Pending"
                ${c.status === "Pending" ? "selected" : ""}>
                Pending
                </option>

                <option value="Resolved"
                ${c.status === "Resolved" ? "selected" : ""}>
                Resolved
                </option>
            </select>
        </td>

        <td>
            <button
                class="btn btn-danger btn-sm"
                onclick="deleteComplaint(${index})">
                Delete
            </button>
        </td>
    </tr>
    `;
});

document.getElementById("totalComplaints").innerText =
    complaints.length;

document.getElementById("pendingComplaints").innerText =
    pending;

document.getElementById("resolvedComplaints").innerText =
    resolved;

}

function updateStatus(index, status) {

complaints[index].status = status;

localStorage.setItem(
    "complaints",
    JSON.stringify(complaints)
);

loadComplaints();

}

function deleteComplaint(index) {

if (confirm("Delete this complaint?")) {

    complaints.splice(index, 1);

    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );

    loadComplaints();
}

}

function searchComplaints() {

let filter =
    document.getElementById("searchInput")
    .value
    .toUpperCase();

let rows =
    document.querySelectorAll("#complaintList tr");

rows.forEach(row => {

    let text =
        row.innerText.toUpperCase();

    row.style.display =
        text.includes(filter)
        ? ""
        : "none";
});

}

loadComplaints();