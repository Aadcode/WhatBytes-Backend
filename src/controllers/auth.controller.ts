
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiReponse";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return next(new ApiError(400, "User Already Exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email };
    res.status(201).send(new ApiResponse(201, "User Created Successfully", userResponse));
});


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
        return next(new ApiError(404, "User Not Found"));
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return next(new ApiError(401, "Please Enter Correct Password"));
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });


    res.status(200).send(new ApiResponse(200, "User Logged In successfully", { "accessToken": token }))
});
