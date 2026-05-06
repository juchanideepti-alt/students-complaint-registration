// admin.js (Admin Side)
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

let table = document.getElementById("complaintList");

function loadComplaints() {
    table.innerHTML = "";

    complaints.forEach(c => {
        let row = `<tr>
            <td>${c.name}</td>
            <td>${c.department}</td>
            <td>${c.complaint}</td>
            <td>${c.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="resolve(${c.id})">Resolve</button>
            </td>
        </tr>`;

        table.innerHTML += row;
    });
}

function resolve(id) {
    complaints = complaints.map(c => {
        if (c.id === id) {
            c.status = "Resolved";
        }
        return c;
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

loadComplaints();