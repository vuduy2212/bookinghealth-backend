import db from '../models/index';
const doctorController = {
    async getTopDoctorHome(req, res) {
        let limit = Number(req.params.limit);
        if (!limit) limit = 10;

        try {
            const response = await db.User.findAll({
                where: { roleId: 'R2' },
                limit,
                raw: true,
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['value'],
                    },
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['value'],
                    },
                ],
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async UpdateProfileDoctor(req, res) {
        try {
            const profileDoctor = db.Markdown.findOne({
                where: { doctorId: req.params.id },
            });
            if (profileDoctor) {
                await db.Markdown.update(req.body, {
                    where: {
                        doctorId: req.params.id,
                    },
                    raw: true,
                });
                return res
                    .status(200)
                    .json('Update Profile Doctor successfully');
            } else {
                await db.Markdown.create({
                    ...req.body,
                    doctorId: req.params.id,
                });
                return res
                    .status(200)
                    .json('Create Profile Doctor successfully');
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async GetProfileDoctor(req, res) {
        try {
            const profileDoctor = await db.Markdown.findOne({
                where: { doctorId: req.params.id },
            });
            if (profileDoctor) {
                return res.status(200).json(profileDoctor);
            } else {
                return res.status(200).json({});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async GetDetailDoctor(req, res) {
        try {
            let data = await db.User.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: db.Markdown,
                        attributes: [
                            'description',
                            'contentHTML',
                            'contentMarkdown',
                        ],
                    },
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['value'],
                    },
                ],
                raw: true,
                nest: true,
            });
            res.status(200).json(data);
        } catch (error) {}
    },

    async bulkCreateSchedule(req, res) {
        try {
            const doctorId = req.body.doctorId;
            const date = Number(req.body.date);
            await db.Schedule.destroy({
                where: { doctorId, date },
            });
            await db.Schedule.bulkCreate(req.body.arraySchedule);
            res.status(200).json('');
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async getoneSchedule(req, res) {
        try {
            const doctorId = req.params.id;
            const date = Number(req.params.date);
            const data = await db.Schedule.findAll({
                where: { doctorId, date: date },
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeData',
                        attributes: ['value'],
                    },
                ],
                raw: true,
                nest: true,
            });
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

export default doctorController;
