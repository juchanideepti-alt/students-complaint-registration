const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper to read data
function readData() {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
}

// Helper to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
    res.send("Server is working");
});

// ==========================================
// EMAIL CONFIGURATION
// ==========================================
// TODO: Replace these with your actual email credentials
const ADMIN_EMAIL = "admin@yourcollege.edu"; // The admin who receives the notification
const SENDER_EMAIL = "yourcollege@gmail.com"; // The email that sends the notification
const SENDER_PASSWORD = "your-app-password"; // Google App Password (16 characters)

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
    }
});

function sendAdminNotification(complaint) {
    const mailOptions = {
        from: SENDER_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🚨 New Student Complaint: #${complaint.id}`,
        html: `
            <h2>New Complaint Registered</h2>
            <p><strong>Ticket ID:</strong> #${complaint.id}</p>
            <p><strong>Student:</strong> ${complaint.name} (${complaint.email})</p>
            <p><strong>Department:</strong> ${complaint.department}</p>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Priority:</strong> ${complaint.priority || "Normal"}</p>
            <hr>
            <h3>Description:</h3>
            <p><i>"${complaint.complaint}"</i></p>
            <hr>
            <p>Please log in to the <a href="http://localhost:5000/admin.html">Admin Dashboard</a> to review and resolve this issue.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email notification:", error);
        } else {
            console.log("Email notification sent to admin:", info.response);
        }
    });
}
// ==========================================

// CREATE a complaint
app.post("/api/complaints", (req, res) => {
    console.log("DATA RECEIVED:", req.body);
    const complaints = readData();
    
    const newComplaint = {
        ...req.body,
        id: Date.now().toString(), // Generate unique string ID
        status: "Pending" // Default status
    };
    
    complaints.push(newComplaint);
    writeData(complaints);

    // Asynchronously send the email to admin so it doesn't block the response
    sendAdminNotification(newComplaint);

    res.json({ message: "Saved successfully", complaint: newComplaint });
});

// READ all complaints
app.get("/api/complaints", (req, res) => {
    const complaints = readData();
    res.json(complaints);
});

// UPDATE a complaint status
app.put("/api/complaints/:id", (req, res) => {
    const complaints = readData();
    const index = complaints.findIndex(c => c.id === req.params.id || c.id === parseInt(req.params.id));
    
    if (index !== -1) {
        complaints[index].status = req.body.status;
        writeData(complaints);
        res.json({ message: "Updated successfully", complaint: complaints[index] });
    } else {
        res.status(404).json({ message: "Complaint not found" });
    }
});

// DELETE a complaint
app.delete("/api/complaints/:id", (req, res) => {
    let complaints = readData();
    const initialLength = complaints.length;
    
    complaints = complaints.filter(c => c.id !== req.params.id && c.id !== parseInt(req.params.id));
    
    if (complaints.length < initialLength) {
        writeData(complaints);
        res.json({ message: "Deleted successfully" });
    } else {
        res.status(404).json({ message: "Complaint not found" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});