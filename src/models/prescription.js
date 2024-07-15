'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Prescription extends Model {
        static associate(models) {
            Prescription.belongsTo(models.MedicalRecord, { foreignKey: 'medical_record_id' });
            Prescription.belongsTo(models.Medication, { foreignKey: 'medicationId', as: 'medication' });
        }
    }
    Prescription.init(
        {
            medical_record_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            medicationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            dosage: {
                type: DataTypes.TEXT,
            },
            instructions: {
                type: DataTypes.TEXT,
            },
            quantity: {
                type: DataTypes.STRING,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Prescription',
            tableName: 'prescriptions',
        },
    );
    return Prescription;
};
