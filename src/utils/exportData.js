// src/utils/exportData.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ correct import for ESM/Vite

export const downloadXLSX = (data) => {
  console.log(data);
  if (!data || data.length === 0) return;

  const exportData = data.map(item => ({
    ID: item.id,
    "First Name": item.first_name,
    "Last Name": item.last_name,
    Gender: item.gender,
    Country: item.country,
    Age: item.age,
    Date: new Date(item.date).toLocaleDateString(),
    "External ID": item.ext_id
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, "data_export.xlsx");
};

export const downloadPDF = (data) => {
  console.log(data);
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  const headers = [["ID", "First Name", "Last Name", "Gender", "Country", "Age", "Date", "Ext ID"]];
  const rows = data.map(item => [
    item.id,
    item.first_name,
    item.last_name,
    item.gender,
    item.country,
    item.age,
    new Date(item.date).toLocaleDateString(),
    item.ext_id
  ]);

  // ✅ Use autoTable separately with doc
  autoTable(doc, {
    head: headers,
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [52, 211, 153] },
    startY: 20,
  });

  doc.text("Data Export", 14, 15);
  doc.save("data_export.pdf");
};
