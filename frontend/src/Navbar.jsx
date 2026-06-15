import React from "react";
import { Link } from "react-router-dom";

// Enkel Navbar-komponent med tre länkar: Home, Sök Jobb och CV
// Kommentarer på svenska enligt projektreglerna.
export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-brand-700">
          JobApp
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Sök Jobb
          </Link>
          <Link
            to="/cv"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            CV
          </Link>
        </div>
      </div>
    </nav>
  );
}
