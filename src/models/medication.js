'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medication extends Model {
        static associate(models) {
            Medication.belongsTo(models.Clinic, { foreignKey: 'clinicId' });
            Medication.hasMany(models.Prescription, { foreignKey: 'medicationId' });
        }
    }
    Medication.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            composition: {
                type: DataTypes.TEXT,
            },
            dosage: {
                type: DataTypes.TEXT,
            },
            instructions: {
                type: DataTypes.TEXT,
            },
            clinicId: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            modelName: 'Medication',
            tableName: 'medications',
        },
    );
    return Medication;
};
