import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

interface DoctorAttributes {
    id: string;
    name: string;
    phone: string;
    specialization: string;
    createdBy: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, "id"> { }

class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
    public id!: string;
    public name!: string;
    public phone!: string;
    public specialization!: string;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Doctor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // ✅ Use default UUID generation
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50],
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 15],
                isNumeric: true,
            },
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 100],
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
        modelName: "Doctor",
        timestamps: true,
    }
);

export default Doctor;
