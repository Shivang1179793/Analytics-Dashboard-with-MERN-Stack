import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './index';

function Product() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/dashboard" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default Product;