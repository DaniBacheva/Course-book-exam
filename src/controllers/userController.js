const router = require("express").Router();
const userManager = require('../manager/userManager');
const { extractErrorMsgs } = require('../utils/errorHandler');
const { isLoogedIn } = require('../middlewares/authMiddleware')

router.get('/register', isLoogedIn, (req, res) => {
    if(req.user) {
        return res.redirect('/');
    }
    res.render('users/register')
});

router.post('/register', isLoogedIn, async (req, res) => {
    const {username,  email, password, repeatPassword } = req.body;

    try {
        const token= await userManager.register({ username, email, password, repeatPassword });
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/');
    }
    catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.status(404).render("users/register", { errorMessages })
    }
});

router.get('/login', isLoogedIn, (req, res) => {
    if(req.user) {
        return res.redirect('/');
    }

    res.render('users/login')
});

router.post('/login',isLoogedIn,  async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userManager.login(email, password);
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/')
    }
    catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.status(404).render("users/login", { errorMessages })
    };
});

router.get('/logout', (req, res) => {

    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;  //