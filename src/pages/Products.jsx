// src/pages/Products.jsx
import ProductsGrid from "../sections/ProductsGrid";
import Category from "../sections/Category";

export default function Products() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Tất cả sản phẩm</h1>
      <Category />
      <ProductsGrid />
    </div>
  );
}