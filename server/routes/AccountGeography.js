import { Router } from 'express';
import UserCustomer from '../models/UserCustomer.js'; // Adjust path as needed

const router = Router();

router.get('/geography', async (req, res) => {
    try {
        const customers = await UserCustomer.find().select('country'); // Fetch only the country field
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch customers' });
    }
});
export default router;
