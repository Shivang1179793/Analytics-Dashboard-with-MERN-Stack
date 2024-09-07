import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './index';

function Customerss() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/customers" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default Customerss;