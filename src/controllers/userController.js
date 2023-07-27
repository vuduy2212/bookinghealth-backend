import db from '../models/index';
const { Op } = require('sequelize');
const userController = {
    async updateOneUser(req, res) {
        try {
            await db.User.update(req.body, {
                where: { id: req.params.id },
                raw: true,
            });
            const data = await db.User.findOne({
                where: { id: req.params.id },
                raw: true,
            });
            const { password, ...other } = data;
            res.status(200).json(other);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async getAllOneRole(req, res) {
        try {
            let role = '';
            if (req.params.role == 'patient') {
                role = 'R3';
            }
            if (req.params.role == 'doctor') {
                role = 'R2';
            }
            if (req.params.role == 'admin') {
                role = 'R1';
            }
            const data = await db.User.findAll({
                where: { roleId: role },
                raw: true,
                attributes: { exclude: ['password', 'image'] },
            });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllUnConfirmed(req, res) {
        try {
            const data = await db.User.findAll({
                where: {
                    [Op.or]: [{ roleId: 'R1x' }, { roleId: 'R2x' }],
                },
                raw: true,
                attributes: { exclude: ['password'] },
            });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async deleteUser(req, res) {
        try {
            await db.User.destroy({
                where: { id: req.params.id },
            });
            res.status(200).json('Delete Success');
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
export default userController;
