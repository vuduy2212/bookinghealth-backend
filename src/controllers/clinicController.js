import db from '../models/index';
const clinicController = {
    async createNewClinic(req, res) {
        try {
            const clinic = await db.Clinic.create({
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                image: req.body.image,
                logo: req.body.logo,
            });
            const clinicId = clinic.id;
            await db.Markdown.create({
                clinicId: clinicId,
                description: req.body.description,
                contentHTML: req.body.contentHTML || '',
                contentMarkdown: req.body.contentMarkdown || '',
            });
            res.status(200).json('Create new Clinic successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllClinicNoImage(req, res) {
        // no get image
        try {
            const response = await db.Clinic.findAll({
                attributes: {
                    exclude: [
                        'image',
                        'logo',
                        'description',
                        'contentHTML',
                        'contentMarkdown',
                    ],
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getAllClinicName(req, res) {
        // no get image
        try {
            const response = await db.Clinic.findAll({
                attributes: ['id', 'name'],
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getLimitClinic(req, res) {
        try {
            let limit = Number(req.params.limit);
            if (!limit) limit = 8;
            const response = await db.Clinic.findAll({
                limit,
                raw: true,
                attributes: {
                    exclude: ['image'],
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getOneClinic(req, res) {
        try {
            const response = await db.Clinic.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: db.Markdown,
                        attributes: [
                            'description',
                            'contentHTML',
                            'contentMarkdown',
                        ],
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
    async updateOneClinic(req, res) {
        const data = req.body;
        const { name, address, phoneNumber, image, logo, ...dataMarkdown } =
            data;
        const promise = Promise.all([
            db.Clinic.update(
                { name, address, phoneNumber, image, logo },
                {
                    where: { id: req.params.id },
                }
            ),
            db.Markdown.update(dataMarkdown, {
                where: { clinicId: req.params.id },
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
    async deleteOneClinic(req, res) {
        const promise = Promise.all([
            db.Clinic.destroy({
                where: { id: req.params.id },
            }),
            db.Markdown.destroy({
                where: { clinicId: req.params.id },
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
export default clinicController;
