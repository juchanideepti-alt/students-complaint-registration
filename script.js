window.onload = function () {
    const emailField = document.getElementById("studentEmail");

    if (emailField) {
        emailField.value = localStorage.getItem("studentEmail") || "";
    }
};
function submitComplaint(event) {
    event.preventDefault();

    const email = localStorage.getItem("studentEmail");
    const department = document.getElementById("department").value.trim();
    const category = document.getElementById("category").value.trim();
    const complaint = document.getElementById("complaint").value.trim();

    if (!email || !department || !category || !complaint) {
        alert("Please fill all fields");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    const newComplaint = {
        id: Date.now(),
        email: localStorage.getItem("studentEmail"),
        department,
        category,
        complaint,
        status: "Pending"
    };

    complaints.push(newComplaint);

    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint submitted successfully!");

    document.getElementById("department").value = "";
    document.getElementById("category").value = "";
    document.getElementById("complaint").value = "";
}