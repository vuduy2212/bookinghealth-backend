'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MedicalRecord extends Model {
        static associate(models) {
            MedicalRecord.belongsTo(models.Booking, { foreignKey: 'bookingId' });
            MedicalRecord.hasMany(models.Prescription, { foreignKey: 'medical_record_id', as: 'prescriptions' });
        }
    }
    MedicalRecord.init(
        {
            bookingId: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
            },
            diagnosis: {
                type: DataTypes.TEXT,
            },
            resultFile: {
                type: DataTypes.STRING,
            },
            notes: {
                type: DataTypes.TEXT,
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
            modelName: 'MedicalRecord',
            tableName: 'medical_records',
        },
    );
    return MedicalRecord;
};
