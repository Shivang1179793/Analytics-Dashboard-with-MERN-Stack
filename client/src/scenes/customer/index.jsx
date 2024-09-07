import React, { useEffect, useState } from 'react';
import { Box, useTheme, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';

const Index = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { field: "_id", headerName: "ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1, 
            renderCell: (params) => params.value.replace(/^(d{3})(d{3})(d{4})/, "($1)$2-$3") },
        { field: "country", headerName: "Country", flex: 1 },
        { field: "occupation", headerName: "Occupation", flex: 1 },
        { 
            field: "action", 
            headerName: "Action", 
            flex: 1, 
            renderCell: (params) => (
                <Button 
                    color="error" 
                    onClick={() => handleDelete(params.row._id)}
                >
                    Delete
                </Button>
            ) 
        },
    ];

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from local storage or wherever it's stored
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}customers/getcustomers`, {
                headers: { Authorization: `Bearer ${token}` }
            });            
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}customers/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setData(data.filter((row) => row._id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="CUSTOMERS" subtitle="List of Customers" />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/addcustomers')}
                sx={{ mb: '20px' }}
            >
                Add Customer
            </Button>
            <Box mt="40px" height="75vh" sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary[100],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: theme.palette.primary.light,
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary[100],
                    borderTop: "none"
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${theme.palette.secondary[200]} !important`,
                }
            }}>
                <DataGrid
                    loading={isLoading}
                    rows={data || []}
                    columns={columns}
                    getRowId={(row) => row._id}
                />
            </Box>
        </Box>
    );
};

export default Index;
