import db from '../models/index';
const statisticalController = {
    async countPatients(req, res) {
        try {
            // Đếm tổng số bệnh nhân có role là 'Patient'
            const totalPatients = await db.User.count({
                where: { roleId: 'R3' },
            });

            // Trả về kết quả
            res.status(200).json({
                totalPatients,
            });
        } catch (error) {
            console.error('Error counting patients: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },
    async countClinics(req, res) {
        try {
            const totalClinics = await db.Clinic.count();

            res.status(200).json({
                totalClinics,
            });
        } catch (error) {
            console.error('Error counting clinics: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },
    async countSpecialists(req, res) {
        try {
            const totalClinics = await db.Specialist.count();

            res.status(200).json({
                totalClinics,
            });
        } catch (error) {
            console.error('Error counting specialists: ', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    },

    async countAppointmentsByClinic(req, res) {
        try {
            const bookings = await db.Booking.findAll({
                attributes: [],
                include: [
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: [],
                        include: [
                            {
                                model: db.Doctor_Info,
                                as: 'doctorInfo',
                                attributes: [],
                                include: [
                                    {
                                        model: db.Clinic,
                                        as: 'clinic',
                                        attributes: ['id', 'name'],
                                    },
                                    {
                                        model: db.Specialist,
                                        as: 'specialist',
                                        attributes: ['id', 'name'],
                                    },
                                ],
                                raw: true,
                                nest: true,
                            },
                        ],
                        raw: true,
                        nest: true,
                    },
                ],
                raw: true,
                nest: true,
            });

            // Calculate booking counts by clinic
            const clinicCounts = bookings.reduce((acc, booking) => {
                const clinicName = booking['doctorData']['doctorInfo']['clinic']['name'];
                if (acc[clinicName]) {
                    acc[clinicName]++;
                } else {
                    acc[clinicName] = 1;
                }
                return acc;
            }, {});
            const specialistCounts = bookings.reduce((acc, booking) => {
                const specialistName = booking['doctorData']['doctorInfo']['specialist']['name'];
                if (acc[specialistName]) {
                    acc[specialistName]++;
                } else {
                    acc[specialistName] = 1;
                }
                return acc;
            }, {});

            // Format the result as an array of objects [{ clinic: 'Clinic A', count: 50 }, { clinic: 'Clinic B', count: 100 }]
            const result = Object.keys(clinicCounts).map((clinic) => ({
                clinic,
                count: clinicCounts[clinic],
            }));
            const result2 = Object.keys(specialistCounts).map((specialist) => ({
                specialist,
                count: specialistCounts[specialist],
            }));

            res.json(result2); // Return JSON response
        } catch (error) {
            console.error('Error fetching booking data:', error);
            res.status(500).json({ error: 'Error fetching booking data' });
        }
    },
};

export default statisticalController;
