function submitComplaint(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value.trim();
    const category = document.getElementById("category").value.trim();
    const priority = document.getElementById("priority").value.trim();
    const complaint = document.getElementById("complaint").value.trim();

    // validation
    if (!name || !department || !category || !priority || !complaint) {
        alert("Please fill all fields");
        return;
    }

    const data = {
        name,
        department,
        category,
        priority,
        complaint
    };

    fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        alert(result.message);
        document.querySelector("form").reset();
    })
    .catch(error => {
        console.log("ERROR:", error);
        alert("Error submitting complaint");
    });
}