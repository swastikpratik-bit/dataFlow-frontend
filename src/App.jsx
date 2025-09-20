import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DataPage from './pages/DataPage';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}