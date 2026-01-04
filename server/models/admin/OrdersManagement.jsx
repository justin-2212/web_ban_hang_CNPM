// src/pages/admin/OrdersManagement.jsx

import { useEffect, useState } from "react";
import { donHangServiceAdmin } from "../../services/donHangServiceAdmin";
import { Search, Eye, X } from "lucide-react";
import OrderDetailDrawer from "../../components/admin/OrderDetailDrawer";

const ORDER_STATUS = {
  0: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800" },
  1: { label: "Đang giao", color: "bg-blue-100 text-blue-800" },
  2: { label: "Giao hàng thành công", color: "bg-green-100 text-green-800" },
  3: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

const PAYMENT_STATUS = {
  0: { label: "Chưa thanh toán", color: "bg-gray-100 text-gray-800" },
  1: { label: "Thanh toán bị lỗi", color: "bg-red-100 text-red-800" },
  2: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    tinhTrangDonHang: "",
    tinhTrangThanhToan: "",
    phuongThucThanhToan: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await donHangServiceAdmin.getAll(filters);
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      const response = await donHangServiceAdmin.getById(orderId);
      if (response.success) {
        setSelectedOrder(response.data);
        setShowDetail(true);
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const confirmMsg =
      newStatus === 2
        ? "Xác nhận GIAO HÀNG THÀNH CÔNG?\n\nLưu ý: Hệ thống sẽ tự động cập nhật 'Đã thanh toán'. Bạn sẽ KHÔNG thể thay đổi trạng thái đơn hàng này nữa!"
        : "Bạn có chắc muốn cập nhật trạng thái đơn hàng?";
    if (!confirm(confirmMsg)) return;

    try {
      const response = await donHangServiceAdmin.updateStatus(
        orderId,
        newStatus
      );
      if (response.success) {
        alert("Cập nhật trạng thái thành công");
        fetchOrders();
        setShowDetail(false);
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    if (!confirm("Bạn có chắc muốn cập nhật trạng thái thanh toán?")) return;

    try {
      const response = await donHangServiceAdmin.updatePaymentStatus(
        orderId,
        newStatus
      );
      if (response.success) {
        alert("Cập nhật trạng thái thanh toán thành công");
        fetchOrders();
        if (selectedOrder && selectedOrder.MaDonHang === orderId) {
          setShowDetail(false);
        }
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    // 1. Hiển thị cảnh báo xác nhận (Giống style Giao hàng thành công)
    if (
      !confirm(
        "Xác nhận HỦY ĐƠN HÀNG?\n\nLưu ý: Hành động này không thể hoàn tác. Đơn hàng sẽ chuyển sang trạng thái 'Đã hủy' và số lượng tồn kho sẽ được hoàn lại."
      )
    )
      return;

    try {
      // 2. Gọi API hủy
      const response = await donHangServiceAdmin.cancel(
        orderId,
        "Admin hủy trực tiếp"
      );

      if (response.success) {
        alert("Hủy đơn hàng thành công");
        fetchOrders();
        setShowDetail(false); // Đóng modal
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Biến kiểm tra xem đơn hàng đã "chốt sổ" chưa (Thành công hoặc Hủy)
  const isOrderFinalized =
    selectedOrder && [2, 3].includes(selectedOrder.TinhTrangDonHang);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        <p className="text-gray-600 mt-1">Quản lý và xử lý đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        {/*Thêm 'items-center' */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Search */}
          {/*  Thêm 'h-10' */}
          <div className="relative h-10">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              /*Thêm 'h-10' */
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <select
            /*  Thêm 'h-10' */
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.tinhTrangDonHang}
            onChange={(e) =>
              setFilters({ ...filters, tinhTrangDonHang: e.target.value })
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Đang xử lý</option>
            <option value="1">Đang giao</option>
            <option value="2">Giao hàng thành công</option>
            <option value="3">Đã hủy</option>
          </select>

          <select
            /* Thêm 'h-10' */
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.tinhTrangThanhToan}
            onChange={(e) =>
              setFilters({ ...filters, tinhTrangThanhToan: e.target.value })
            }
          >
            <option value="">Tất cả thanh toán</option>
            <option value="0">Chưa thanh toán</option>
            <option value="1">Thanh toán lỗi</option>
            <option value="2">Đã thanh toán</option>
          </select>

          <select
            /*  Thêm 'h-10' */
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.phuongThucThanhToan}
            onChange={(e) =>
              setFilters({ ...filters, phuongThucThanhToan: e.target.value })
            }
          >
            <option value="">Tất cả phương thức</option>
            <option value="COD">COD</option>
            <option value="ONLINE">Online</option>
          </select>

          <button
            /* Thêm 'h-10' và 'border border-transparent' */
            className="w-full h-10 px-4 bg-gray-200 text-gray-700 border border-transparent rounded-lg hover:bg-gray-300 flex items-center justify-center"
            onClick={() =>
              setFilters({
                search: "",
                tinhTrangDonHang: "",
                tinhTrangThanhToan: "",
                phuongThucThanhToan: "",
              })
            }
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Orders Table */}
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
                    Mã ĐH
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.MaDonHang} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{order.MaDonHang}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.TenDayDu}
                        </p>
                        <p className="text-gray-500 text-xs">{order.Gmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.NgayDat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(order.TongTien)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {order.PhuongThucThanhToan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ORDER_STATUS[order.TinhTrangDonHang]?.color
                        }`}
                      >
                        {ORDER_STATUS[order.TinhTrangDonHang]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          PAYMENT_STATUS[order.TinhTrangThanhToan]?.color
                        }`}
                      >
                        {PAYMENT_STATUS[order.TinhTrangThanhToan]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetail(order.MaDonHang)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {/* [NEW] Thay thế Modal cũ bằng Drawer Component */}
      <OrderDetailDrawer
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePaymentStatus}
        onCancel={handleCancelOrder}
      />
    </div>
  );
};

export default OrdersManagement;
