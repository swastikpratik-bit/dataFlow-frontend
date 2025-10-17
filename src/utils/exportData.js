// src/utils/exportData.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ correct import for ESM/Vite

export const downloadXLSX = (data) => {
  console.log(data);
  if (!data || data.length === 0) return;

  const exportData = data.map(item => ({
    "ID": item.id,
    "Sl No": item.sl_no,
    "Video URL": item.video_url,
    "ISRC": item.isrc,
    "IPRS Work Int No": item.iprs_work_int_no,
    "EJNW": item.ejnw,
    "Work Title": item.work_title,
    "Alternative Titles": item.alternative_titles,
    "Singer Name": item.singer_name,
    "Release Date": item.release_date ? new Date(item.release_date).toLocaleDateString() : '',
    "Duration": item.duration,
    "Views": item.views,
    "M/K": item.m_k,
    "Category": item.category,
    "Tunecode": item.tunecode,
    "ISWC": item.iswc,
    "ICE Work Key": item.ice_work_key,
    "Old Tunecodes": item.old_tunecodes,
    "CA1": item.ca1,
    "Screen Name1": item.screen_name1,
    "CAE/IPI-1": item.cae_ipi_1,
    "Per 1": item.per_1,
    "Mec 1": item.mec_1,
    "CA2": item.ca2,
    "Screen Name2": item.screen_name2,
    "CAE/IPI-2": item.cae_ipi_2,
    "Per 2": item.per_2,
    "Mec 2": item.mec_2,
    "CA3": item.ca3,
    "Screen Name3": item.screen_name3,
    "CAE/IPI-3": item.cae_ipi_3,
    "Per 3": item.per_3,
    "Mec 3": item.mec_3,
    "CA4": item.ca4,
    "Screen Name4": item.screen_name4,
    "CAE/IPI-4": item.cae_ipi_4,
    "Per 4": item.per_4,
    "Mec 4": item.mec_4,
    "CA5": item.ca5,
    "Screen Name5": item.screen_name5,
    "CAE/IPI-5": item.cae_ipi_5,
    "Per 5": item.per_5,
    "Mec 5": item.mec_5,
    "CA6": item.ca6,
    "Screen Name6": item.screen_name6,
    "CAE/IPI-6": item.cae_ipi_6,
    "Per 6": item.per_6,
    "Mec 6": item.mec_6
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Music Data");
  XLSX.writeFile(workbook, "music_catalog.xlsx");
};

export const downloadPDF = (data) => {
  console.log(data);
  if (!data || data.length === 0) return;

  const doc = new jsPDF('l', 'mm', 'a4'); // landscape for wide table

  const headers = [["ID", "Sl No", "Work Title", "Singer", "Category", "Views", "Release Date"]];
  const rows = data.map(item => [
    item.id,
    item.sl_no,
    item.work_title || '',
    item.singer_name || '',
    item.category || '',
    item.views || '',
    item.release_date ? new Date(item.release_date).toLocaleDateString() : ''
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [52, 211, 153] },
    startY: 20,
    styles: { fontSize: 8 },
    columnStyles: {
      2: { cellWidth: 60 }, // Work Title
      3: { cellWidth: 40 }  // Singer
    }
  });

  doc.text("Music Catalog Report", 14, 15);
  doc.save("music_catalog.pdf");
};
