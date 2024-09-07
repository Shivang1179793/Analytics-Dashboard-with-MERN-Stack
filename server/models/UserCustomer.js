import mongoose from "mongoose";
import { Registration } from "./registration.js";
const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    country: String,
    occupation: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true }
}, { timestamps: true });
const UserCustomer = mongoose.model("UserCustomer", customerSchema);
export default UserCustomer; 