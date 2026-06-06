document.addEventListener("DOMContentLoaded", () => {

    const studentEmail =
        localStorage.getItem("studentEmail");

    document.getElementById(
        "studentEmailDisplay"
    ).textContent = studentEmail;

    const complaints =
        JSON.parse(
            localStorage.getItem("complaints")
        ) || [];

    const myComplaints =
        complaints.filter(
            complaint =>
                complaint.email === studentEmail
        );

    const table =
        document.getElementById("historyTable");

    if (myComplaints.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4"
                    class="text-center">
                    No complaints found
                </td>
            </tr>
        `;

        return;
    }

    myComplaints.forEach(c => {

        const statusBadge =
            c.status === "Resolved"
            ? `<span class="badge bg-success">
                    Resolved
               </span>`
            : `<span class="badge bg-warning text-dark">
                    Pending
               </span>`;

        table.innerHTML += `
            <tr>
                <td>${c.department}</td>
                <td>${c.category}</td>
                <td>${c.complaint}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

});