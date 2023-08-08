'use strict';
const { Model, STRING } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Allcode, {
                foreignKey: 'positionId',
                targetKey: 'keyMap',
                as: 'positionData',
            });
            User.belongsTo(models.Allcode, {
                foreignKey: 'gender',
                targetKey: 'keyMap',
                as: 'genderData',
            });
            User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
            User.belongsToMany(models.Clinic, {
                through: {
                    model: models.Doctor_Info,
                },
                foreignKey: 'doctorId',
            });
            User.belongsToMany(models.Specialist, {
                through: {
                    model: models.Doctor_Info,
                },
                foreignKey: 'doctorId',
            });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            yearOfBirth: DataTypes.STRING,
            gender: DataTypes.STRING,
            image: DataTypes.STRING,
            roleId: DataTypes.STRING,
            positionId: DataTypes.STRING, // only doctor
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
