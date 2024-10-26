import { Router } from 'express';
import UserTransaction from "../models/UserTransactions.js";
import jwt from "jsonwebtoken";
const router = Router();

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
// Create a transaction
router.post('/transactions', authenticateToken, async (req, res) => {
    try {
        const transaction = new UserTransaction({
            ...req.body,
            userId: req.user._id,
            createdAt: req.body.createdAt || Date.now()  // Use provided date or current date
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Get transactions for a user
router.get('/transactions', authenticateToken, async (req, res) => {
    const { page = 0, pageSize = 20, sort = {}, search = "" } = req.query;
    const query = { userId: req.user._id };

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    try {
        const transactions = await UserTransaction.find(query)
            .sort(sort)
            .skip(page * pageSize)
            .limit(Number(pageSize))
        const total = await UserTransaction.countDocuments(query);
        res.json({ transactions, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a transaction
router.delete('/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/transaction-fields', authenticateToken, async (req, res) => {
    const { page = 0, pageSize = 20, sort = {}, search = "" } = req.query;
    const query = { userId: req.user._id };

    if (search) {
        query.product = { $regex: search, $options: 'i' }; // Search by product name
    }

    try {
        const transactions = await UserTransaction.find(query)
            .sort(sort)
            .skip(page * pageSize)
            .limit(Number(pageSize));

        // Format the data to include only product, cost, and createdAt
        const formattedTransactions = transactions.map(transaction => ({
            name: transaction.name,
            product: transaction.product,
            cost: transaction.cost,
            createdAt: transaction.createdAt.toISOString(), // Convert to ISO string
        }));

        const total = await UserTransaction.countDocuments(query);
        res.json({ transactions: formattedTransactions, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;