# Copilot Instructions for Apple Store E-Commerce Platform

## Project Overview

Full-stack e-commerce platform for selling Apple products. **Frontend**: React 19 + Vite + TailwindCSS; **Backend**: Node.js/Express; **Database**: MySQL. Uses Clerk for authentication and syncs user data to local MySQL.

## Architecture & Data Flow

### Frontend (React)

- **Entry**: `src/main.jsx` → wrapped by `AuthProvider` (context for auth state)
- **Routing**: `src/App.jsx` uses React Router v7 with main routes: `/`, `/products`, `/cart`, `/products/:id`, `/profile`, `/auth/*`
- **Auth**: Clerk (`@clerk/clerk-react`) manages authentication; `AuthContext` syncs Clerk user to MySQL on login
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin); all components use utility classes
- **Components**: Grouped in `src/components/` (shared UI like Header, Footer, ProductsList); pages in `src/pages/`
- **API calls**: Centralized in `src/services/api.js` with named exports: `sanPhamAPI`, `loaiSanPhamAPI`, `gioHangAPI`, `taiKhoanAPI`

### Backend (Node.js/Express)

- **Server**: `server/index.js` listens on `process.env.PORT || 5000`
- **Routing pattern**: `/api/{resource}` (e.g., `/api/san-pham`, `/api/gio-hang`)
- **Route precedence**: Specific routes (e.g., `/search`, `/chi-tiet/:id`) must be defined BEFORE generic `/:id` routes
- **Database**: Connection pool in `server/config/db.js` using `mysql2/promise`
- **Models**: `server/models/*.model.js` contain raw SQL queries; queries return raw arrays from MySQL
- **Controllers**: Minimal; logic often in routes directly (consider refactoring via controllers for scalability)

### Database Schema (MySQL)

Key tables:

- **LoaiSanPham** (Product Categories): `MaLoai` (PK), `TenLoai`, `MoTa`
- **SanPham** (Products): `MaSP` (PK), `Ten`, `MoTa`, `MaLoai` (FK), `TinhTrangSanPham` (1=active)
- **BienThe** (Product Variants): `MaBienThe` (PK), `MaSP` (FK), `TenBienThe`, `GiaTienBienThe`, `DuongDanAnhBienThe`, `SoLuongTonKho`, `ThuTuHienThi`
- **TaiKhoan** (Users): `MaTaiKhoan` (PK), `Gmail`, `TenDayDu`, `ClerkID`, `SoDienThoai`, `DiaChi`, `Quyen`
- **GioHangChiTiet** (Cart Items): `MaTaiKhoan` (FK), `MaBienThe` (FK), `SoLuong`
- **DonHang** (Orders): `MaDonHang` (PK), `MaTaiKhoan` (FK) — _routes not yet implemented_

**Data grouping**: `SanPham.getAll()` uses LEFT JOIN + grouping to return products with nested `variants[]` array (not flat rows).

## Critical Workflows

### Local Development

1. **Full-stack**: `npm run dev:fullstack` (uses `concurrently` to run backend + frontend)
2. **Frontend only**: `npm run dev` (Vite dev server at http://localhost:5173)
3. **Backend only**: `npm run server` (nodemon watches `server/index.js`, port 5000)
4. **Build**: `npm run build` (Vite production build)
5. **Database setup**: Use `npm run seed` or manually execute `.sql` files in `db/` folder; `00_reset.sql` clears all tables

### API Contract Pattern

All endpoints return: `{ success: boolean, data?: object|array, message?: string }`  
Example: `GET /api/san-pham` → `{ success: true, data: [{ MaSP, Ten, variants: [] }] }`

### Authentication Flow

1. User logs in via Clerk UI (manages JWT)
2. `AuthContext.useEffect()` calls `taiKhoanAPI.getByEmail(email)`
3. Backend route `/api/tai-khoan/get-by-email` queries MySQL; if not found, creates new user
4. React components use `useAuthContext()` to access `dbUser` (MySQL user object), `refreshUser()` (manual sync), `loadingUser` (loading state)

## Project-Specific Patterns & Conventions

### Vietnamese Naming

- **Database columns**: Abbreviated Vietnamese (e.g., `MaSP` = Mã Sản Phẩm, `GiaTienBienThe` = Giá tiền Biến thể)
- **URLs**: Kebab-case Vietnamese (e.g., `/api/san-pham`, `/api/chi-tiet`)
- **Code comments**: Mix of Vietnamese & English; translations not required but keep consistency

### Component & API Organization

- **API calls**: Group by resource in `src/services/api.js` (not scattered in components)
- **Component libraries**: Use [lucide-react](https://lucide.dev/) for icons (not react-icons where possible)
- **CSS**: No separate CSS files; use Tailwind utilities + Framer Motion for animations
- **Route definitions**: All routes in `src/App.jsx` Routes block; no nested routing yet

### Database Practices

- **Status columns**: `TinhTrangSanPham` (1=active), `TinhTrangHoatDong` = operational flags; always filter by these in SELECT queries
- **Data preparation**: Models return grouped/transformed data (not raw rows); component receives clean objects
- **Variant grouping**: `SanPham.getAll()` does client-side grouping; mimic this pattern for other aggregate queries

### Frontend Patterns

- **State management**: Context API only (no Redux); `AuthContext` as template
- **Async operations**: `try/catch` in components; error handling via `useState(error)`
- **Animations**: Framer Motion (`from 'framer-motion'`) + AOS library (initialized in `App.useEffect()`)

## Critical Files & Exemplars

| Purpose            | File                                                                  | Key Pattern                                              |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------------------- |
| API centralization | [src/services/api.js](src/services/api.js#L1)                         | Named exports for each resource; `handleResponse` helper |
| Auth sync          | [src/context/AuthContext.jsx](src/context/AuthContext.jsx#L1)         | Clerk + MySQL sync; lazy-load on `useEffect`             |
| Data grouping      | [server/models/sanPham.model.js](server/models/sanPham.model.js#L1)   | LEFT JOIN + Map for nested variants                      |
| Route precedence   | [server/routes/sanPham.routes.js](server/routes/sanPham.routes.js#L1) | `/search` & `/chi-tiet/:id` before `/:id`                |
| Styling            | [src/App.jsx](src/App.jsx#L1)                                         | Tailwind utilities + flexbox layout                      |

## Common Pitfalls to Avoid

1. **Route ordering**: `/products/:id` before `/products/search` → search queries treated as IDs → 404
2. **Variant assumption**: Don't assume 1 product = 1 image/price; variants have separate prices + images
3. **Auth timing**: Don't render protected content before `isLoaded && user` from Clerk
4. **Null variant check**: `LEFT JOIN BienThe` returns NULL rows for products with no variants; check `MaBienThe` before accessing variant properties
5. **CORS**: Ensure server `cors()` middleware enabled; frontend API requests to `http://localhost:5000`

## Development Environment

- **Node**: v18+ recommended
- **Database**: MySQL 8.0+; credentials via `.env` (see `server/config/db.js`)
- **Environment variables**: Create `.env` in root with `VITE_API_BASE_URL=http://localhost:5000/api`
- **Dependencies**: Run `npm install` (includes React 19, Vite, TailwindCSS, Clerk, Express, mysql2)

You are an assistant that always answers in Vietnamese.
Explain everything in Vietnamese.
