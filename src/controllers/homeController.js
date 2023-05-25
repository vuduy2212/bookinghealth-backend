import db from '../models/index';
const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);
        res.render('homepage.ejs', {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};
const getAboutPage = (req, res) => {
    res.render('aboutpage.ejs');
};
export default { getHomePage, getAboutPage };
