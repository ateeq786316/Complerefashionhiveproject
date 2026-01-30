import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaFacebookF,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "All Products", path: "/products" },
      { label: "Brands", path: "/brands" },
      { label: "New Arrivals", path: "/products?newArrival=true" },
      { label: "Best Sellers", path: "/products?bestSeller=true" },
    ],
    help: [
      { label: "Shipping Policy", path: "/policies" },
      { label: "Returns & Exchanges", path: "/policies" },
      { label: "FAQs", path: "/policies" },
      { label: "Contact Us", path: "/policies" },
    ],
    company: [
      { label: "About Us", path: "/" },
      { label: "Careers", path: "/" },
      { label: "Press", path: "/" },
      { label: "Sustainability", path: "/" },
    ],
  };

  const socialLinks = [
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaPinterest, href: "#", label: "Pinterest" },
    { icon: FaFacebookF, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-luxury-950 border-t border-luxury-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-serif font-bold text-gradient-gold">
                FashionHive
              </span>
              <span className="text-xs font-light text-gold-400 ml-1">AI</span>
            </Link>
            <p className="text-luxury-400 text-sm leading-relaxed mb-6 max-w-sm">
              Discover the world's finest luxury fashion brands, all in one
              place. Curated collections for the discerning fashion connoisseur.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@fashionhive.pk"
                className="flex items-center text-sm text-luxury-400 hover:text-gold-400 transition-colors"
              >
                <HiOutlineMail className="w-4 h-4 mr-3" />
                info@fashionhive.pk
              </a>
              <a
                href="tel:+924212345678"
                className="flex items-center text-sm text-luxury-400 hover:text-gold-400 transition-colors"
              >
                <HiOutlinePhone className="w-4 h-4 mr-3" />
                +92 42 1234 5678
              </a>
              <p className="flex items-center text-sm text-luxury-400">
                <HiOutlineLocationMarker className="w-4 h-4 mr-3" />
                Lahore, Punjab 54000, Pakistan
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-luxury-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-luxury-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-luxury-400 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Newsletter */}
        <div className="mt-12 pt-8 border-t border-luxury-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-luxury-800 text-luxury-400 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <input
                  type="email"
                  placeholder="Subscribe to our newsletter"
                  className="w-full px-4 py-3 pr-28 bg-luxury-900 border border-luxury-700 rounded-lg text-sm text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gold-500 text-luxury-950 text-sm font-medium rounded-md hover:bg-gold-400 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-luxury-500">
            <p>&copy; {currentYear} FashionHiveAI. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <Link
                to="/policies"
                className="hover:text-gold-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/policies"
                className="hover:text-gold-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/policies"
                className="hover:text-gold-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
