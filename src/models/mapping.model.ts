import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Patient from "./patient.model";
import Doctor from "./doctor.model";
import User from "./user.model";

interface MappingAttributes {
    id: string;
    patientId: string;
    doctorId: string;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface MappingCreationAttributes extends Optional<MappingAttributes, "id"> { }

class Mapping extends Model<MappingAttributes, MappingCreationAttributes> implements MappingAttributes {
    public id!: string;
    public patientId!: string;
    public doctorId!: string;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Mapping.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // ✅ Use default UUID generation
            primaryKey: true,
        },
        patientId: {
            type: DataTypes.UUID, // ✅ Ensure UUID type matches Patient.id
            allowNull: false,
            references: {
                model: Patient,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        doctorId: {
            type: DataTypes.UUID, // ✅ Ensure UUID type matches Doctor.id
            allowNull: false,
            references: {
                model: Doctor,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        createdBy: {
            type: DataTypes.UUID, // ✅ Ensure UUID type matches User.id
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        }
    },
    {
        sequelize,
        modelName: "Mapping",
        timestamps: true,
    }
);

export default Mapping;
