import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
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
              <Link
                to="/warranty-policy"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Hỗ trợ khách hàng
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Theo dõi */}
        <div>
          <h4 className="text-black text-xl mb-3">Theo dõi chúng tôi</h4>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/apple"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/apple/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/@Apple"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
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
