const router = require("express").Router();
const courseManager =require ('../manager/courseManager')

router.get("/", async (req,res)=> {
    try {
        const courses = await courseManager.getLatest().lean();
        //console.log(courses);
        res.render("home", { courses });
   }
   catch (error) {
        res.status(404).render("home", { errorMessage: "Unsuccessful loading" })
   }
    
  });

router.get("/404", (req,res)=> {
    res.render('404')
})


module.exports = router;