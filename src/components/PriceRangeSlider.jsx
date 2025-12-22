//src/components/PriceRangeSlider.jsx

import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

const PriceRangeSlider = ({ minPrice = 0, maxPrice = 100000000, onPriceChange }) => {
  const [range, setRange] = useState([minPrice, maxPrice]);
  const [isChanging, setIsChanging] = useState(false);

  // Format giá tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Xử lý khi min slider thay đổi
  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= range[1]) {
      setRange([newMin, range[1]]);
      setIsChanging(true);
    }
  };

  // Xử lý khi max slider thay đổi
  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= range[0]) {
      setRange([range[0], newMax]);
      setIsChanging(true);
    }
  };

  // Gọi callback khi người dùng ngừng kéo (debounce)
  useEffect(() => {
    if (!isChanging) return;

    const timer = setTimeout(() => {
      onPriceChange(range[0], range[1]);
      setIsChanging(false);
    }, 500); // Đợi 500ms sau khi ngừng kéo mới gọi API

    return () => clearTimeout(timer);
  }, [range, isChanging, onPriceChange]);

  // Tính phần trăm để hiển thị thanh màu xanh giữa 2 nút kéo
  const getPercentage = (value) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const minPercent = getPercentage(range[0]);
  const maxPercent = getPercentage(range[1]);

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Khoảng giá</h3>
      </div>

      {/* Hiển thị giá trị đã chọn */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm">
          <span className="text-gray-600">Từ: </span>
          <span className="font-semibold text-blue-600">{formatPrice(range[0])}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Đến: </span>
          <span className="font-semibold text-blue-600">{formatPrice(range[1])}</span>
        </div>
      </div>

      {/* Container cho dual range slider */}
      <div className="relative h-2 mb-8">
        {/* Track nền */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
        
        {/* Track màu xanh giữa 2 nút kéo */}
        <div 
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        ></div>

        {/* Min Range Input */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={1000000}
          value={range[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-blue-700 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-blue-700"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={1000000}
          value={range[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-blue-700 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-blue-700"
        />
      </div>

      {/* Hiển thị các mốc giá tham khảo */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatPrice(minPrice)}</span>
        <span>{formatPrice(maxPrice)}</span>
      </div>

      {/* Nút reset */}
      {(range[0] !== minPrice || range[1] !== maxPrice) && (
        <button
          onClick={() => {
            setRange([minPrice, maxPrice]);
            onPriceChange(minPrice, maxPrice);
          }}
          className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
        >
          Đặt lại bộ lọc
        </button>
      )}
    </div>
  );
};

export default PriceRangeSlider;
