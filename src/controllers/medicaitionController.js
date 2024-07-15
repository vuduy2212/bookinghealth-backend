import db from '../models/index';
const medicationController = {
    async getAllMedicationOne(req, res) {
        try {
            const data = await db.Medication.findAll({
                where: { clinicId: req.params.id },
                raw: true,
            });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async createMedication(req, res) {
        const { name, composition, dosage, instructions } = req.body;
        const clinicId = req.params.id;

        if (!name || !composition || !dosage || !instructions) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        try {
            const newMedication = await db.Medication.create({
                name,
                composition,
                dosage,
                instructions,
                clinicId,
            });
            res.status(200).json(newMedication);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async deleteMedication(req, res) {
        try {
            const id = req.params.id;
            const medication = await db.Medication.findOne({ where: { id } });

            if (!medication) {
                return res.status(404).json({ message: 'Medication not found' });
            }

            await db.Medication.destroy({ where: { id } });
            res.status(200).json({ message: 'Medication deleted successfully' });
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

export default medicationController;
