import nodemailer from "nodemailer";

// Cấu hình email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});

// Gửi email xác nhận cho khách hàng
export const sendContactEmail = async (customerEmail, customerName, subject, message, phone) => {
  try {
    // Email 1: Gửi XÁC NHẬN cho khách hàng
    await transporter.sendMail({
      from: `"Apple Store" <${process.env.EMAIL_ADMIN}>`,
      to: customerEmail,
      subject: `Xác nhận nhận được tin nhắn: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1d4ed8; margin: 0;">Apple Store</h1>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Xin chào ${customerName},</h2>
            
            <p style="color: #666; line-height: 1.8; font-size: 16px;">
              Cảm ơn bạn đã chia sẻ cho chúng tôi vấn đề: <strong style="color: #1d4ed8;">${subject}</strong>
            </p>
            
            <p style="color: #666; line-height: 1.8; font-size: 16px;">
              Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
            </p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1d4ed8; margin-top: 0;">Thông tin liên hệ của bạn:</h3>
              <p style="color: #666; margin: 10px 0;"><strong>Họ tên:</strong> ${customerName}</p>
              <p style="color: #666; margin: 10px 0;"><strong>Email:</strong> ${customerEmail}</p>
              <p style="color: #666; margin: 10px 0;"><strong>Số điện thoại:</strong> ${phone}</p>
              <p style="color: #666; margin: 10px 0;"><strong>Tiêu đề:</strong> ${subject}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
            
            <div style="text-align: center; color: #999; font-size: 14px;">
              <p style="margin: 5px 0;">Apple Store - Chuyên cung cấp sản phẩm Apple chính hãng</p>
              <p style="margin: 5px 0;">Hotline: 1900 1010</p>
              <p style="margin: 5px 0;">Email: support@applestore.vn</p>
              <p style="margin: 5px 0;">Địa chỉ: 280 An Dương Vương, phường Chợ Quán, TPHCM</p>
            </div>
          </div>
        </div>
      `,
    });

    // Email 2: Thông báo cho ADMIN
    await transporter.sendMail({
      from: `"Contact Form - ${customerName}" <${process.env.EMAIL_ADMIN}>`,
      to: process.env.EMAIL_ADMIN,
      replyTo: customerEmail,
      subject: `[Liên hệ mới] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; margin-bottom: 20px;">🔔 Tin nhắn liên hệ mới từ khách hàng</h2>
            
            <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin-bottom: 20px;">
              <h3 style="color: #991b1b; margin: 0 0 10px 0;">Thông tin khách hàng:</h3>
              <p style="margin: 5px 0;"><strong>Tên:</strong> ${customerName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p style="margin: 5px 0;"><strong>Tiêu đề:</strong> ${subject}</p>
            </div>
            
            <h3 style="color: #333; margin-bottom: 10px;">Nội dung tin nhắn:</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
              <p style="color: #666; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
            
            <p style="color: #666; font-size: 14px; margin: 0;">
              💡 <strong>Tip:</strong> Nhấn "Reply" để phản hồi trực tiếp cho ${customerEmail}
            </p>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 15px 0 0 0;">
              Email này được gửi tự động từ hệ thống Contact Form
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, message: "Email đã được gửi thành công" };
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
};

// Gửi email Newsletter
export const sendNewsletterEmail = async (email) => {
  try {
    // Email chào mừng cho khách hàng
    await transporter.sendMail({
      from: `"Apple Store" <${process.env.EMAIL_ADMIN}>`,
      to: email,
      subject: "Chào mừng bạn đến với Apple Store Newsletter",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f7; padding: 20px;">
          <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            {/* Logo/Header */}
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #1d1d1f; margin: 0; font-size: 28px;">Apple Store</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Chuyên cung cấp sản phẩm Apple chính hãng</p>
            </div>

            {/* Tiêu đề chính */}
            <h2 style="color: #1d1d1f; text-align: center; font-size: 24px; margin-bottom: 20px;">
              Chào mừng bạn!
            </h2>

            {/* Nội dung chính */}
            <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 20px;">
              Cảm ơn bạn đã đăng ký nhận bản tin của Apple Store. Bạn sẽ là người đầu tiên biết về:
            </p>

            {/* Danh sách lợi ích */}
            <div style="background-color: #f5f5f7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="color: #555; padding: 8px 0; border-bottom: 1px solid #ddd;">
                  ✓ Những sản phẩm Apple mới nhất và độc quyền
                </li>
                <li style="color: #555; padding: 8px 0; border-bottom: 1px solid #ddd;">
                  ✓ Ưu đãi đặc biệt và giảm giá hấp dẫn
                </li>
                <li style="color: #555; padding: 8px 0; border-bottom: 1px solid #ddd;">
                  ✓ Thông tin về các sự kiện và khuyến mãi
                </li>
                <li style="color: #555; padding: 8px 0;">
                  ✓ Mẹo sử dụng và tư vấn chuyên nghiệp
                </li>
              </ul>
            </div>

            {/* Lời kết */}
            <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
              Đừng lo lắng, chúng tôi sẽ không gửi quá nhiều email. Chúng tôi cam kết chỉ chia sẻ những thông tin hữu ích và được cá nhân hóa cho bạn.
            </p>

            {/* CTA Button */}
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="http://localhost:5173/products" style="display: inline-block; padding: 12px 32px; background-color: #0071e3; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background-color 0.3s;">
                Khám phá sản phẩm ngay
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

            {/* Footer */}
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">Apple Store - Chuyên cung cấp sản phẩm Apple chính hãng tại Việt Nam</p>
              <p style="margin: 5px 0;">📞 Hotline: 0327 777 767</p>
              <p style="margin: 5px 0;">📧 Email: ngocthangchien@gmail.com</p>
              <p style="margin: 5px 0;">📍 Địa chỉ: 280 An Dương Vương, phường Chợ Quán, TPHCM</p>
              <p style="margin: 15px 0 0 0;">
                <a href="https://www.facebook.com/apple" style="color: #0071e3; text-decoration: none; margin: 0 10px;">Facebook</a> |
                <a href="https://www.instagram.com/apple/" style="color: #0071e3; text-decoration: none; margin: 0 10px;">Instagram</a> |
                <a href="https://www.youtube.com/@Apple" style="color: #0071e3; text-decoration: none; margin: 0 10px;">YouTube</a>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Email thông báo cho admin
    await transporter.sendMail({
      from: `"Newsletter Signup" <${process.env.EMAIL_ADMIN}>`,
      to: process.env.EMAIL_ADMIN,
      subject: "[Newsletter] Khách hàng mới đăng ký",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f7; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #0071e3; margin-bottom: 20px;">📧 Đăng ký Newsletter mới</h2>
            <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0071e3; border-radius: 5px;">
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN")}</p>
            </div>
            <p style="color: #666; margin-top: 20px; font-size: 14px;">Email này được gửi tự động từ hệ thống Newsletter</p>
          </div>
        </div>
      `,
    });

    return { success: true, message: "Email đã được gửi thành công" };
  } catch (error) {
    console.error("Lỗi gửi newsletter email:", error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
};
