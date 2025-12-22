// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from 'react';
import { thongKeAdminAPI } from '../../services/adminAPI';
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await thongKeAdminAPI.getDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hoạt động cửa hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu hôm nay */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats?.homNay?.DoanhThuHomNay)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats?.homNay?.DonHangHomNay || 0} đơn hàng
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tổng đơn hàng */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.donHang?.TongDonHang || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Đang xử lý: {stats?.donHang?.DangXuLy || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Người dùng */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Người dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.nguoiDung?.TongTaiKhoan || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Đang hoạt động: {stats?.nguoiDung?.DangHoatDong || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tồn kho thấp */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cảnh báo tồn kho</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.tonKhoThap?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Sản phẩm cần nhập hàng
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doanh thu tháng này */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Doanh thu tháng này
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Tổng doanh thu</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(stats?.thangNay?.DoanhThuThangNay)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Đơn hàng</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.thangNay?.DonHangThangNay || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tuần này</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.tuanNay?.DonHangTuanNay || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top sản phẩm */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top sản phẩm bán chạy
          </h3>
          <div className="space-y-3">
            {stats?.topSanPham?.slice(0, 5).map((product, index) => (
              <div
                key={product.MaBienThe}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.TenSanPham} - {product.TenBienThe}
                  </p>
                  <p className="text-xs text-gray-500">
                    Đã bán: {product.TongSoLuong} sản phẩm
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(product.TongDoanhThu)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cảnh báo tồn kho thấp */}
      {stats?.tonKhoThap && stats.tonKhoThap.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Cảnh báo tồn kho thấp
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Biến thể
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.tonKhoThap.map((item) => (
                  <tr key={item.MaBienThe}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.TenSanPham}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.TenBienThe}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-red-600">
                        {item.SoLuongTonKho}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Cần nhập hàng
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trạng thái đơn hàng */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Trạng thái đơn hàng
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">
              {stats?.donHang?.DangXuLy || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Đang xử lý</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.donHang?.DangGiao || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Đang giao</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {stats?.donHang?.DaGiao || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Đã giao</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {stats?.donHang?.DaHuy || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Đã hủy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
