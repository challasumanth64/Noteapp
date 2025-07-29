import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Adjust path if necessary
import Otp from '../models/Otp';   // Adjust path if necessary
import { sendOtpEmail } from '../utils/mailer'; // Assuming you have a mailer utility

const router = express.Router();

// --- Helper function to generate and send OTP ---
const generateAndSendOtp = async (email: string) => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set OTP to expire in 10 minutes
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Store or update the OTP in the database
    await Otp.findOneAndUpdate({ email }, { otp, expires }, { upsert: true, new: true, setDefaultsOnInsert: true });

    // Send the OTP via email
    await sendOtpEmail(email, otp);
};

// --- Route to SEND/RESEND OTP for both Login and Signup ---
router.post('/send-otp', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        await generateAndSendOtp(email);
        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
});

router.post('/resend-otp', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        await generateAndSendOtp(email);
        res.status(200).json({ message: 'OTP re-sent successfully.' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Error resending OTP.' });
    }
});

// --- Route for SIGNUP verification and user creation ---
router.post('/verify-otp', async (req: Request, res: Response) => {
    try {
        const { email, otp, name, dob, password } = req.body;

        const otpEntry = await Otp.findOne({ email, otp });
        if (!otpEntry || otpEntry.expires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, name, dob, password: hashedPassword });
        await newUser.save();

        await Otp.deleteOne({ _id: otpEntry._id }); // Clean up used OTP

        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error('Signup verification error:', error);
        res.status(500).json({ message: 'Server error during verification.' });
    }
});

// --- Route for LOGIN ---
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up.' });
        }

        const otpEntry = await Otp.findOne({ email, otp });
        if (!otpEntry || otpEntry.expires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        await Otp.deleteOne({ _id: otpEntry._id }); // Clean up used OTP

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

export default router;