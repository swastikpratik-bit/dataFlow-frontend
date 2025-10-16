import { useState, useEffect } from 'react';
import axios from 'axios';
import { downloadPDF, downloadXLSX } from '../utils/exportData';

export default function DataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-700">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Filter and sort data
  const filteredData = data
    .filter(item =>
      (item.work_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.singer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!a[sortField]) return 1;
      if (!b[sortField]) return -1;
      if (typeof a[sortField] === 'string') {
        return sortAsc
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
      return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    });

  // Stats
  const totalRecords = filteredData.length;
  const totalViews = totalRecords > 0 ? filteredData.reduce((sum, i) => sum + (parseInt(i.views) || 0), 0) : 0;
  const avgViews = totalRecords > 0 ? Math.round(totalViews / totalRecords) : 0;

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };


  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 to-purple-800 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            Data Dashboard
          </h1>
          <p className="text-gray-200 text-lg mb-4">Manage and analyze your uploaded records</p>
          <input
            type="text"
            placeholder="Search by work title, singer, or category..."
            className="h-18 text-2xl text-white p-3 rounded-xl w-full mx-auto font-medium outline-none border border-white/20 bg-gradient-to-r from-white/5 to-white/10  transition-all max-w-3xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-2 mb-4 ">
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
              onClick={() => downloadXLSX(data)}
            >
              ⬇️ Download Excel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors cursor-pointer"
              onClick={() => downloadPDF(data)}
            >
              ⬇️ Download PDF
            </button>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Records', value: totalRecords, icon: '🎵', bg: 'from-blue-400 to-blue-600' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: '👁️', bg: 'from-green-400 to-green-600' },
            { label: 'Avg Views', value: avgViews.toLocaleString(), icon: '📊', bg: 'from-purple-400 to-purple-600' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md bg-gradient-to-r ${stat.bg} text-white flex items-center space-x-4`}
            >
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <p className="text-sm opacity-80">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-x-auto shadow-lg border border-white/20 backdrop-blur-md">
          <table className="w-full text-left min-w-max">
            <thead className="bg-white/10">
              <tr>
                {['ID', 'Sl No', 'Video URL', 'ISRC', 'IPRS Work Int No', 'EJNW', 'Work Title', 'Alternative Titles', 'Singer Name', 'Release Date', 'Duration', 'Views', 'M/K', 'Category', 'Tunecode', 'ISWC', 'ICE Work Key', 'Old Tunecodes', 'CA1', 'Screen Name1', 'CAE/IPI-1', 'Per%1', 'Mec%1', 'CA2', 'Screen Name2', 'CAE/IPI-2', 'Per%2', 'Mec%2', 'CA3', 'Screen Name3', 'CAE/IPI-3', 'Per%3', 'Mec%3', 'CA4', 'Screen Name4', 'CAE/IPI-4', 'Per%4', 'Mec%4', 'CA5', 'Screen Name5', 'CAE/IPI-5', 'Per%5', 'Mec%5', 'CA6', 'Screen Name6', 'CAE/IPI-6', 'Per%6', 'Mec%6'].map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-gray-200 whitespace-nowrap min-w-[120px]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={47} className="text-center py-16 text-gray-300">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-t border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedRow(item)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{item.id || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.sl_no || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate">{item.video_url || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.isrc || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.iprs_work_int_no || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ejnw || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate">{item.work_title || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate">{item.alternative_titles || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.singer_name || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.release_date ? new Date(item.release_date).toLocaleDateString() : 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.duration || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.views ? parseInt(item.views).toLocaleString() : 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.m_k || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.category || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.tunecode || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.iswc || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ice_work_key || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.old_tunecodes || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ca1 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.screen_name1 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.cae_ipi_1 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.per_1 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.mec_1 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ca2 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.screen_name2 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.cae_ipi_2 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.per_2 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.mec_2 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ca3 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.screen_name3 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.cae_ipi_3 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.per_3 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.mec_3 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ca4 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.screen_name4 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.cae_ipi_4 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.per_4 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.mec_4 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ca5 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.screen_name5 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.cae_ipi_5 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.per_5 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.mec_5 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.ca6 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.screen_name6 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.cae_ipi_6 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.per_6 || 'NULL'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.mec_6 || 'NULL'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedRow && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full text-white relative shadow-xl">
              <button
                className="absolute top-3 right-3 text-gray-300 font-bold text-2xl hover:text-red-400"
                onClick={() => setSelectedRow(null)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">
                {selectedRow.work_title}
              </h2>
              <p><strong>Singer:</strong> {selectedRow.singer_name}</p>
              <p><strong>Category:</strong> {selectedRow.category}</p>
              <p><strong>Views:</strong> {parseInt(selectedRow.views || 0).toLocaleString()}</p>
              <p><strong>Duration:</strong> {selectedRow.duration}</p>
              <p><strong>ISRC:</strong> {selectedRow.isrc}</p>
              <p><strong>Release Date:</strong> {selectedRow.release_date ? new Date(selectedRow.release_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>DB ID:</strong> {selectedRow.id}</p>
              <p><strong>Sl No:</strong> {selectedRow.sl_no}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
