import userModel from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, "User fetched successfully", { name: user.name, email: user.email, isAccountVerified: user.isAccountVerified }));
});


export { getUser }
