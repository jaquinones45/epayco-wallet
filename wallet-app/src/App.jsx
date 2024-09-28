import React, { useEffect } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';

import { useAuthStore } from './store';

import Navbar from './components/layout/Navbar';

import LoginView from './modules/auth/login/view';
import ClientsListView from './modules/clients/list/view';
import ProductsListView from './modules/products/list/view';
import ProductsHomeView from './modules/products/home/view';

import './App.css';

function App() {
  const { user, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, []);

  if (user?.role === 'client') {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductsHomeView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (user?.role === 'admin') {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/clients"
            element={<ClientsListView />}
          />
          <Route
            path="/products"
            element={<ProductsListView />}
          />
          <Route path="*" element={<Navigate to="/clients" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
