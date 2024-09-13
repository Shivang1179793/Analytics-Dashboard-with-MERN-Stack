import React, { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const theme = useTheme();

  const [formattedData, setFormattedData] = useState([]);

  // Function to format date in "dd-mm" format
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    return `${day}-${month}`;
  };

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/transaction-fields?page=0&pageSize=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the JWT token to the headers
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { transactions } = await response.json();

      const totalSalesLine = {
        id: "totalSales",
        color: theme.palette.secondary.main,
        data: [],
      };

      const totalProductsLine = {
        id: "totalProducts",
        color: theme.palette.secondary[600],
        data: [],
      };

      transactions.forEach(({ createdAt, cost, product }) => {
        if (createdAt && cost !== undefined && product !== undefined) {
          const dateFormatted = new Date(createdAt);

          // Check if the date is within the selected range
          if (dateFormatted >= startDate && dateFormatted <= endDate) {
            const splitDate = formatDate(dateFormatted);
            const productInt = parseInt(product, 10);

            // Ensure that both x and y values are valid before pushing
            if (!isNaN(productInt) && cost !== null) {
              totalSalesLine.data.push({ x: splitDate, y: cost || 0 });
              totalProductsLine.data.push({ x: splitDate, y: productInt || 0 });
            } else {
              console.warn(
                `Skipped invalid data: product = ${product}, cost = ${cost}, createdAt = ${createdAt}`
              );
            }
          }
        }
      });

      // Check if the data is valid before updating the state
      if (totalSalesLine.data.length > 0 && totalProductsLine.data.length > 0) {
        setFormattedData([totalSalesLine, totalProductsLine]);
      } else {
        console.warn("No valid data to display in the chart");
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  // Use useEffect to call fetchData initially and on date changes
  useMemo(() => {
    fetchData();
  }, [startDate, endDate]); // Fetch data whenever startDate or endDate changes

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales and products" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>

        {formattedData.length ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: { line: { stroke: theme.palette.secondary[200] } },
                legend: { text: { fill: theme.palette.secondary[200] } },
                ticks: {
                  line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
                  text: { fill: theme.palette.secondary[200] },
                },
              },
              legends: {
                text: { fill: theme.palette.secondary[200] },
              },
              tooltip: {
                container: { color: theme.palette.primary.main },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Date",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Value",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
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
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Daily;
