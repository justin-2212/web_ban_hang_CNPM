// src/data/productsData.js
import p1 from "../assets/products/iphone/17prm.jpg";
import p2 from "../assets/products/iphone/16pro.png";
import p3 from "../assets/products/macbook/mac_airm3.jpeg";
import p4 from "../assets/products/ipad/ipad_prom4.jpeg";
import p5 from "../assets/products/airpods/ap_pro2.jpeg";
import p6 from "../assets/products/accessories/magsafe.jpg"; // nếu chưa có, bạn tạo file hoặc dùng placeholder

// mỗi item có: id, name, category, price (number, USD), img
export const productsData = [
  { id: 1, name: "iPhone 17 Pro Max", category: "iPhone", price: 1399, img: p1 },
  { id: 2, name: "iPhone 16 Pro", category: "iPhone", price: 1199, img: p2 },
  { id: 3, name: "MacBook Air M3", category: "MacBook", price: 1499, img: p3 },
  { id: 4, name: "iPad Pro M4", category: "iPad", price: 999, img: p4 },
  { id: 5, name: "AirPods Pro 2", category: "AirPods", price: 249, img: p5 },
  { id: 6, name: "MagSafe Charger", category: "Phụ kiện", price: 49, img: p6 },
  // Thêm sản phẩm ở đây khi cần
];

export const categories = ["iPhone", "iPad", "MacBook", "AirPods", "Phụ kiện"];
