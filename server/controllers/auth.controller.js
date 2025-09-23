import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import transporter from "../config/nodemailer.js";

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

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to our Authentication App",
        text: `Hello ${name}, welcome to our app!`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " + info.response)
        }
    })

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


export { registerUser, loginUser, userLogout }