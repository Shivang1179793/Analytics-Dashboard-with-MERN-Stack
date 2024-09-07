import jwt from "jsonwebtoken";
import { Router } from 'express';
import UserCustomer from "../models/UserCustomer.js";
const router = Router();
// Add Customer
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) return res.status(401).send('Access Denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = { _id: decoded._id }; // Set req.user correctly
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};


router.post('/add', verifyToken, async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const newCustomer = new UserCustomer({
            ...req.body,
            userId: req.user._id
        });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Error adding customer', error });
    }
});

// Get Customers
router.get('/getcustomers', verifyToken, async (req, res) => {
    try {
        const customers = await UserCustomer.find({ userId: req.user._id });
        res.status(200).json(customers);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching customers', error });
    }
});

// Delete Customer
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const customer = await UserCustomer.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting customer', error });
    }
});
export default router;