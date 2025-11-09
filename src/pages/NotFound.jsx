// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-apple-blue mb-4">404</h1>
      <p className="text-xl mb-6">Trang không tồn tại</p>
      <Link to="/" className="bg-apple-blue text-white px-6 py-3 rounded-full">
        Về trang chủ
      </Link>
    </div>
  );
}