import React from "react";

const COLOR_MAP = {
  // iPhone colors
  'Hồng': '#FFC1CC',
  'Pink': '#FFC1CC',
  'Xanh': '#A7C7E7',
  'Blue': '#A7C7E7',
  'Đen': '#1D1E20',
  'Midnight': '#1D1E20',
  'Black': '#000000',
  'Trắng': '#F5F5DC',
  'Starlight': '#F5F5DC',
  'White': '#FFFFFF',
  'Xanh Lá': '#90EE90',
  'Green': '#90EE90',
  'Đỏ': '#FF0000',
  'Red': '#FF0000',
  'Xanh Sierra': '#69C9D0',
  'Sierra Blue': '#69C9D0',
  'Xanh Lá Alpine': '#50C878',
  'Alpine Green': '#50C878',
  'Vàng': '#FFD700',
  'Gold': '#FFD700',
  'Yellow': '#FFD700',
  'Xám': '#6C6C6C',
  'Graphite': '#3C3C3C',
  'Space Gray': '#6C6C6C',
  'Bạc': '#C0C0C0',
  'Silver': '#C0C0C0',
  'Tím': '#DDA0DD',
  'Purple': '#DDA0DD',
  'Tím Deep Purple': '#9370DB',
  'Deep Purple': '#9370DB',
  'Xanh Dương': '#4682B4',
  'Đen Space Black': '#2C2C2E',
  'Space Black': '#2C2C2E',
  'Titan Tự Nhiên': '#E5E4E2',
  'Natural Titanium': '#E5E4E2',
  'Titan Xanh': '#526bafff',
  'Blue Titanium': '#5F9EA0',
  'Titan Trắng': '#F8F8FF',
  'White Titanium': '#F8F8FF',
  'Titan Đen': '#36454F',
  'Black Titanium': '#36454F',
  'Titan Sa Mạc': '#EDC9AF',
  'Desert Titanium': '#EDC9AF',
  'Xanh Lưu Ly': '#4166F5',
  'Ultramarine': '#4166F5',
  'Xanh Mòng Két': '#008080',
  'Teal': '#008080',
  'Cam Vũ Trụ': '#FF6347',
  'Cosmic Orange': '#FF6347',
  'Xanh Đậm': '#00008B',
  'Deep Blue': '#00008B',
  'Sky Blue': '#87CEEB',
  'Light Gold': '#FAFAD2',
  'Cloud White': '#F0F8FF',
};

export default function OptionSelector({ attribute, selectedValue, onSelect }) {
  if (!attribute?.options || attribute.options.length === 0) return null;

  // ✅ Xác định kiểu hiển thị dựa trên tên thông số
  const isColorAttribute = attribute.tenThongSo?.toLowerCase().includes('màu');
  
  // Helper: Tìm color code
  const getColorCode = (optionText) => {
    const displayValue = optionText.giaTriHienThi || '';
    const inputValue = optionText.giaTriNhap || '';
    
    return COLOR_MAP[displayValue] || COLOR_MAP[inputValue] || null;
  };

  // Helper: Format display value với đơn vị
  const formatDisplayValue = (option) => {
    const baseValue = option.giaTriHienThi || option.giaTriNhap || '';
    
    // Nếu không có đơn vị, trả về giá trị gốc
    if (!attribute.donVi) {
      return baseValue;
    }
    
    // FIX: Kiểm tra xem giaTriHienThi đã có đơn vị chưa
    const hasUnit = baseValue.toLowerCase().includes(attribute.donVi.toLowerCase());
    
    if (hasUnit) {
      return baseValue; // Đã có đơn vị trong giaTriHienThi
    } else {
      return `${option.giaTriNhap || baseValue} ${attribute.donVi}`; // Dùng giaTriNhap + đơn vị
    }
  };

  return (
    <div className="mb-6">
      {/* Label */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        {attribute.tenThongSo}
      </h4>

      {/* Options Grid */}
      <div className={`grid ${isColorAttribute ? 'grid-cols-5 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3'} gap-3`}>
        {attribute.options.map((option) => {
          const isSelected = selectedValue === option.giaTriNhap;
          const isAvailable = option.isAvailable !== false;
          const isDisabled = option.isDisabled === true;
          const colorCode = isColorAttribute ? getColorCode(option) : null;

          return (
            <button
              type="button"
              key={option.giaTriNhap}
              onClick={() => {
                if (isAvailable || isDisabled) {
                  onSelect(attribute.maThongSo, option.giaTriNhap);
                }
              }}
              disabled={!isAvailable && !isDisabled}
              className={`
                relative rounded-xl border-2 font-medium text-sm
                transition-all duration-200
                ${isColorAttribute ? 'p-2 flex flex-col items-center gap-2' : 'px-4 py-3'}
                ${
                  isSelected
                    ? "!border-blue-500 !bg-blue-50 !text-blue-700 ring-2 ring-blue-200 shadow-md"
                    : isAvailable
                    ? "!border-gray-200 !bg-white !text-gray-900 hover:!border-blue-300 hover:!bg-blue-50 hover:!shadow-sm"
                    : isDisabled
                    ? "!border-gray-200 !bg-gray-100 !text-gray-400 cursor-not-allowed opacity-50"
                    : "!border-gray-200 !bg-gray-50 !text-gray-300 cursor-not-allowed"
                }
              `}
              style={{
                background: isSelected 
                  ? "rgb(239 246 255)" 
                  : isAvailable 
                  ? "white" 
                  : "rgb(243 244 246)",
              }}
            >
              {/*  Hiển thị Color Swatch cho màu sắc */}
              {isColorAttribute && colorCode && (
                <div 
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: colorCode }}
                />
              )}

              {/* FIX: Hiển thị text với đơn vị chính xác */}
              <span className={`block ${isColorAttribute ? 'text-xs text-center' : ''}`}>
                {formatDisplayValue(option)}
              </span>

              {/* Badge "Hết hàng" */}
              {isDisabled && !isAvailable && (
                <span className="absolute top-1 right-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                  Hết
                </span>
              )}

              {/* Checkmark cho selected */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
