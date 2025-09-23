import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";

const registerUser = asyncHandler(async (req, res) => {

    console.log(req.body)

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (user) {
        throw new ApiError(400, "User already exists");
    }

    const newUser = await User.create({ name, email, password });

    const token = newUser.generateToken();

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    const userWithoutPassword = {
        ...newUser._doc,  // spread all fields from the Mongoose document
        password: undefined  // override password to remove it
    }

    // sending welcome message 
    const result = await sendEmail(
        email,
        "Welcome to our app",
        `Hello ${name}, welcome to our app!`
    );

    // console.log(result)  // for debuging purpose

    if (!result.success) {
        throw new ApiError(500, result.error, "Failed to send email");
    }

    return res.status(201).json(new ApiResponse(201, "User registered successfully", userWithoutPassword))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Email not found");
    }

    const isPasswordValid = user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials");
    }

    const userWithoutPassword = {
        ...user._doc,
        password: undefined
    }

    const token = user.generateToken();

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(new ApiResponse(200, "User logged in successfully", userWithoutPassword))

})

const userLogout = asyncHandler(async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 0
    });

    return res.status(200).json(new ApiResponse(200, "User logged out successfully"))

})

// Send the Verification OTP to the User's Email
const sendVerifyOtp = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000;

    await user.save();

    const result = await sendEmail(
        user.email,
        "Verify your email",
        `Your OTP is ${otp}`
    );

    // console.log(result)

    if (!result.success) {
        throw new ApiError(500, result.error, "Failed to send email");
    }

    return res.status(200).json(new ApiResponse(200, "OTP sent successfully", { otp }))

})

const verifyEmail = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body;

    // console.log(req.body)

    if (!userId || !otp) {
        throw new ApiError(400, "User ID and OTP are required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.verifyOtp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.verifyOtpExpireAt < Date.now()) {
        throw new ApiError(400, "Invalid OTP because it expired");
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Email verified successfully"))
})



export {
    registerUser,
    loginUser,
    userLogout,
    sendVerifyOtp,
    verifyEmail
}