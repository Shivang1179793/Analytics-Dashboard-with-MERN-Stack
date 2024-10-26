import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "./theme";
import Dashboard from "./scenes/dashboard";
import Layout from "./scenes/layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin"
import Performance from "scenes/performance";
import Login from "scenes/login";
import Signup from "scenes/Signup";
import Main from "scenes/product";
import Layouts from "scenes/layouts";
import Logout from "scenes/logout";
import Product from "./scenes/product";
import AddProduct from "scenes/product/add";
import AddCustomer from "scenes/customer/form";
import Customerss from "scenes/customer/index";
import Index from "scenes/usertransactions/index";
import AddTransaction from "scenes/usertransactions/add";
import UserGeography from "scenes/usergeography";
import DailySales from "scenes/userdailysales";
import OverviewSales from "scenes/userOverview";
import MonthlySales from "scenes/usermonthly";
import BreakdownSales from "scenes/userbreakdown";
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* layout for not removing an navbar and sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<Layouts />}>
              <Route path="/admin/dashboard" element={<Main />} />
              <Route path="/admin/logout" element={<Logout />} />
              <Route path="/admin/products" element={<Product />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/addcustomers" element={<AddCustomer />} />
              <Route path="/addtransaction" element={<AddTransaction />} />
              <Route path="/admin/customers" element={<Customerss />} />
              <Route path="/admin/transactions" element={<Index />} />
              <Route path="/admin/geography" element={<UserGeography />} />
              <Route path="/admin/overview" element={<OverviewSales />} />
              <Route path="/admin/daily" element={<DailySales />} />
              <Route path="/admin/monthly" element={<MonthlySales />} />
              <Route path="/admin/breakdown" element={<BreakdownSales />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Main />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
