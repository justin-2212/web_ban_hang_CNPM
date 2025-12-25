// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from "react";
import { thongKeAdminAPI } from "../../services/adminAPI";
import LowStockTable from "../../components/admin/LowStockTable";
import TopSellingTable from "../../components/admin/TopSellingTable";
import RevenueCard from "../../components/admin/RevenueCard";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

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
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
              <p className="text-sm font-medium text-gray-600">
                Doanh thu hôm nay
              </p>
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
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.donHang?.TongDonHang || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-yellow-600 font-medium">Đang xử lý:</span>
              <span className="font-bold">{stats?.donHang?.DangXuLy || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">Đang giao:</span>
              <span className="font-bold">{stats?.donHang?.DangGiao || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">Đã giao:</span>
              <span className="font-bold">{stats?.donHang?.DaGiao || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-600 font-medium">Đã hủy:</span>
              <span className="font-bold">{stats?.donHang?.DaHuy || 0}</span>
            </div>
          </div>
        </div>

        {/* Người dùng */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Người dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.nguoiDung?.TongTaiKhoan || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          <div className="space-y-1 text-xs border-t pt-2 mt-2">
            <div className="flex justify-between items-center text-green-700">
              <span className="font-medium">Đang hoạt động:</span>
              <span className="font-bold">
                {stats?.nguoiDung?.DangHoatDong || 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span className="font-medium">Đã bị khóa:</span>
              <span className="font-bold">
                {stats?.nguoiDung?.VoHieuHoa || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Tồn kho thấp */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Cảnh báo tồn kho
              </p>
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
        <RevenueCard
          monthData={stats?.thangNay}
          weekData={stats?.tuanNay}
          yearData={stats?.namNay}
        />

        {/* Top sản phẩm */}
        <TopSellingTable data={stats?.topSanPham} />
      </div>

      {/* Cảnh báo tồn kho thấp */}
      <LowStockTable data={stats?.tonKhoThap} />

      {/* Trạng thái đơn hàng */}
      {/* <div className="bg-white rounded-lg shadow p-6">
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
            <p className="text-sm text-gray-600 mt-1">Giao hàng thành công</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {stats?.donHang?.DaHuy || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Đã hủy</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
