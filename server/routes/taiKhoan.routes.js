// server/routes/taiKhoan.routes.js

import express from "express";
const router = express.Router();
import TaiKhoan from "../models/taiKhoan.model.js";

router.post("/sync-user", async (req, res) => {
  // --- SỬA Ở ĐÂY: Thêm clerkId vào để hứng dữ liệu từ Frontend ---
  const { email, fullName, clerkId } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Thiếu email" });

  try {
    const existingUser = await TaiKhoan.findByEmail(email);

    if (existingUser) {
      return res
        .status(200)
        .json({ success: true, message: "User cũ", data: existingUser });
    }

    // Bây giờ biến clerkId đã có giá trị, truyền vào đây mới được
    const newUserId = await TaiKhoan.create(email, fullName, clerkId);

    const newUser = {
      MaTaiKhoan: newUserId,
      Gmail: email,
      TenDayDu: fullName,
      Quyen: 1,
      TinhTrangTaiKhoan: 1,
      ClerkID: clerkId,
    };

    res.status(201).json({ success: true, message: "User mới", data: newUser });
  } catch (err) {
    console.error("Lỗi sync user:", err); // In lỗi ra terminal để dễ debug
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/update-info", async (req, res) => {
  const { maTaiKhoan, soDienThoai, diaChi } = req.body;
  if (!maTaiKhoan)
    return res.status(400).json({ success: false, message: "Thiếu ID" });

  try {
    await TaiKhoan.updateInfo(maTaiKhoan, soDienThoai, diaChi);
    res.json({ success: true, message: "Update xong" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//---  API Lấy thông tin user bằng Email ---
router.get("/get-by-email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await TaiKhoan.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user" });
    }
    // Trả về toàn bộ thông tin (bao gồm SĐT, Địa chỉ mới nhất từ DB)
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
