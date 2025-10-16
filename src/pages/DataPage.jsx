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
      `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase())
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
  const avgAge = totalRecords > 0 ? Math.round(filteredData.reduce((sum, i) => sum + i.age, 0) / totalRecords) : 0;
  const maxAge = totalRecords > 0 ? Math.max(...filteredData.map(i => i.age)) : 0;

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
            placeholder="Search by name or country..."
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
            { label: 'Total Records', value: totalRecords, icon: '📄', bg: 'from-blue-400 to-blue-600' },
            { label: 'Avg Age', value: avgAge, icon: '⚡', bg: 'from-green-400 to-green-600' },
            { label: 'Max Age', value: maxAge, icon: '🏆', bg: 'from-purple-400 to-purple-600' },
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
        <div className="rounded-2xl overflow-hidden shadow-lg border border-white/20 backdrop-blur-md">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                {['DB ID', 'Ext ID', 'Name', 'Gender', 'Country', 'Age', 'Date'].map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => handleSort(col.toLowerCase().replace('db ', '').replace('ext ', 'ext_'))}
                    className="px-6 py-3 text-gray-200 cursor-pointer hover:text-green-400 transition-colors"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-300">
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
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4">{item.ext_id}</td>
                    <td className="px-6 py-4">{item.first_name} {item.last_name}</td>
                    <td className="px-6 py-4">{item.gender}</td>
                    <td className="px-6 py-4">{item.country}</td>
                    <td className="px-6 py-4">{item.age}</td>
                    <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
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
                {selectedRow.first_name} {selectedRow.last_name}
              </h2>
              <p><strong>Gender:</strong> {selectedRow.gender}</p>
              <p><strong>Country:</strong> {selectedRow.country}</p>
              <p><strong>Age:</strong> {selectedRow.age}</p>
              <p><strong>Date:</strong> {new Date(selectedRow.date).toLocaleDateString()}</p>
              <p><strong>DB ID:</strong> {selectedRow.id}</p>
              <p><strong>Ext ID:</strong> {selectedRow.ext_id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
