import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { CreatePatient, deletePatientById, getPatient, getPatientById } from "../controllers/patient.controller";
const router = Router();

router.route("/").post(auth, CreatePatient).get(auth, getPatient)

router.route("/:id").get(auth, getPatientById).put(auth, deletePatientById).delete(auth, deletePatientById)


export default router
