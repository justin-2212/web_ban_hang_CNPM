// src/components/admin/RevenueCard.jsx

import React, { useState, useMemo } from "react";
import { TrendingUp, Calendar, Filter, BarChart3 } from "lucide-react";

const RevenueCard = ({ monthData, weekData, yearData }) => {
  //  Quản lý trạng thái xem theo 'month' hay 'week', year
  const [timeRange, setTimeRange] = useState("month");

  // Helper format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  // [LOGIC] Xác định dữ liệu cần hiển thị dựa trên state timeRange
  // Backend trả về key khác nhau (DoanhThuThangNay vs DoanhThuTuanNay) nên cần map lại
  const currentData = useMemo(() => {
    switch (timeRange) {
      case "week":
        return {
          label: "tuần này",
          revenue: weekData?.DoanhThuTuanNay || 0,
          orders: weekData?.DonHangTuanNay || 0,
          ordersLabel: "Đơn hàng tuần",
        };
      case "year": // [UPDATE] Thêm case cho năm
        return {
          label: "năm nay",
          revenue: yearData?.DoanhThuNamNay || 0,
          orders: yearData?.DonHangNamNay || 0,
          ordersLabel: "Đơn hàng năm",
        };
      case "month":
      default:
        return {
          label: "tháng này",
          revenue: monthData?.DoanhThuThangNay || 0,
          orders: monthData?.DonHangThangNay || 0,
          ordersLabel: "Đơn hàng tháng",
        };
    }
  }, [timeRange, monthData, weekData, yearData]);

  // Tính toán % tiến độ dựa trên thời gian thực
  const progressPercentage = useMemo(() => {
    const now = new Date();
    if (timeRange === "month") {
      // Tính % ngày đã qua trong tháng
      const date = now.getDate(); // Ngày hiện tại (vd: 25)
      // Lấy tổng số ngày trong tháng hiện tại
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      return `${(date / daysInMonth) * 100}%`;
    } else if (timeRange === "week") {
      // Tính % ngày đã qua trong tuần (Thứ 2 = 1, CN = 7)
      let day = now.getDay();
      if (day === 0) day = 7; // Đổi chủ nhật từ 0 thành 7
      return `${(day / 7) * 100}%`;
    } else if (timeRange === "year") {
      // Tính % của năm
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
      // Tính số mili-giây đã trôi qua chia cho tổng mili-giây trong năm
      const percent = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;
      return `${percent}%`;
    }
    return "0%";
  }, [timeRange]);

  // Helper để render class cho nút bấm (để code gọn hơn)
  const getButtonClass = (type) =>
    `px-3 py-1 text-xs font-medium rounded-md transition-all border ${
      timeRange === type
        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
    }`;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      {/* Header: Tiêu đề + Nút chuyển đổi */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Doanh thu {currentData.label}
        </h3>

        {/* Bộ nút chuyển đổi Tháng/Tuần */}
        <div className="flex gap-2">
          {" "}
          {/* Giảm gap xuống 2 cho gọn vì có 3 nút */}
          <button
            onClick={() => setTimeRange("week")}
            className={getButtonClass("week")}
          >
            Tuần
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={getButtonClass("month")}
          >
            Tháng
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={getButtonClass("year")}
          >
            Năm
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Phần hiển thị Tổng doanh thu */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Tổng doanh thu</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(currentData.revenue)}
            </span>
          </div>

          {/* Thanh tiến trình giả lập (Visual only) */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            {/* Áp dụng width động theo thời gian */}
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: progressPercentage }}
            ></div>
          </div>
          {/* Hiển thị chú thích nhỏ cho người dùng hiểu thanh này là gì */}
          <p className="text-xs text-gray-400 mt-1 text-right">
            Tiến độ thời gian: {parseFloat(progressPercentage).toFixed(0)}%
          </p>
        </div>

        {/* Phần hiển thị chi tiết phụ (Số đơn hàng) */}
        <div className="pt-4 border-t mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{currentData.ordersLabel}</p>
              <p className="text-xl font-bold text-gray-900">
                {currentData.orders}
              </p>
            </div>

            {/* Icon trang trí */}
            <div
              className={`p-2 rounded-full ${
                timeRange === "month"
                  ? "bg-blue-50"
                  : timeRange === "week"
                  ? "bg-orange-50"
                  : "bg-purple-50" // Màu nền cho icon Năm
              }`}
            >
              {timeRange === "month" && (
                <Calendar className="w-5 h-5 text-blue-500" />
              )}
              {timeRange === "week" && (
                <Filter className="w-5 h-5 text-orange-500" />
              )}
              {timeRange === "year" && (
                <BarChart3 className="w-5 h-5 text-purple-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
