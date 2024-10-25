import React, { useState, useEffect } from 'react';
import { Box, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import OverviewCharts from "components/OverviewCharts";
import Header from "components/Header";
import axios from "axios";

const OverviewSales = () => {
  const [view, setView] = useState("units");
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/transaction-fields`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setData(response.data.transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="OVERVIEW" subtitle="Overview of general revenue and profit" />
      <Box height="75vh">
        <FormControl sx={{ mt: "1rem" }}>
          <InputLabel>View</InputLabel>
          <Select value={view} label="View" onChange={(e) => setView(e.target.value)}>
            <MenuItem value="sales">Sales</MenuItem>
            <MenuItem value="units">Units</MenuItem>
          </Select>
        </FormControl>
        {data && <OverviewCharts data={data} view={view} />}
      </Box>
    </Box>
  );
}

export default OverviewSales;
