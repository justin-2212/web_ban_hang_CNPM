// src/components/PriceRange.jsx
import React, { useState, useEffect } from "react";

export default function PriceRange({ min, max, from, to, onChange }) {
  const [minVal, setMinVal] = useState(from);
  const [maxVal, setMaxVal] = useState(to);

  useEffect(() => {
    // ensure minVal <= maxVal
    if (minVal > maxVal) setMinVal(maxVal);
  }, [minVal, maxVal]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
    // eslint-disable-next-line
  }, [minVal, maxVal]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div>Giá từ: ${minVal}</div>
        <div>Đến: ${maxVal}</div>
      </div>

      <div className="relative">
        {/* min range */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => setMinVal(Number(e.target.value))}
          className="w-full appearance-none h-1 bg-gray-200 rounded-lg focus:outline-none"
        />
        {/* max range */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => setMaxVal(Number(e.target.value))}
          className="w-full appearance-none h-1 bg-transparent absolute top-0 left-0"
        />
      </div>
    </div>
  );
}
