import React, { useMemo } from "react";
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@emotion/react';

const OverviewCharts = ({ data, view }) => {
  const theme = useTheme();

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return [];

    const totalSalesData = {}; // To accumulate total sales per month
    const totalUnitsData = {}; // To accumulate total units per month
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    data.forEach(({ createdAt, cost, product }) => {
      const dateFormatted = new Date(createdAt);
      const month = monthNames[dateFormatted.getMonth()];

      // Aggregate sales
      if (!totalSalesData[month]) totalSalesData[month] = 0;
      totalSalesData[month] += cost;

      // Aggregate units
      if (!totalUnitsData[month]) totalUnitsData[month] = 0;
      totalUnitsData[month] += parseInt(product, 10);
    });

    // Format data for Nivo chart
    const totalSalesLine = { id: "Total Sales", color: theme.palette.secondary.main, data: [] };
    const totalUnitsLine = { id: "Total Units", color: theme.palette.secondary[600], data: [] };

    Object.keys(totalSalesData).forEach(month => {
      totalSalesLine.data.push({ x: month, y: totalSalesData[month] });
    });
    Object.keys(totalUnitsData).forEach(month => {
      totalUnitsLine.data.push({ x: month, y: totalUnitsData[month] });
    });

    return [totalSalesLine, totalUnitsLine];
  }, [data, theme]);

  return data ? (
    <ResponsiveLine
      data={view === "sales" ? [totalSalesLine] : [totalUnitsLine]}
      theme={{
        axis: {
          domain: { line: { stroke: theme.palette.secondary[200] } },
          legend: { text: { fill: theme.palette.secondary[200] } },
          ticks: { line: { stroke: theme.palette.secondary[200], strokeWidth: 1 }, text: { fill: theme.palette.secondary[200] } },
        },
        legends: { text: { fill: theme.palette.secondary[200] } },
        tooltip: { container: { color: theme.palette.primary.main } },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={false}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: view === "sales" ? "Total Sales" : "Total Units",
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 30,
          translateY: -40,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  ) : (
    "Loading..."
  );
};

export default OverviewCharts;
