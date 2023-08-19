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
    async getAllSpecialistNoImage(req, res) {
        // no get image
        try {
            const response = await db.Specialist.findAll({
                attributes: { exclude: ['image'] },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllSpecialist(req, res) {
        try {
            const response = await db.Specialist.findAll();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getTopSpecialist(req, res) {
        try {
            let limit = Number(req.params.limit);
            if (!limit) limit = 8;
            const response = await db.Specialist.findAll({
                limit,
                raw: true,
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllSpecialistName(req, res) {
        // no get image
        try {
            const response = await db.Specialist.findAll({
                attributes: ['id', 'name'],
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getOneSpecialist(req, res) {
        try {
            const response = await db.Specialist.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['contentHTML', 'contentMarkdown'],
                    },
                ],
                raw: true,
                nest: true,
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async updateOneSpecialist(req, res) {
        const data = req.body;
        const { name, image, ...dataMarkdown } = data;
        const promise = Promise.all([
            db.Specialist.update(
                { name, image },
                {
                    where: { id: req.params.id },
                }
            ),
            db.Markdown.update(dataMarkdown, {
                where: { specialistId: req.params.id },
            }),
        ]);
        promise
            .then(() => {
                res.status(200).json('Update successfully');
            })
            .catch((error) => {
                res.status(500).json(error);
            });
    },
    async deleteOneSpecialist(req, res) {
        const promise = Promise.all([
            db.Specialist.destroy({
                where: { id: req.params.id },
            }),
            db.Markdown.destroy({
                where: { specialistId: req.params.id },
            }),
        ]);
        promise
            .then(() => {
                res.status(200).json('Delete successfully');
            })
            .catch((error) => {
                res.status(500).json(error);
            });
    },
};
export default specialistController;
