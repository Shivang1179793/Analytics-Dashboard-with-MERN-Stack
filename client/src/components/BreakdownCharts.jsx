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

  const formattedData = transactions.reduce((acc, { name, cost }, index) => {
    const categoryIndex = acc.findIndex((item) => item.id === name);
    if (categoryIndex !== -1) {
      acc[categoryIndex].value += cost;
    } else {
      acc.push({
        id: name,
        label: name,
        value: cost,
        color: colors[index % colors.length],
      });
    }
    return acc;
  }, []);

  return (
    <Box
      height="100%"
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: { line: { stroke: theme.palette.secondary[200] } },
            ticks: { line: { stroke: theme.palette.secondary[200], strokeWidth: 1 }, text: { fill: theme.palette.secondary[200] } },
          },
          legends: { text: { fill: theme.palette.secondary[200] } },
          tooltip: { container: { color: theme.palette.primary.main } },
        }}
        colors={{ datum: "data.color" }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.45}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLinkLabels={true}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 56,
            itemWidth: 85,
            itemHeight: 18,
            symbolSize: 18,
            symbolShape: "circle",
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <Typography variant="h6">Total: ${yearlySalesTotal}</Typography>
      </Box>
    </Box>
  );
};

export default BreakdownCharts;