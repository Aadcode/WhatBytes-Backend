import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

enum Gender {
    Male = "Male",
    Female = "Female"
}

interface PatientAttributes {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    phone: string;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PatientCreationAttributes extends Optional<PatientAttributes, "id"> { }

class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
    public id!: string;
    public name!: string;
    public age!: number;
    public gender!: Gender;
    public phone!: string;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Patient.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // ✅ Use default UUID generation
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        gender: {
            type: DataTypes.ENUM(...Object.values(Gender)),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 15],
            },
        },
        createdBy: {
            type: DataTypes.UUID, // ✅ Ensure UUID type matches User.id
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "Patient",
        timestamps: true,
    }
);

export default Patient;
