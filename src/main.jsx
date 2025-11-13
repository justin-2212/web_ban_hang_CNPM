// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Không khởi tạo AOS ở đây nữa!
// → Đã chuyển sang App.jsx

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutURL="/"
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
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
