window.onload = function () {
    const emailField = document.getElementById("studentEmail");

    if (emailField) {
        emailField.value = localStorage.getItem("studentEmail") || "";
    }
};

async function submitComplaint(event) {
    event.preventDefault();

    const email = localStorage.getItem("studentEmail");
    const department = document.getElementById("department").value.trim();
    const category = document.getElementById("category").value.trim();
    const complaint = document.getElementById("complaint").value.trim();

    if (!email || !department || !category || !complaint) {
        alert("Please fill all fields");
        return;
    }

    const newComplaint = {
        name: email.split('@')[0], // Derive a name from email for the admin panel
        email,
        department,
        category,
        priority: "Normal", // Default priority
        complaint
    };

    try {
        const response = await fetch("http://localhost:5000/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newComplaint)
        });

        if (response.ok) {
            alert("Complaint submitted successfully!");
            document.getElementById("department").value = "";
            document.getElementById("category").value = "";
            document.getElementById("complaint").value = "";
        } else {
            alert("Error submitting complaint. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server. Is the backend running?");
    }
}