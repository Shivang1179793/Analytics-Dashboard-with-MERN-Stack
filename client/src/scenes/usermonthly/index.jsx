import React, { useMemo, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";

const MonthlySales = () => {
  const [data, setData] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/transaction-fields`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setData(response.data.transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const monthlyData = {};

    data.forEach(({ createdAt, cost, product }) => {
      const date = new Date(createdAt);
      const month = date.toLocaleString("default", { month: "long" });

      if (!monthlyData[month]) {
        monthlyData[month] = { totalSales: 0, totalUnits: 0 };
      }

      monthlyData[month].totalSales += cost;
      monthlyData[month].totalUnits += parseInt(product, 10);
    });

    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: Object.keys(monthlyData).map(month => ({ x: month, y: monthlyData[month].totalSales })),
    };

    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: Object.keys(monthlyData).map(month => ({ x: month, y: monthlyData[month].totalUnits })),
    };

    return [[totalSalesLine, totalUnitsLine]];
  }, [data, theme]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
      <Box height="75vh">
        {data ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: { domain: { line: { stroke: theme.palette.secondary[200] } }, legend: { text: { fill: theme.palette.secondary[200] } }, ticks: { line: { stroke: theme.palette.secondary[200], strokeWidth: 1 }, text: { fill: theme.palette.secondary[200] } }},
              legends: { text: { fill: theme.palette.secondary[200] } },
              tooltip: { container: { color: theme.palette.primary.main } },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
            yFormat=" >-.2f"
            axisBottom={{ orient: "bottom", tickSize: 5, tickPadding: 5, tickRotation: 90, legend: "Month", legendOffset: 60, legendPosition: "middle" }}
            axisLeft={{ orient: "left", tickSize: 5, tickPadding: 5, tickRotation: 0, legend: "Total", legendOffset: -50, legendPosition: "middle" }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[{
              anchor: "top-right",
              direction: "column",
              translateX: 50,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [{ on: "hover", style: { itemBackground: "rgba(0, 0, 0, .03)", itemOpacity: 1 } }],
            }]}
          />
        ) : "Loading..."}
      </Box>
    </Box>
  );
};

export default MonthlySales;
