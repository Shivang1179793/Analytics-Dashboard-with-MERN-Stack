import mongoose from "mongoose";
import { Registration } from "./registration.js";
const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    product: { type: String, required: true },
    cost: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
    createdAt: { type: Date, default: Date.now }, // Use provided date or default
}, { timestamps: true });
const UserTransaction = mongoose.model('UserTransaction', transactionSchema);
export default UserTransaction; 