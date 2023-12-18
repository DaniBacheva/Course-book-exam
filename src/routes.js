const router = require('express').Router();  

const homeController = require('./controllers/homeComtroller'); 
const userContoller = require ('./controllers/userController');
const courseController = require ('./controllers/courseController')

router.use(homeController); 
router.use('/users', userContoller);
router.use('/courses', courseController)

router.get("*", (req,res)=> {
    res.redirect("/404")
})

module.exports = router;  