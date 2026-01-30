import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { CartProvider } from "./context/CartContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import BrandsPage from "./pages/BrandsPage";
import BrandProductsPage from "./pages/BrandProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import PoliciesPage from "./pages/PoliciesPage";
import AllProductsPage from "./pages/AllProductsPage";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brands/:brandSlug" element={<BrandProductsPage />} />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-luxury-950 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
