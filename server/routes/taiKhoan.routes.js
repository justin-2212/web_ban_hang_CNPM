// server/routes/taiKhoan.routes.js

import express from "express";
import TaiKhoan from "../models/taiKhoan.model.js";

const router = express.Router();

router.post("/sync-user", async (req, res) => {
  const { email, fullName, clerkId } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Thiếu email" });

  try {
    const existingUser = await TaiKhoan.findByEmail(email);

    if (existingUser) {
      // Logic cập nhật ClerkID nếu chưa có
      if (!existingUser.ClerkID && clerkId) {
        // --- SỬA Ở ĐÂY: Gọi hàm từ Model thay vì viết SQL trực tiếp ---
        await TaiKhoan.updateClerkID(email, clerkId);

        // Cập nhật lại biến existingUser trong bộ nhớ để trả về data đúng nhất
        existingUser.ClerkID = clerkId;
      }
      return res
        .status(200)
        .json({ success: true, message: "User cũ", data: existingUser });
    }

    // Tạo mới
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
    console.error("Lỗi sync user:", err);
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
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user" });
    }
    // Trả về toàn bộ thông tin (bao gồm SĐT, Địa chỉ mới nhất từ DB)
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- BỔ SUNG: API Lấy thông tin user bằng ID (Dùng cho Admin hoặc logic nội bộ) ---
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await TaiKhoan.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
