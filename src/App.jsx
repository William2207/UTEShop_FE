import { Link, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import './index.css'; // Tailwind

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="p-4 shadow bg-white flex gap-4">
        <Link to="/register" className="font-semibold">Register (OTP)</Link>
        <Link to="/forgot" className="font-semibold">Quên mật khẩu (OTP)</Link>
      </nav>
      <main className="p-6 max-w-xl mx-auto">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
