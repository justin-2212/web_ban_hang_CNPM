// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

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
      <App clerkPublishableKey={PUBLISHABLE_KEY} />
    </BrowserRouter>
  </StrictMode>
);
