const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

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