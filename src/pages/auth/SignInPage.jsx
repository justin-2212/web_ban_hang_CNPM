
import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <SignIn
      routing="path"
      localization={{
        language: "vi",
        translations: {
          signIn: {
            headerTitle: "Đăng nhập",
            emailAddressLabel: "Email",
            passwordLabel: "Mật khẩu",
            primaryAction: "Đăng nhập",
          },
          signUp: {
            headerTitle: "Đăng ký",
            primaryAction: "Tạo tài khoản",
          },
        },
      }}
    />
  );
}