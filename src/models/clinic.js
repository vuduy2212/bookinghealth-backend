'use strict';
const { Model, INTEGER } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Clinic.hasOne(models.Markdown, { foreignKey: 'clinicId' });
            // Clinic.belongsToMany(models.User, {
            //     through: {
            //         model: models.Doctor_Info,
            //     },
            //     foreignKey: 'clinicId',
            // });
            //Clinic.belongsTo(models.User, { foreignKey: 'adminClinicId' });
            Clinic.hasMany(models.Doctor_Info, {
                foreignKey: 'clinicId', // Khóa ngoại trong Doctor_Info tham chiếu đến Clinic
                as: 'doctors', // Tên alias để truy vấn
            });
            Clinic.belongsTo(models.User, {
                foreignKey: 'adminClinicId', // Khóa ngoại trong Doctor_Info tham chiếu đến Clinic
                as: 'adminClinic', // Tên alias để truy vấn
            });
            Clinic.hasOne(models.Medication, {
                foreignKey: 'clinicId', // Khóa ngoại trong Doctor_Info tham chiếu đến Clinic
            });
        }
    }
    Clinic.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            image: DataTypes.STRING,
            logo: DataTypes.STRING,
            adminClinicId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Clinic',
        },
    );
    return Clinic;
};
