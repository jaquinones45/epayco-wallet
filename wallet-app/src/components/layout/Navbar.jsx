import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

import { useAuthStore } from '../../store';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between bg-zinc-800 p-4 relative">
      <img src={logo} alt="Logo" className="h-12" />
      {
        user?.role === 'admin' && (
          <div className={`flex-col md:flex md:flex-row md:items-center md:space-x-4 absolute md:static bg-zinc-800 w-full md:w-auto transition-transform duration-300 ${isMenuOpen ? 'top-16' : '-top-96'}`}>
            <Link to="/clients" className="text-white p-2 hover:bg-zinc-700 rounded">Clientes</Link>
            <Link to="/products" className="text-white p-2 hover:bg-zinc-700 rounded">Productos</Link>
          </div>
        )
      }
      <div>
        {!user ? (
          <Link to="/login" className="text-white p-2 hover:bg-zinc-700 rounded">Login</Link>
        ) : (
          <button onClick={logout} className="text-white p-2 hover:bg-zinc-700 rounded">Logout</button>
        )}
      </div>
      <button className="md:hidden text-white" onClick={toggleMenu}>
        ☰
      </button>
    </nav>
  );
};

export default Navbar;
