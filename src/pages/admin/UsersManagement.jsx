// src/pages/admin/UsersManagement.jsx

import { useEffect, useState } from "react";
import { taiKhoanAdminAPI } from "../../services/adminAPI";
import {
  Search,
  Eye,
  ShieldCheck,
  ShieldOff,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ROLES = {
  0: { label: "Admin", color: "bg-red-100 text-red-800" },
  1: { label: "Người dùng", color: "bg-blue-100 text-blue-800" },
};

const STATUS = {
  1: { label: "Hoạt động", color: "bg-green-100 text-green-800" },
  0: { label: "Bị khóa", color: "bg-red-100 text-red-800" },
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    quyen: "",
    tinhTrang: "",
  });

  // LẤY THÔNG TIN CỦA CHÍNH MÌNH (Admin đang đăng nhập)
  const { dbUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await taiKhoanAdminAPI.getAll(filters);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (userId) => {
    try {
      const response = await taiKhoanAdminAPI.getById(userId);
      if (response.success) {
        // Lấy thêm đơn hàng của user
        const ordersResponse = await taiKhoanAdminAPI.getUserOrders(userId);
        setSelectedUser({
          ...response.data,
          orders: ordersResponse.success ? ordersResponse.data : [],
        });
        setShowDetail(true);
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    const confirmMessage =
      newRole === 0
        ? "Bạn có chắc muốn đổi quyền của tài khoản này thành Admin?"
        : "Bạn có chắc muốn đổi quyền của tài khoản này thành người dùng?";

    // 2. Hiện thông báo xác nhận
    if (!confirm(confirmMessage)) return;

    try {
      const response = await taiKhoanAdminAPI.updateRole(userId, newRole);
      if (response.success) {
        // Thông báo thành công cũng nên rõ ràng hơn (tuỳ chọn)
        const successMessage =
          newRole === 0
            ? "Đã thăng cấp Admin thành công!"
            : "Đã hạ quyền thành người dùng thành công!"; 

        alert(successMessage);

        fetchUsers();
        if (selectedUser && selectedUser.MaTaiKhoan === userId) {
          setShowDetail(false);
        }
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleToggleStatus = async (userId) => {
    if (!confirm("Bạn có chắc muốn thay đổi trạng thái tài khoản này?")) return;

    try {
      const response = await taiKhoanAdminAPI.toggleStatus(userId);
      if (response.success) {
        alert("Cập nhật trạng thái thành công");
        fetchUsers();
        if (selectedUser && selectedUser.MaTaiKhoan === userId) {
          setShowDetail(false);
        }
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý tài khoản và quyền truy cập
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.quyen}
            onChange={(e) => setFilters({ ...filters, quyen: e.target.value })}
          >
            <option value="">Tất cả quyền</option>
            <option value="0">Admin</option>
            <option value="1">Người dùng</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.tinhTrang}
            onChange={(e) =>
              setFilters({ ...filters, tinhTrang: e.target.value })
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Bị khóa</option>
          </select>

          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={() => setFilters({ search: "", quyen: "", tinhTrang: "" })}
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thông tin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Quyền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  // Kiểm tra xem dòng này có phải là bản thân mình không
                  const isMe = dbUser && dbUser.MaTaiKhoan === user.MaTaiKhoan;

                  return (
                    <tr
                      key={user.MaTaiKhoan}
                      className={`hover:bg-gray-50 ${isMe ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.MaTaiKhoan}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.TenDayDu || "N/A"}{" "}
                            {isMe && (
                              <span className="text-xs text-blue-600 font-bold">
                                (Bạn)
                              </span>
                            )}
                          </p>
                          <p className="text-gray-500 text-xs">{user.Gmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>
                          <p>{user.SoDienThoai || "Chưa có"}</p>
                          <p className="text-xs truncate max-w-xs">
                            {user.DiaChi || "Chưa có"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            ROLES[user.Quyen]?.color ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ROLES[user.Quyen]?.label || user.Quyen}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            STATUS[user.TinhTrangTaiKhoan]?.color
                          }`}
                        >
                          {STATUS[user.TinhTrangTaiKhoan]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* === LOGIC MỚI: Chỉ hiện nút Xem chi tiết nếu KHÔNG PHẢI LÀ MÌNH === */}
                          {!isMe && (
                            <button
                              onClick={() => handleViewDetail(user.MaTaiKhoan)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {/* Chỉ hiện nút Khóa/Mở nếu không phải là mình VÀ không phải Admin khác (tùy chọn) */}
                          {!isMe && user.Quyen !== 0 && (
                            <button
                              onClick={() =>
                                handleToggleStatus(user.MaTaiKhoan)
                              }
                              className={`p-1 rounded ${
                                user.TinhTrangTaiKhoan === 1
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                user.TinhTrangTaiKhoan === 1
                                  ? "Khóa tài khoản"
                                  : "Mở khóa"
                              }
                            >
                              {user.TinhTrangTaiKhoan === 1 ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Nếu là mình thì hiện text thông báo thay vì nút */}
                          {isMe && (
                            <span className="text-xs text-gray-400 italic cursor-default select-none"></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetail && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết người dùng #{selectedUser.MaTaiKhoan}
              </h2>
              <button
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin cá nhân
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tên:</span>{" "}
                    {selectedUser.TenDayDu || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.Gmail}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">SĐT:</span>{" "}
                    {selectedUser.SoDienThoai || "Chưa có"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {selectedUser.DiaChi || "Chưa có"}
                  </p>
                </div>
              </div>

              {/* Orders History */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Lịch sử đơn hàng ({selectedUser.orders?.length || 0})
                </h3>
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedUser.orders.map((order) => (
                      <div
                        key={order.MaDonHang}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            Đơn #{order.MaDonHang}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.NgayDat)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">
                            {formatCurrency(order.TongTien)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.PhuongThucThanhToan}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có đơn hàng
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedUser.Quyen === 1 ? (
                  // TRƯỜNG HỢP 1: Đang là USER -> Hiện nút "LÊN ADMIN" (Màu xanh)
                  <button
                    onClick={() => handleUpdateRole(selectedUser.MaTaiKhoan, 0)} // Truyền 0 để lên Admin
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Thăng cấp Admin
                  </button>
                ) : (
                  // TRƯỜNG HỢP 2: Đang là ADMIN -> Hiện nút "HẠ QUYỀN" (Màu cam/đỏ)
                  <button
                    onClick={() => handleUpdateRole(selectedUser.MaTaiKhoan, 1)} // Truyền 1 để xuống User
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    <ShieldOff className="w-4 h-4" />{" "}
                    {/* Nhớ import ShieldOff từ lucide-react */}
                    Hạ xuống User
                  </button>
                )}

                {/* Nút Khóa/Mở khóa giữ nguyên */}
                <button
                  onClick={() => handleToggleStatus(selectedUser.MaTaiKhoan)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    selectedUser.TinhTrangTaiKhoan === 1
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {selectedUser.TinhTrangTaiKhoan === 1 ? (
                    <>
                      <Ban className="w-4 h-4" />
                      Khóa tài khoản
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Mở khóa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
