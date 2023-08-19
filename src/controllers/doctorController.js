import db from '../models/index';
const doctorController = {
    async getTopDoctorHome(req, res) {
        let limit = Number(req.params.limit);
        if (!limit) limit = 8;

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
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    async UpdateProfileDoctor(req, res) {
        try {
            const infoDoctor = await db.Doctor_Info.findOne({
                where: { doctorId: req.params.id },
            });
            if (infoDoctor) {
                await db.Doctor_Info.update(
                    {
                        clinicId: req.body.clinicId,
                        specialistId: req.body.specialistId,
                        price: req.body.price,
                    },
                    {
                        where: {
                            doctorId: req.params.id,
                        },
                        raw: true,
                    }
                );
            } else {
                await db.Doctor_Info.create({
                    doctorId: req.params.id,
                    clinicId: req.body.clinicId,
                    specialistId: req.body.specialistId,
                    price: req.body.price,
                });
            }
            const markdownDoctor = await db.Markdown.findOne({
                where: { doctorId: req.params.id },
            });
            if (markdownDoctor) {
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
            return res.status(500).json(error);
        }
    },
    async GetProfileDoctor(req, res) {
        try {
            const infoDoctor =
                (await db.Doctor_Info.findOne({
                    where: { doctorId: req.params.id },
                    raw: true,
                })) || {};
            const markdownDoctor =
                (await db.Markdown.findOne({
                    where: { doctorId: req.params.id },
                    raw: true,
                })) || {};

            return res.status(200).json({ ...infoDoctor, ...markdownDoctor });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
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

                    {
                        model: db.Clinic,
                        attributes: ['name', 'address'],
                        through: {
                            attributes: ['price', 'createdAt'],
                        },
                    },
                    {
                        model: db.Specialist,
                        attributes: ['name'],
                        through: {
                            attributes: [],
                        },
                    },
                ],
                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
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
            return res.status(200).json('');
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
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
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getAllOneSpecialist(req, res) {
        try {
            const specialistId = req.params.id;

            const data = await db.Doctor_Info.findAll({
                where: { specialistId },
                include: [
                    {
                        model: db.User,
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

                            {
                                model: db.Clinic,
                                attributes: ['name', 'address'],
                                through: {
                                    attributes: ['price', 'createdAt'],
                                },
                            },
                            {
                                model: db.Specialist,
                                attributes: ['name'],
                                through: {
                                    attributes: [],
                                },
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async getAllOneClinic(req, res) {
        try {
            const clinicId = req.params.id;

            const data = await db.Doctor_Info.findAll({
                where: { clinicId },
                include: [
                    {
                        model: db.User,
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

                            {
                                model: db.Clinic,
                                attributes: ['name', 'address'],
                                through: {
                                    attributes: ['price', 'createdAt'],
                                },
                            },
                            {
                                model: db.Specialist,
                                attributes: ['name'],
                                through: {
                                    attributes: [],
                                },
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
};

export default doctorController;
