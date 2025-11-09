// src/pages/Home.jsx
import Hero from "../sections/Hero";
import Category from "../sections/Category";
import ProductsGrid from "../sections/ProductsGrid";
import Banner from "../sections/Banner";
import Services from "../sections/Services";
import Reviews from "../sections/Reviews";
import Newsletter from "../sections/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Banner />
      <Category />
      <ProductsGrid />
      <Services />
      <Reviews />
      <Newsletter />
    </>
  );
}