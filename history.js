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
    const container = document.getElementById("historyContainer");
    container.innerHTML = "<div class='text-center text-secondary py-4'>Loading your history...</div>";

    try {
        const response = await fetch("http://localhost:5000/api/complaints");
        if (!response.ok) throw new Error("Failed to fetch");
        
        const allComplaints = await response.json();
        
        // Filter complaints belonging to this student
        const studentComplaints = allComplaints.filter(c => c.email === email);

        container.innerHTML = "";

        if (studentComplaints.length === 0) {
            container.innerHTML = `<div class='text-center text-secondary py-5'>You haven't submitted any complaints yet.</div>`;
            return;
        }

        studentComplaints.forEach(c => {
            const dateStr = new Date(parseInt(c.id)).toLocaleString();
            
            // Timeline progress logic
            const isResolved = c.status === "Resolved";
            
            const timelineHTML = `
                <div class="position-relative mt-4 mb-2">
                    <div class="progress" style="height: 6px; background-color: rgba(255,255,255,0.1);">
                        <div class="progress-bar ${isResolved ? 'bg-success' : 'bg-primary'}" role="progressbar" style="width: ${isResolved ? '100%' : '50%'};"></div>
                    </div>
                    <div class="d-flex justify-content-between position-absolute w-100" style="top: -10px;">
                        <span class="badge rounded-pill bg-primary" style="width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center;">1</span>
                        <span class="badge rounded-pill bg-primary" style="width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center;">2</span>
                        <span class="badge rounded-pill ${isResolved ? 'bg-success' : 'bg-secondary'}" style="width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center;">3</span>
                    </div>
                    <div class="d-flex justify-content-between mt-2" style="font-size: 0.8rem; color: var(--text-secondary);">
                        <span>Submitted</span>
                        <span>Under Review</span>
                        <span>Resolved</span>
                    </div>
                </div>
            `;

            container.innerHTML += `
            <div class="p-4 rounded shadow-sm" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0 text-gradient">Ticket #${c.id}</h5>
                    <span class="text-secondary small">${dateStr}</span>
                </div>
                
                <div class="row mb-3 text-secondary" style="font-size: 0.9rem;">
                    <div class="col-md-4"><strong>Department:</strong> ${c.department}</div>
                    <div class="col-md-4"><strong>Category:</strong> ${c.category}</div>
                    <div class="col-md-4"><strong>Priority:</strong> ${c.priority || 'Normal'}</div>
                </div>
                
                <p class="mb-4" style="line-height: 1.6;">${c.complaint}</p>
                
                <div class="mt-auto">
                    ${timelineHTML}
                </div>
            </div>
            `;
        });
    } catch (error) {
        console.error("Error loading history:", error);
        container.innerHTML = "<div class='text-center text-danger py-4'>Failed to load history from server.</div>";
    }
}