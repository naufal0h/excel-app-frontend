import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [allData, setAllData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const API_BASE_URL = "https://excel-app-backend-qug4.onrender.com/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`${API_BASE_URL}/data`);
    setAllData(res.data);
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    // "file" di bawah ini harus SAMA dengan nama di upload.single('file') di backend
    formData.append('file', file); 
  
    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // ... rest of code
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Excel Viewer & Storage</h1>
      
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Simpan ke Server</button>

      <hr />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {allData.map((item, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} 
            style={{ padding: '10px', background: activeTab === idx ? '#007bff' : '#ccc', color: 'white' }}>
            {item.filename}
          </button>
        ))}
      </div>

      {allData[activeTab] && Object.entries(allData[activeTab].content).map(([sheetName, rows]) => (
        <div key={sheetName}>
          <h3>Sheet: {sheetName}</h3>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{rows[0] && Object.keys(rows[0]).map(key => <th key={key}>{key}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>{Object.values(row).map((val, j) => <td key={j}>{val}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;