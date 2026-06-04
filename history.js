let complaints =
JSON.parse(localStorage.getItem("complaints")) || [];

let table =
document.getElementById("historyTable");

complaints.forEach(c => {

table.innerHTML += `

<tr>
<td>${c.id}</td>
<td>${c.name}</td>
<td>${c.department}</td>
<td>${c.category}</td>
<td>${c.priority}</td>
<td>${c.complaint}</td>
<td>${c.status}</td>
</tr>
`;
});