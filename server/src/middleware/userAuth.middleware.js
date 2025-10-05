import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

const userAuth = asyncHandler(async (req, _, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized User");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        throw new ApiError(401, "Unauthorized User");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "Unauthorized User");
    }

    req.body = req.body || {};
    req.body.userId = decoded.id;
    req.user = user;
    next();

})

export { userAuth }