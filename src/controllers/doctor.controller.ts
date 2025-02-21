import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiReponse";
import ApiError from "../utils/ApiError";
import Doctor from "../models/doctor.model";

export const createDoctor = asyncHandler(async (req, res, next) => {
    const { name, email, phone, specialization } = req.body;

    if (!name || !email || !phone || !specialization) {
        return next(new ApiError(400, "All fields are required"));
    }
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const doctorData = {
        name,
        email,
        phone,
        specialization,
        createdBy: req.user?.id
    };


    const newDoctor = await Doctor.create(doctorData);

    res.status(201).json(new ApiResponse(201, "Doctor created successfully", newDoctor));
});

export const getDoctors = asyncHandler(async (req, res, next) => {
    const doctors = await Doctor.findAll();
    res.status(200).json(new ApiResponse(200, "Doctors fetched successfully", doctors));
});

export const getDoctorById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ApiError(401, "No Doctor Find"));
    }
    const doctor = await Doctor.findOne({ where: { id } });
    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }
    res.status(200).json(new ApiResponse(200, "Doctor fetched successfully", doctor));
});


export const updateDoctorById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;
    const { name, phone, specialization } = req.body;

    if (!id || !userId) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const doctor = await Doctor.findOne({ where: { id, createdBy: userId } });

    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }

    await doctor.update({
        name: name ?? doctor.name,
        phone: phone ?? doctor.phone,
        specialization: specialization ?? doctor.specialization,

    });

    const updatedDoctor = await Doctor.findOne({ where: { id, createdBy: userId } });

    res.status(200).json(new ApiResponse(200, "Doctor updated successfully", updatedDoctor));
});


export const deleteDoctorById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;

    if (!id || !userId) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const doctor = await Doctor.findOne({ where: { id, createdBy: userId } });

    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }

    await Doctor.destroy({ where: { id, createdBy: userId } });

    res.status(200).json(new ApiResponse(200, "Doctor deleted successfully"));
});
