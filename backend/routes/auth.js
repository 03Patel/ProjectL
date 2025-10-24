import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


router.post('/signup',
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is reuired")
            .isLength({ min: 3 }).withMessage("Name must be at least 3 Character"),

        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email adress"),

        body('password')
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 6 }).withMessage("password must be at least 6 characters")
            .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
            .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
            .matches(/\d/).withMessage("Password must contain at least one number")
            .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),
    ],

    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email exists" });

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, passwordHash });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
)


router.post('/login',
    async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid Credentails" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
)


export default router;

