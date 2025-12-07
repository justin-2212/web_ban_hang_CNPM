import React, { useState, useEffect } from "react";

export default function PriceRange({ min, max, from, to, onChange }) {
  const [minVal, setMinVal] = useState(from);
  const [maxVal, setMaxVal] = useState(to);

  useEffect(() => {
    setMinVal(from);
    setMaxVal(to);
  }, [from, to]);

  useEffect(() => {
    // Ensure minVal <= maxVal
    if (minVal > maxVal) {
      setMinVal(maxVal);
    }
  }, [minVal, maxVal]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
    // eslint-disable-next-line
  }, [minVal, maxVal]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-gray-600">Từ:</span>
            <span className="ml-2 font-semibold text-gray-900">{formatPrice(minVal)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Đến:</span>
            <span className="ml-2 font-semibold text-gray-900">{formatPrice(maxVal)}</span>
          </div>
        </div>

        <div className="relative h-2">
          {/* Track background */}
          <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
          
          {/* Active track */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            style={{
              left: `${((minVal - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxVal - min) / (max - min)) * 100}%`
            }}
          ></div>

          {/* Min range input */}
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(e) => setMinVal(Number(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
            style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
          />

          {/* Max range input */}
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => setMaxVal(Number(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
    </div>
  );
}