const list = document.getElementById("complaintList");

function loadComplaints() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    list.innerHTML = "";

    complaints.forEach((c) => {
        const div = document.createElement("div");
        div.classList.add("complaint-item");

        div.innerHTML = `
            <strong>${c.name} (${c.usn})</strong>
            <p>${c.complaint}</p>
            <p>Status: ${c.status}</p>
            <button onclick="deleteComplaint(${c.id})">Delete</button>
            <button onclick="markResolved(${c.id})">Mark Resolved</button>
        `;

        list.appendChild(div);
    });
}

function deleteComplaint(id) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints = complaints.filter(c => c.id !== id);
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

function markResolved(id) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach(c => {
        if (c.id === id) {
            c.status = "Resolved";
        }
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
}

loadComplaints();