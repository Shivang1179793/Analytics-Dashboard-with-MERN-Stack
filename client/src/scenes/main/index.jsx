import React,{useRef} from 'react';
import {useState,useEffect} from 'react';
import jsPDF from "jspdf";
import axios from 'axios';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic
} from "@mui/icons-material";
import {Box,Button,Typography,useTheme,useMediaQuery} from "@mui/material";
import BreakdownCharts from 'components/BreakdownCharts';
import OverviewCharts from 'components/OverviewCharts';
import StatBox from "components/StatBox";
import { DataGrid } from "@mui/x-data-grid";
const Main = () => {
  const theme=useTheme();
  const isNonMediumScreens=useMediaQuery("(min-width:1200px)");
  const breakdownChartRef = useRef();
  const [nameCount, setNameCount] = useState(0);
  const [currentYearCount, setCurrentYearCount] = useState(0);
  const fetchd = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/customers/getcustomers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const count = response.data.filter(item => item.name).length;
        setNameCount(count);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchd();
  }, []);
  const [transactionss, setTransactionss] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [currentMonthCount, setCurrentMonthCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, sort, search]);
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/transactions`, {
        params: { page, pageSize, sort: JSON.stringify(sort), search },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactionss(data.transactions);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthCount = data.transactions.filter(transaction => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      }).length;
      setCurrentMonthCount(currentMonthCount);
      const currentYearCount = data.transactions.filter(transaction => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt.getFullYear() === currentYear;  // Compare only the year
      }).length;
      setCurrentYearCount(currentYearCount);
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      const todayCount = data.transactions.filter(transaction => {
        const createdAt = new Date(transaction.createdAt);
        return (
          createdAt.getFullYear() === todayYear &&
          createdAt.getMonth() === todayMonth &&
          createdAt.getDate() === todayDay
        );
      }).length;
      setTodayCount(todayCount);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  const columns = [
    { field: "id", headerName: "S.No", flex: 1,renderCell: (params) => params.row._id, },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "cost", headerName: "Cost", flex: 1, renderCell: (params) => `$${Number(params.value).toFixed(2)}` },
    { field: "createdAt", headerName: "Created At", flex: 1 }
  ];
  const [dataa, setData] = useState(null);
  useEffect(() => {
    const fetchDataa = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/transaction-fields`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setData(response.data.transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataa();
  }, []);

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Dashboard Report", 10, 10);
  };
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
          value={nameCount}
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
          value={todayCount}
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
          <OverviewCharts data={dataa} view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Monthly Sales"
          value={currentMonthCount}
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
          value={currentYearCount}
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
          loading={!transactionss.length}
          getRowId={(row) => row._id} // Use the _id field as the unique id
          rows={transactionss}
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
          <BreakdownCharts transactions={transactions} yearlySalesTotal={yearlySalesTotal} isDashboard={true} />
          <Typography p="0 0.6rem" fontSize="0.8rem" sx={{color:theme.palette.secondary[200]}}>
            Breakdown of real state and information via category for revenue made for this year and total sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default Main;