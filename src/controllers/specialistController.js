import db from '../models/index';
const specialistController = {
    async createNewSpecialist(req, res) {
        try {
            const specialist = await db.Specialist.create({
                name: req.body.name,
                image: req.body.image,
            });
            const specialistId = specialist.id;
            await db.Markdown.create({
                specialistId: specialistId,
                contentHTML: req.body.contentHTML || '',
                contentMarkdown: req.body.contentMarkdown || '',
            });
            res.status(200).json('Create new specialist successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllSpecialist(req, res) {
        try {
            const response = await db.Specialist.findAll({
                attributes: { exclude: ['image'] },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
export default specialistController;
