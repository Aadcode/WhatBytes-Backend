import asyncHandler from "../utils/asyncHandler"
import Patient from "../models/patient.model"
import ApiResponse from "../utils/ApiReponse"
import ApiError from "../utils/ApiError";



export const CreatePatient = asyncHandler(async (req, res, next) => {
    const { name, age, gender, phone } = req.body;


    if (!name || !age || !gender || !phone) {
        return next(new ApiError(400, "All fields are required"));
    }
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }

    const patientData = {
        name,
        age,
        gender,
        phone,
        createdBy: req.user?.id
    };

    const newPatient = await Patient.create(patientData);

    res.status(201).json(new ApiResponse(201, "Patient created successfully", newPatient));
});

export const getPatient = asyncHandler(async (req, res, next) => {
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;


    if (!userId) {
        return next(new ApiError(401, "Unauthorized: User not logged in"));
    }


    const patients = await Patient.findAll({
        where: {
            createdBy: userId
        }
    });

    res.status(200).json(new ApiResponse(200, "Data successfully fetched", patients));
});


export const getPatientById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;

    if (!id || !userId) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const patient = await Patient.findOne({
        where: {
            id,
            createdBy: userId
        }
    });

    if (!patient) {
        return next(new ApiError(404, "Patient not found"));
    }

    res.status(200).json(new ApiResponse(200, "Data successfully fetched", patient));
});


export const updatePatientByID = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;
    const { name, age, gender, email, phone } = req.body;


    if (!id || !userId) {
        return next(new ApiError(401, "Unauthorized"));
    }


    const patient = await Patient.findOne({
        where: {
            id,
            createdBy: userId
        }
    });

    if (!patient) {
        return next(new ApiError(404, "Patient not found"));
    }


    await patient.update({
        name: name ?? patient.name,
        age: age ?? patient.age,
        gender: gender ?? patient.gender,
        phone: phone ?? patient.phone
    });


    const updatedPatient = await Patient.findOne({ where: { id, createdBy: userId } });

    res.status(200).json(new ApiResponse(200, "Patient updated successfully", updatedPatient));
});

export const deletePatientById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;

    if (!id || !userId) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const patient = await Patient.findOne({
        where: {
            id,
            createdBy: userId
        }
    });

    if (!patient) {
        return next(new ApiError(404, "Patient not found"));
    }

    // Delete patient
    await Patient.destroy({ where: { id, createdBy: userId } });

    res.status(200).json(new ApiResponse(200, "Patient deleted successfully"));
});









