'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Specialist.hasOne(models.Markdown, { foreignKey: 'specialistId' });
            // Specialist.belongsToMany(models.User, {
            //     through: {
            //         model: models.Doctor_Info,
            //     },
            //     foreignKey: 'specialistId',
            // });
            Specialist.hasMany(models.Doctor_Info, {
                foreignKey: 'specialistId', // Khóa ngoại trong Doctor_Info tham chiếu đến Clinic
                as: 'doctors', // Tên alias để truy vấn
            });
        }
    }
    Specialist.init(
        {
            name: DataTypes.STRING,
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Specialist',
        },
    );
    return Specialist;
};
