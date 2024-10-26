import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";

const BreakdownCharts = ({ transactions, yearlySalesTotal }) => {
  const theme = useTheme();

  const colors = [
    theme.palette.secondary[500],
    theme.palette.secondary[300],
    theme.palette.secondary[100],
    theme.palette.secondary[700],
  ];

  const formattedData = transactions.reduce((acc, { name, cost }) => {
    if (!name || typeof cost !== 'number') {
      console.warn("Skipping invalid entry:", { name, cost });
      return acc;
    }
  
    const category = acc.find((item) => item.id === name);
    if (category) {
      category.value += cost;
    } else {
      acc.push({
        id: name,
        label: name,
        value: cost,
        color: colors[acc.length % colors.length],
      });
    }
    console.log("Current acc:", JSON.stringify(acc, null, 2));
    return acc;
  }, []);
  
  console.log("Final formattedData:", JSON.stringify(formattedData, null, 2));

  return (
    <Box height="100%" position="relative">
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: { line: { stroke: theme.palette.secondary[200] } },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: { line: { stroke: theme.palette.secondary[200], strokeWidth: 1 }, text: { fill: theme.palette.secondary[200] }, },
          },
          legends: { text: { fill: theme.palette.secondary[200] } },
          tooltip: { container: { color: theme.palette.primary.main } },
        }}
        colors={{ datum: "data.color" }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLinkLabels={true}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX:0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{ transform: "translate(-50%, -100%)" }}
      >
        <Typography variant="h6">Total: ${yearlySalesTotal}</Typography>
      </Box>
    </Box>
  );
};

export default BreakdownCharts;
