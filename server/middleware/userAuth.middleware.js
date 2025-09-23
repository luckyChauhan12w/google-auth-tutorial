import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const userAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    // console.log(token)

    if (!token) {
        throw new ApiError(401, "Token not found");
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        throw new ApiError(401, "Unauthorized User");
    }
    // console.log(decoded.id)
    req.body = req.body || {};
    req.body.userId = decoded.id;

    // console.log("userAuth middleware", req.body)
    next();

})

export { userAuth }