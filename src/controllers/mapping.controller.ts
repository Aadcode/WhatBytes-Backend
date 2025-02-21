
import Doctor from "../models/doctor.model";
import Mapping from "../models/mapping.model";
import Patient from "../models/patient.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiReponse";
import asyncHandler from "../utils/asyncHandler";


export const assignDoctor = asyncHandler(async (req, res, next) => {
    const { patientId, doctorId } = req.body;

    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));

    }
    const userId = req.user.id;


    if (!patientId || !doctorId) {
        throw new ApiError(400, "Patient ID and Doctor ID are required");
    }

    const [patient, doctor] = await Promise.all([
        Patient.findByPk(patientId),
        Doctor.findByPk(doctorId)
    ]);

    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    const existingMapping = await Mapping.findOne({
        where: {
            patientId,
            doctorId,
            createdBy: userId
        }
    });

    if (existingMapping) {
        throw new ApiError(400, "Doctor is already assigned to this patient");
    }


    const doctorAssigned = await Mapping.create({
        patientId,
        doctorId,
        createdBy: userId
    });

    res.status(201).json(
        new ApiResponse(201, "Doctor assigned successfully", doctorAssigned)
    );
});


export const getMappings = asyncHandler(async (req, res) => {
    const mappings = await Mapping.findAll({
        include: [
            {
                model: Patient,
                attributes: ["id", "name", "age", "gender", "phone"],
                required: true
            },
            {
                model: Doctor,
                attributes: ["id", "name", "specialization"],
                required: true
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
        new ApiResponse(200, "Mappings fetched successfully", mappings)
    );
});


export const getPatientDoctors = asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        throw new ApiError(400, "Patient ID is required");
    }


    const patient = await Patient.findByPk(patientId);
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    const mappings = await Mapping.findAll({
        where: { patientId },
        include: [{
            model: Doctor,
            attributes: ["id", "name", "specialization"],
            required: true
        }],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
        new ApiResponse(200, "Doctors fetched successfully", mappings)
    );
});


export const removeDoctor = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!req.user?.id) {
        return next(new ApiError(400, "User ID is required to create a patient"));
    }
    const userId = req.user.id;

    if (!id) {
        throw new ApiError(400, "Mapping ID is required");
    }

    const mapping = await Mapping.findOne({
        where: {
            id,
            createdBy: userId
        }
    });

    if (!mapping) {
        throw new ApiError(404, "Mapping not found or unauthorized");
    }

    await mapping.destroy();

    res.status(200).json(
        new ApiResponse(200, "Mapping deleted successfully")
    );
});

export default {
    assignDoctor,
    getMappings,
    getPatientDoctors,
    removeDoctor
};