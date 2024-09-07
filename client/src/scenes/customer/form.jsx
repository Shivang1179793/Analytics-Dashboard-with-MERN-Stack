import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [occupation, setOccupation] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = () => {
            const token = localStorage.getItem('token'); // Get token from local storage or wherever it's stored
            axios.post(`${process.env.REACT_APP_BASE_URL}/customers/add`, {
                name,
                email,
                phoneNumber,
                country,
                occupation,
            }, 
            {headers: { Authorization: `Bearer ${token}` }}
        ).then(()=>{
            setName('');
            setEmail('');
            setPhoneNumber('');
            setCountry('');
            setOccupation('');
            setId('');
            navigate('/admin/customers');
        }).catch (error =>
            console.error('Error adding customer:', error));

    };
    return (
        <Box m="1.5rem 2.5rem">
            <Typography variant="h4">Add Customer</Typography>
            <Box mt="20px" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                <TextField label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: '20px' }}>
                    Add Customer
                </Button>
            </Box>
        </Box>
    );
};

export default AddCustomer;
