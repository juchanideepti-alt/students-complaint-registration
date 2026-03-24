const form = document.getElementById("complaintForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const usn = document.getElementById("usn").value;
    const complaint = document.getElementById("complaint").value;

    const newComplaint = {
        id: Date.now(),
        name,
        usn,
        complaint,
        status: "Pending"
    };

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push(newComplaint);

    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted Successfully!");
    form.reset();
});