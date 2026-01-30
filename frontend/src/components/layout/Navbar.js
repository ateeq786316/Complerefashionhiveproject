import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineShoppingBag,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import { brandAPI } from "../../services/api";
import { countBadge, navMenuVariants } from "../../utils/animations";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandAPI.getAll();
        setBrands(response.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowBrandsDropdown(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Shop All" },
    { path: "/brands", label: "Brands", hasDropdown: true },
    { path: "/policies", label: "Help" },
  ];

  // Custom function to check if link is active
  const isLinkActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    // For product filter links, check both pathname and search params
    if (path.includes("?")) {
      return location.pathname + location.search === path;
    }

    // For regular paths, check if current path starts with this path
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-luxury-950/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span className="text-2xl md:text-3xl font-serif font-bold text-gradient-gold">
                FashionHive
              </span>
              <span className="text-xs md:text-sm font-light text-gold-400 ml-1">
                AI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() =>
                  link.hasDropdown && setShowBrandsDropdown(true)
                }
                onMouseLeave={() =>
                  link.hasDropdown && setShowBrandsDropdown(false)
                }
              >
                <NavLink
                  to={link.path}
                  className={() =>
                    `relative py-2 text-sm font-medium tracking-wide transition-colors ${
                      isLinkActive(link.path)
                        ? "text-gold-400"
                        : "text-luxury-200 hover:text-gold-400"
                    }`
                  }
                >
                  {link.label}
                </NavLink>

                {/* Brands Dropdown */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {showBrandsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-luxury-900 border border-luxury-700 rounded-lg shadow-xl overflow-hidden"
                      >
                        {brands.map((brand) => (
                          <Link
                            key={brand._id || brand.name}
                            to={`/brands/${brand.slug || brand.name}`}
                            className="block px-4 py-3 text-sm text-luxury-200 hover:bg-luxury-800 hover:text-gold-400 transition-colors capitalize"
                          >
                            {brand.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-luxury-200 hover:text-gold-400 transition-colors"
              >
                <HiOutlineShoppingBag className="w-6 h-6" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      variants={countBadge}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-luxury-950 text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-luxury-200 hover:text-gold-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={navMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-luxury-800">
                {navLinks.map((link) => (
                  <div key={link.path}>
                    <NavLink
                      to={link.path}
                      className={() =>
                        `block py-3 px-4 text-base font-medium rounded-lg transition-colors ${
                          isLinkActive(link.path)
                            ? "text-gold-400 bg-luxury-800/50"
                            : "text-luxury-200 hover:text-gold-400 hover:bg-luxury-800/30"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                    {/* Mobile brand sub-links */}
                    {link.hasDropdown && (
                      <div className="pl-4 mt-1 space-y-1">
                        {brands.map((brand) => (
                          <Link
                            key={brand._id || brand.name}
                            to={`/brands/${brand.slug || brand.name}`}
                            className="block py-2 px-4 text-sm text-luxury-400 hover:text-gold-400 transition-colors capitalize"
                          >
                            {brand.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
