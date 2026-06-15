import React from "react";
import { Link } from "react-router-dom";

// Enkel Navbar-komponent med tre länkar: Home, Sök Jobb och CV
// Kommentarer på svenska enligt projektreglerna.
export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6">
        <Link to="/" className="text-sm font-medium text-gray-700">
          Home
        </Link>
        <Link to="/jobs" className="text-sm font-medium text-gray-700">
          Sök Jobb
        </Link>
        <Link to="/cv" className="text-sm font-medium text-gray-700">
          CV
        </Link>
      </div>
    </nav>
  );
}
