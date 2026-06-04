const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let complaints = [];

app.get("/", (req, res) => {
    res.send("Server is working");
});

app.post("/api/complaints", (req, res) => {
    console.log("DATA RECEIVED:", req.body);

    complaints.push(req.body);

    res.json({ message: "Saved successfully" });
});

app.get("/api/complaints", (req, res) => {
    res.json(complaints);
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});