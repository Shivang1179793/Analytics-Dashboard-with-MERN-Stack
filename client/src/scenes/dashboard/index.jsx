import React,{useRef} from 'react';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic
} from "@mui/icons-material";
import {Box,Button,Typography,useTheme,useMediaQuery} from "@mui/material";
import BreakdownChart from 'components/BreakdownChart';
import OverviewChart from 'components/OverviewChart';
import { useGetDashboardQuery } from 'state/api';
import StatBox from "components/StatBox";
import { DataGrid } from "@mui/x-data-grid";
const Dashboard = () => {
  const theme=useTheme();
  const isNonMediumScreens=useMediaQuery("(min-width:1200px)");
  const {data,isLoading}=useGetDashboardQuery();
  const breakdownChartRef = useRef();
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Dashboard Report", 10, 10);
    doc.text(`Total Customers: ${data?.totalCustomers}`, 10, 20);
    doc.text(`Sales Today: ${data?.todayStats.totalSales}`, 10, 30);
    doc.text(`Monthly Sales: ${data?.thisMonthStats.totalSales}`, 10, 40);
    doc.text(`Yearly Sales: ${data?.yearlySalesTotal}`, 10, 50);

    const transactionData = data?.transactions || [];
    const tableColumn = ["ID", "User ID", "CreatedAt", "# of Products", "Cost"];
    const tableRows = [];

    transactionData.forEach(transaction => {
      const transactionData = [
        transaction._id,
        transaction.userId,
        transaction.createdAt,
        transaction.products.length,
        `$${Number(transaction.cost).toFixed(2)}`
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
    });
    html2canvas(breakdownChartRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      doc.addPage();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160);
      doc.save("dashboard_report.pdf");
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="welcome to your dashboard"/>
        <Box>
          <Button sx={{backgroundColor:theme.palette.secondary.light,color:theme.palette.background.alt,fontSize:"14px", fontWeight:"bold",padding:"10px 20px"}} onClick={downloadPdf}>
            <DownloadOutlined sx={{mr:"10px"}}/>
            Download Reports
          </Button>
        </Box>
      </FlexBetween>
      <Box mt="20px" display="grid" gridTemplateColumns="repeat(12,1fr)" gridAutoRows="160px" gap="20px" sx={{"&>div":{gridColumn:isNonMediumScreens ? undefined:"span 12"}}}>
        {/* ROW 1 */}
        <StatBox
          title="Total Customers"
          value={data && data.totalCustomers}
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales Today"
          value={data && data.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Monthly Sales"
          value={data && data.thisMonthStats.totalSales}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Yearly Sales"
          value={data && data.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/*ROW 2*/}
        <Box 
          gridColumn="span 8" 
          gridRow="span 3" 
          sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius:"5rem"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.alt,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}>
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row)=>row._id}
            rows={(data && data.transactions)|| []}
            columns={columns}
          />
        </Box>
        <Box 
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          ref={breakdownChartRef}
        >
          <Typography variant="h6" sx={{color:theme.palette.secondary[100]}}>
            Sales By Category
          </Typography>
          <BreakdownChart isDashboard={true}/>
          <Typography p="0 0.6rem" fontSize="0.8rem" sx={{color:theme.palette.secondary[200]}}>
            Breakdown of real state and information via category for revenue made for this year and total sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default Dashboard;