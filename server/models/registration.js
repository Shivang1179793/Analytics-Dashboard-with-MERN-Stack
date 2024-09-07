import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    occupation: { type: String },
    email: { type: String, required: true, unique: true },  // Ensure email is unique
    password: { type: String, required: true },
});

// Method to generate auth token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: '7d' });
    return token;
};

// Create the model
export const Registration = mongoose.model('Registration', userSchema);

// Validation schema
export const validates = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('First Name'),
        lastName: Joi.string().required().label('Last Name'),
        occupation: Joi.string().optional().label('Occupation'),  // Make occupation optional
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label('Password'),
    });
    return schema.validate(data);  // Correct method call
};
