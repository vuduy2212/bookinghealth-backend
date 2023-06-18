import db from '../models/index';
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
            res.status(500).json(error);
        }
    },
};
export default userController;
