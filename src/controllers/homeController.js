const getHomePage = (req, res) => {
    res.render('homepage.ejs');
};
const getAboutPage = (req, res) => {
    res.render('aboutpage.ejs');
};
export default { getHomePage, getAboutPage };
