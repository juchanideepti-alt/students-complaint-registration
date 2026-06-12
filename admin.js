let complaints = [];
let table = document.getElementById("complaintList");

async function loadComplaints() {
    try {
        const response = await fetch("http://localhost:5000/api/complaints");
        if (!response.ok) throw new Error("Failed to fetch");
        complaints = await response.json();
        
        renderTable();
    } catch (error) {
        console.error("Error loading complaints:", error);
        table.innerHTML = "<tr><td colspan='8' class='text-center text-danger'>Failed to load complaints from server.</td></tr>";
    }
}

function renderTable() {
    table.innerHTML = "";
    let pending = 0;
    let resolved = 0;

    complaints.forEach((c) => {
        if (c.status === "Pending") pending++;
        if (c.status === "Resolved") resolved++;

        table.innerHTML += `
        <tr>
            <td>${c.id}</td>
            <td>${c.name || 'Student'}</td>
            <td>${c.department}</td>
            <td>${c.category}</td>
            <td>${c.priority || 'Normal'}</td>
            <td>${c.complaint}</td>
            <td>
                <select
                    class="form-select bg-dark text-white border-secondary"
                    onchange="updateStatus('${c.id}', this.value)">
                    <option value="Pending" ${c.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Resolved" ${c.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </td>
            <td>
                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteComplaint('${c.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("totalComplaints").innerText = complaints.length;
    document.getElementById("pendingComplaints").innerText = pending;
    document.getElementById("resolvedComplaints").innerText = resolved;
}

async function updateStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadComplaints();
        } else {
            alert("Failed to update status");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to connect to the server.");
    }
}

async function deleteComplaint(id) {
    if (confirm("Delete this complaint?")) {
        try {
            const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
                method: "DELETE"
            });
            
            if (response.ok) {
                loadComplaints();
            } else {
                alert("Failed to delete complaint");
            }
        } catch (error) {
            console.error("Error deleting complaint:", error);
            alert("Failed to connect to the server.");
        }
    }
}

function searchComplaints() {
    let filter = document.getElementById("searchInput").value.toUpperCase();
    let rows = document.querySelectorAll("#complaintList tr");

    rows.forEach(row => {
        let text = row.innerText.toUpperCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

// Initial load
loadComplaints();