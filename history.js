window.onload = function () {
    const email = localStorage.getItem("studentEmail");

    if (!email) {
        window.location.href = "student-login.html";
        return;
    }

    document.getElementById("studentEmailDisplay").innerText = email;
    loadHistory(email);
};

async function loadHistory(email) {
    const table = document.getElementById("historyTable");
    table.innerHTML = "<tr><td colspan='4' class='text-center'>Loading...</td></tr>";

    try {
        const response = await fetch("http://localhost:5000/api/complaints");
        if (!response.ok) throw new Error("Failed to fetch");
        
        const allComplaints = await response.json();
        
        // Filter complaints belonging to this student
        const studentComplaints = allComplaints.filter(c => c.email === email);

        table.innerHTML = "";

        if (studentComplaints.length === 0) {
            table.innerHTML = `<tr><td colspan='4' class='text-center'>No complaints found for this email.</td></tr>`;
            return;
        }

        studentComplaints.forEach(c => {
            let statusBadge = c.status === "Pending" 
                ? `<span class="badge bg-warning text-dark">Pending</span>` 
                : `<span class="badge bg-success">Resolved</span>`;

            table.innerHTML += `
            <tr>
                <td>${c.department}</td>
                <td>${c.category}</td>
                <td>${c.complaint}</td>
                <td>${statusBadge}</td>
            </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading history:", error);
        table.innerHTML = "<tr><td colspan='4' class='text-center text-danger'>Failed to load history from server.</td></tr>";
    }
}