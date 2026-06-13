// ============================================================
// Priority Selector
// ============================================================
function setPriority(level) {
    document.getElementById('priorityValue').value = level;
    document.querySelectorAll('.priority-option').forEach(el => {
        el.classList.remove('selected-low', 'selected-normal', 'selected-high');
    });
    const map = { Low: 'selected-low', Normal: 'selected-normal', High: 'selected-high' };
    const ids = { Low: 'prio-low', Normal: 'prio-normal', High: 'prio-high' };
    const el = document.getElementById(ids[level]);
    if (el) el.classList.add(map[level]);
}

// ============================================================
// File Upload Handlers
// ============================================================
let selectedFileBase64 = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) processFile(file);
}

function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('uploadZone').classList.add('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    document.getElementById('uploadZone').classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file) processFile(file);
}

function processFile(file) {
    if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'File too large', 'Max file size is 5MB');
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        selectedFileBase64 = e.target.result;
        const preview = document.getElementById('uploadPreview');
        const isImage = file.type.startsWith('image/');
        preview.innerHTML = isImage
            ? `<img src="${selectedFileBase64}" style="max-height:80px; border-radius:8px; margin-top:8px;">`
            : `<div style="color: var(--green); font-size:0.8rem; margin-top:8px;"><i class="bi bi-check-circle me-1"></i>${file.name}</div>`;
    };
    reader.readAsDataURL(file);
}

// ============================================================
// Character Counter
// ============================================================
window.onload = function () {
    // Set student email
    const email = localStorage.getItem("studentEmail") || "";
    const emailField = document.getElementById("studentEmail");
    const emailDisplay = document.getElementById("studentEmailDisplay");
    if (emailField) emailField.value = email;
    if (emailDisplay) emailDisplay.textContent = email || "Unknown";

    // Redirect if not logged in
    if (!email && document.getElementById('complaintForm')) {
        window.location.href = 'student-login.html';
        return;
    }

    // Char counter
    const textarea = document.getElementById("complaint");
    const counter = document.getElementById("charCounter");
    if (textarea && counter) {
        textarea.addEventListener('input', function () {
            const len = this.value.length;
            counter.textContent = `${len} / 1000 characters`;
            counter.className = 'char-counter';
            if (len > 900) counter.classList.add('danger');
            else if (len > 750) counter.classList.add('warning');

            // Auto-category detection (only if none selected)
            const categorySelect = document.getElementById("category");
            if (categorySelect && categorySelect.value === "") {
                const text = this.value.toLowerCase();
                let suggested = "";
                if (text.includes("wifi") || text.includes("internet") || text.includes("computer") || text.includes("lab") || text.includes("classroom") || text.includes("projector")) suggested = "Academic";
                else if (text.includes("food") || text.includes("mess") || text.includes("canteen") || text.includes("meal")) suggested = "Canteen";
                else if (text.includes("bed") || text.includes("room") || text.includes("water") || text.includes("hostel") || text.includes("warden")) suggested = "Hostel";
                else if (text.includes("book") || text.includes("library") || text.includes("reading")) suggested = "Library";
                else if (text.includes("bus") || text.includes("transport") || text.includes("driver") || text.includes("route") || text.includes("vehicle")) suggested = "Transport";
                else if (text.includes("field") || text.includes("gym") || text.includes("sport") || text.includes("court")) suggested = "Sports";

                if (suggested) {
                    categorySelect.value = suggested;
                    const badge = document.getElementById('autoTagBadge');
                    if (badge) badge.style.display = 'inline';
                    showToast('info', `✨ Auto-selected: ${suggested}`, '');
                }
            }
        });
    }
};

// ============================================================
// Swal helpers
// ============================================================
function swalStyle() {
    return {
        background: '#0d1117',
        color: '#f1f5f9'
    };
}

function showToast(icon, title, text) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon,
        title,
        text: text || undefined,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        ...swalStyle()
    });
}

// ============================================================
// Submit Complaint
// ============================================================
async function submitComplaint(event) {
    event.preventDefault();

    const email = localStorage.getItem("studentEmail");
    const department = document.getElementById("department").value.trim();
    const category = document.getElementById("category").value.trim();
    const complaint = document.getElementById("complaint").value.trim();
    const priority = document.getElementById("priorityValue")?.value || "Normal";

    // Validation
    if (!email) {
        Swal.fire({ icon: 'warning', title: 'Not Logged In', text: 'Please login first.', ...swalStyle() });
        setTimeout(() => window.location.href = 'student-login.html', 1500);
        return;
    }
    if (!department || !category || !complaint) {
        Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in Department, Category, and Complaint.', ...swalStyle() });
        return;
    }
    if (complaint.length < 10) {
        Swal.fire({ icon: 'warning', title: 'Too Short', text: 'Please describe your complaint in more detail (at least 10 characters).', ...swalStyle() });
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'inline';

    const payload = {
        name: email.split('@')[0],
        email,
        department,
        category,
        priority,
        complaint,
        image: selectedFileBase64 || null
    };

    try {
        const response = await fetch("http://localhost:5000/api/complaints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // Re-enable button
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitSpinner.style.display = 'none';

        if (response.ok) {
            const responseData = await response.json();
            const saved = responseData.complaint;

            Swal.fire({
                icon: 'success',
                title: '🎉 Complaint Submitted!',
                html: `<p style="color:#94a3b8; font-size:0.9rem;">Your complaint has been registered.</p>
                       <div style="background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); border-radius:10px; padding:12px; margin-top:12px; font-size:0.85rem;">
                           Ticket ID: <strong style="color:#c4b5fd;">#${saved.id}</strong>
                       </div>`,
                showCancelButton: true,
                confirmButtonColor: '#8b5cf6',
                cancelButtonColor: '#3b82f6',
                confirmButtonText: '<i class="bi bi-check-lg me-1"></i> Done',
                cancelButtonText: '📄 Download Receipt',
                ...swalStyle()
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    generatePDFReceipt(saved);
                }
            });

            // Reset form
            document.getElementById("department").value = "";
            document.getElementById("category").value = "";
            document.getElementById("complaint").value = "";
            document.getElementById("charCounter").textContent = "0 / 1000 characters";
            document.getElementById("priorityValue").value = "Normal";
            setPriority("Normal");
            selectedFileBase64 = null;
            document.getElementById("uploadPreview").innerHTML = "";
            const badge = document.getElementById('autoTagBadge');
            if (badge) badge.style.display = 'none';

        } else {
            const errData = await response.json().catch(() => ({}));
            Swal.fire({ icon: 'error', title: 'Submission Failed', text: errData.message || 'Server error. Please try again.', ...swalStyle() });
        }
    } catch (error) {
        // Re-enable button
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitSpinner.style.display = 'none';

        console.error("Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Cannot Connect to Server',
            html: `<p style="color:#94a3b8; font-size:0.875rem;">Make sure the backend is running:</p>
                   <code style="background:rgba(255,255,255,0.05); padding:8px 14px; border-radius:8px; font-size:0.8rem; display:block; margin-top:8px; color:#c4b5fd;">node backend/server.js</code>`,
            ...swalStyle()
        });
    }
}

// ============================================================
// PDF Receipt Generator
// ============================================================
function generatePDFReceipt(c) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT COMPLAINT RECEIPT", 20, 25);

    // Ticket box
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(15, 48, 180, 30, 4, 4, 'F');
    doc.setTextColor(88, 28, 135);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Ticket ID: #${c.id}`, 25, 60);
    doc.text(`Submitted: ${new Date(parseInt(c.id)).toLocaleString()}`, 25, 70);

    // Details
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Complaint Details", 20, 95);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 98, 190, 98);

    const fields = [
        ["Student Email", c.email],
        ["Department", c.department],
        ["Category", c.category],
        ["Priority", c.priority || "Normal"],
        ["Status", c.status || "Pending"]
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y = 108;
    fields.forEach(([label, value]) => {
        doc.setTextColor(100, 100, 100);
        doc.text(label + ":", 20, y);
        doc.setTextColor(30, 30, 30);
        doc.text(String(value || "—"), 75, y);
        y += 10;
    });

    // Complaint text
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text("Complaint Description:", 20, y);
    y += 8;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(`"${c.complaint}"`, 170);
    doc.text(lines, 20, y);

    // Footer
    doc.setFillColor(240, 240, 255);
    doc.rect(0, 265, 210, 32, 'F');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 120);
    doc.text("Thank you for reaching out. Our team will process your complaint within 24–48 hours.", 20, 277);
    doc.text("Student Complaint Portal © 2026 | Powered by ComplaintHub", 20, 285);

    doc.save(`Complaint_Receipt_#${c.id}.pdf`);
}