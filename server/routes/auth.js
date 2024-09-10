import { Router } from 'express';
const router = Router();
import { Registration } from '../models/registration.js';
import { validates } from "../models/registration.js"
import bcrypt from 'bcrypt';
import Joi from 'joi';
// login Route
router.post("/login", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await Registration.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        res.status(200).send({
            token,
            firstName: user.firstName,
            occupation: user.occupation,
            message: "Logged in successfully"
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};
export default router;