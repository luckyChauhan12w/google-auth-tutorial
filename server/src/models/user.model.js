import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyOtp: {
        type: String,
        default: "",
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
        index: true,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    resetOtp: {
        type: String,
        default: "",
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
        index: true,
    },
}, {
    timestamps: true,
    index: [
        { email: 1, isAccountVerified: 1 },
        { email: 1, resetOtpExpireAt: 1 },
        { _id: 1, verifyOtpExpireAt: 1 }
    ]
});

userSchema.pre("save", async function () {
    if (this.isModified("password") && !this.password.startsWith('$2a$')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

userSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], async function () {
    const update = this.getUpdate();

    if (update.password && !update.password.startsWith('$2a$')) {

        update.password = await bcrypt.hash(update.password, 12);
    }
});


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const User = mongoose.model("User", userSchema);
export default User;
