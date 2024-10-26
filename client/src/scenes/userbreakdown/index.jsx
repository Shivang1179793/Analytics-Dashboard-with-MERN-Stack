import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import Header from "components/Header";
import BreakdownCharts from "components/BreakdownCharts";
import axios from 'axios';

const BreakdownSales = () => {
  const [yearlySalesTotal, setYearlySalesTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/transaction-fields`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTransactions(response.data.transactions);
        const totalCost = response.data.transactions.reduce((acc, item) => acc + item.cost, 0);
        setYearlySalesTotal(totalCost);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="BREAKDOWN" subtitle="Breakdown of Sales by Category" />
      <Box mt="40px" height="75vh">
        <BreakdownCharts transactions={transactions} yearlySalesTotal={yearlySalesTotal} />
      </Box>
    </Box>
  );
}

export default BreakdownSales;
