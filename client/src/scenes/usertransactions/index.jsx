import React, { useState, useEffect } from 'react';
import { Box, useTheme, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, sort, search]);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}api/transactions`, {
        params: { page, pageSize, sort: JSON.stringify(sort), search },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}api/transactions/${_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchTransactions(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const columns = [
    { field: "id", headerName: "S.No", flex: 1,renderCell: (params) => params.row._id, },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "cost", headerName: "Cost", flex: 1, renderCell: (params) => `$${Number(params.value).toFixed(2)}` },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/addtransaction')}
        sx={{ mb: 2 }}
      >
        Add Transaction
      </Button>
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: theme.palette.background.alt, color: theme.palette.secondary[100], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: theme.palette.primary.light },
          "& .MuiDataGrid-footerContainer": { backgroundColor: theme.palette.background.alt, color: theme.palette.secondary[100], borderTop: "none" },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${theme.palette.secondary[200]} !important` },
        }}
      >
        <DataGrid
          loading={!transactions.length}
          getRowId={(row) => row._id} // Use the _id field as the unique id
          rows={transactions}
          columns={columns}
          rowCount={total}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0);
          }}
          onSortModelChange={(newSortModel) => setSort(newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{ toolbar: { searchInput, setSearchInput, setSearch } }}
        />
      </Box>
    </Box>
  );
};

export default Index;
