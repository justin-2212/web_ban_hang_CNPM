// src/pages/Home.jsx
import Hero from "../components/Hero";
import Category from "../components/Category";
import ProductsTrend from "../components/ProductsTrend";
import Services from "../components/Services";
import Reviews from "../components/Reviews";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Category />
      {/* <ProductsTrend /> */}
      <Services />
      <Reviews />
      <Newsletter />
    </>
  );
}