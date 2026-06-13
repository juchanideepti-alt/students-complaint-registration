let complaints = [];
let table = document.getElementById("complaintList");
let categoryChartInstance = null;

async function loadComplaints() {
    try {
        const response = await fetch("http://localhost:5000/api/complaints");
        if (!response.ok) throw new Error("Failed to fetch");
        complaints = await response.json();
        
        renderTable();
        renderChart();
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

function renderChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Count categories
    const categoryCounts = {};
    complaints.forEach(c => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['No Data'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: [
                    '#8b5cf6',
                    '#3b82f6',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b',
                    '#6366f1'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f8fafc' }
                }
            }
        }
    });
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
            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `Complaint marked as ${status}`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: 'var(--card-bg)',
                color: 'var(--text-primary)'
            });
            loadComplaints();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update status',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)'
            });
        }
    } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
            icon: 'error',
            title: 'Connection Failed',
            text: 'Failed to connect to the server.',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)'
        });
    }
}

async function deleteComplaint(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Yes, delete it!',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
                    method: "DELETE"
                });
                
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The complaint has been deleted.',
                        background: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        confirmButtonColor: '#8b5cf6'
                    });
                    loadComplaints();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete complaint',
                        background: 'var(--card-bg)',
                        color: 'var(--text-primary)'
                    });
                }
            } catch (error) {
                console.error("Error deleting complaint:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Failed',
                    text: 'Failed to connect to the server.',
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)'
                });
            }
        }
    });
}

function searchComplaints() {
    let filter = document.getElementById("searchInput").value.toUpperCase();
    let rows = document.querySelectorAll("#complaintList tr");

    rows.forEach(row => {
        let text = row.innerText.toUpperCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

function exportToCSV() {
    if (complaints.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Empty',
            text: 'There are no complaints to export.',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)'
        });
        return;
    }

    // Prepare CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Department,Category,Priority,Complaint,Status\n";

    // Add rows
    complaints.forEach(c => {
        let row = [
            c.id,
            c.name || 'Student',
            c.department,
            c.category,
            c.priority || 'Normal',
            `"${c.complaint.replace(/"/g, '""')}"`, // escape quotes for CSV
            c.status
        ];
        csvContent += row.join(",") + "\n";
    });

    // Create a download link and trigger click
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_complaints_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
        icon: 'success',
        title: 'Exported!',
        text: 'The CSV report has been downloaded.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)'
    });
}

// Initial load
loadComplaints();