// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { ClerkProvider } from "@clerk/clerk-react";
// 1. Thêm dòng này để nhập gói tiếng Việt
import { viVN } from "@clerk/localizations";

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
        localization={viVN}
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
