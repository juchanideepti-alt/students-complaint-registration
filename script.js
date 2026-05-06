// script.js (Student Side)
function submitComplaint() {
    let name = document.getElementById("name").value;
    let dept = document.getElementById("department").value;
    let complaint = document.getElementById("complaint").value;

    if (name === "" || dept === "" || complaint === "") {
        alert("All fields are required!");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    let newComplaint = {
        id: Date.now(),
        name: name,
        department: dept,
        complaint: complaint,
        status: "Pending"
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint submitted successfully!");
    document.querySelector("form").reset();
}