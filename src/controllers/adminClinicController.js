import db from '../models/index';
const adminClinicController = {
    async getOneClinicByAdminId(req, res) {
        try {
            const clinic = await db.Clinic.findOne({
                where: { adminClinicId: req.params.id },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown'],
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!clinic) {
                // Nếu không tìm thấy clinic, trả về phản hồi 404
                return res.status(404).json({ message: 'Clinic not found' });
            }
            return res.status(200).json(clinic);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    async updateClinicByAdminId(req, res) {
        const adminClinicId = req.params.id;
        const data = req.body;
        const { id, name, address, phoneNumber, image, logo, ...dataMarkdown } = data;
        const promise = Promise.all([
            db.Clinic.update(
                { name, address, phoneNumber, image, logo },
                {
                    where: { adminClinicId },
                },
            ),
            db.Markdown.update(dataMarkdown, {
                where: { clinicId: id },
            }),
        ]);
        promise
            .then(() => {
                res.status(200).json('Update successfully');
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json(error);
            });
    },
    async getAllDoctorOneClinicByAdminId(req, res) {
        try {
            const adminClinicId = req.params.id;
            const clinic = db.Clinic.findOne({
                attributes: ['id', 'name'],
                where: { adminClinicId: adminClinicId },
                include: [
                    {
                        model: Doctor_Info,
                        include: [
                            {
                                model: User,
                                attributes: [
                                    'id',
                                    'firstName',
                                    'lastName',
                                    'email',
                                    'phoneNumber',
                                    'address',
                                    'yearOfBirth',
                                ],
                            },
                            {
                                model: Specialist,
                                as: 'specialist',
                                attributes: ['name'],
                            },
                        ],
                    },
                ],
            });
            if (!clinic) {
                console.log('Clinic not found');
                return;
            }
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
};
export default adminClinicController;
