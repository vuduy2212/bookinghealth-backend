import db from '../models/index';
const allCodeController = {
    async getAllCode(req, res) {
        try {
            const data = await db.Allcode.findAll({
                where: { type: req.query.type },
                raw: true,
            });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
export default allCodeController;
