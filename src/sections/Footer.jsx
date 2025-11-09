import React from "react";
import AppleLogo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-white text-black px-8 py-10 mt-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cột 1: Logo + mô tả */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={AppleLogo}
              alt="Apple Logo"
              className="w-12 h-12 object-contain"
            />
            <h4 className="text-2xl font-semibold">Apple Store</h4>
          </div>
          <p>Chuyên cung cấp các sản phẩm chính hãng của Apple tại Việt Nam.</p>
        </div>

        {/* Cột 2: Liên kết */}
        <div>
          <h4 className="text-black text-xl mb-3">Liên kết</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Hỗ trợ khách hàng
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Theo dõi */}
        <div>
          <h4 className="text-black text-xl mb-3">Theo dõi chúng tôi</h4>
          <p>Facebook | Instagram | YouTube</p>
        </div>
      </div>

      {/* Dòng cuối */}
      <p className="text-center text-gray-500 text-sm mt-10">
        © 2025 Apple Store Clone. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
