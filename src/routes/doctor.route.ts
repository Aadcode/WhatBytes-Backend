import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createDoctor, deleteDoctorById, getDoctorById, getDoctors, updateDoctorById } from "../controllers/doctor.controller";
const router = Router();

router.route("/").post(auth, createDoctor).get(getDoctors)

router.route("/:id").get(getDoctorById).put(auth, updateDoctorById).delete(auth, deleteDoctorById)


export default router
