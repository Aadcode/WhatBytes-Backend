import express, { Request, Response, NextFunction } from "express";
import { initDatabase } from "./config/database";
import dotenv from "dotenv";
import patientRoutes from "./routes/patient.route"
import authRoutes from "./routes/auth.route"
import doctorRoutes from "./routes/doctor.route"
import mappingRoutes from "./routes/mapping.route"

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

app.use("/api/mapping", mappingRoutes);




app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack only in development
    });
});


initDatabase();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
