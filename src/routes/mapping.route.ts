import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createDoctor, deleteDoctorById, getDoctorById, getDoctors, updateDoctorById } from "../controllers/doctor.controller";
import { assignDoctor, getMappings, getPatientDoctors, removeDoctor } from "../controllers/mapping.controller";
const router = Router();

router.route("/").post(auth, assignDoctor).get(getMappings)

router.route("/:patientId").get(getPatientDoctors)
router.route("/:id").delete(auth, removeDoctor)



export default router
