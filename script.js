function submitComplaint() {

let name = document.getElementById("name").value;
let department = document.getElementById("department").value;
let category = document.getElementById("category").value;
let priority = document.getElementById("priority").value;
let complaint = document.getElementById("complaint").value;

if (
    name === "" ||
    department === "" ||
    category === "" ||
    priority === "" ||
    complaint === ""
) {
    alert("Please fill all fields");
    return;
}

let complaints =
    JSON.parse(localStorage.getItem("complaints")) || [];

let newComplaint = {
    id: "CMP" + Date.now(),
    name: name,
    department: department,
    category: category,
    priority: priority,
    complaint: complaint,
    status: "Pending"
};

complaints.push(newComplaint);

localStorage.setItem(
    "complaints",
    JSON.stringify(complaints)
);

alert("Complaint Submitted Successfully!");

document.querySelector("form").reset();

}