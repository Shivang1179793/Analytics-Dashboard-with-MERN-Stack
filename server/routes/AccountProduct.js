import jwt from "jsonwebtoken";
import { Router } from 'express';
import UserProduct from "../models/UserProduct.js";
const router = Router();

// Middleware to verify token and get user ID
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) return res.status(401).send('Access Denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.userId = decoded._id;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};
// Add Product
router.post('/addProduct', authenticateToken, async (req, res) => {
    const { name, price, description, supply, stat } = req.body;

    if (!name || !price || supply == null) {
        return res.status(400).send('Required product fields are missing.');
    }

    try {
        let userProduct = await UserProduct.findOne({ user: req.userId });
        if (!userProduct) {
            userProduct = new UserProduct({ user: req.userId, products: [] });
        }

        userProduct.products.push({ name, price, description, supply, stat });
        await userProduct.save();
        res.status(201).json({ message: 'Product added', product: userProduct });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete Product
router.post('/deleteProduct', authenticateToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Product name is required.');
    }

    try {
        const userProduct = await UserProduct.findOne({ user: req.userId });
        if (!userProduct) return res.status(404).send('User products not found.');

        userProduct.products = userProduct.products.filter(p => p.name !== name);
        await userProduct.save();
        res.json({ message: 'Product deleted', products: userProduct.products });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get Products
router.get('/getProducts', authenticateToken, async (req, res) => {
    try {
        const userProduct = await UserProduct.findOne({ user: req.userId });
        if (!userProduct) return res.status(404).send('No products found for this user.');
        res.json(userProduct.products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;
