const router = require("express").Router();
const courseManager = require("../manager/courseManager");
const { extractErrorMsgs } = require("../utils/errorHandler");
const { isAuth } = require('../middlewares/authMiddleware')

router.get("/", async (req, res) => {
     try {
          const courses = await courseManager.getAll().lean();
          //console.log(courses);
          res.render("courses/catalog", { courses });
     }
     catch (error) {
          res.status(404).render("courses/catalog", { errorMessage: "Unsuccessful loading" })
     }

});

router.get("/create", isAuth, (req, res) => {

     res.render("courses/create");
})

router.post("/create", isAuth, async (req, res) => {
     const {
          title,
          type,
          certificate,
          image,
          description,
          price
     } = req.body;

     const loadData = { title, type, certificate, image, description, price, owner: req.user }

     try {
          await courseManager.create(loadData);
          res.redirect('/courses');
     }
     catch (error) {
          const errorMessages = extractErrorMsgs(error);
          res.status(404).render('courses/create', { errorMessages });
     }
});

router.get("/:courseId/details", async (req, res) => {
     const { courseId } = req.params;

     try {
          const course = await courseManager.getOne(courseId).populate('owner').lean();
          console.log(course)
          const { user } = req;
          const { owner } = course;

          const isOwner = user?._id === owner._id.toString();
          const hasSignedUp = course.signUpList.some((s) => s?.email === user?.email);

          const signedUpEmails = course.signUpList?.map((s) => s.email).join(", ");
          console.log({ signUpList: course.signUpList })
          //console.log(signedUpEmails);

          console.log(hasSignedUp);
          //console.log(isOwner)
          res.render('courses/details', { course, isOwner, hasSignedUp, signedUpEmails });
     }
     catch (error) {
          res.status(404).render("courses/details", { errorMessage: "Unsuccessful loading" });
     }
});

router.get("/:courseId/edit", isAuth, async (req, res) => {
     const { courseId } = req.params;

     try {
          const course = await courseManager.getOne(courseId).lean();
          //console.log(course.owner.toString());
          // console.log(req.user._id)
          if (course.owner?.toString() !== req.user?._id) {
               return res.redirect('/404');
          }

          res.render("courses/edit", { course });
     }
     catch (error) {
          res.status(404).render("courses/edit", { errorMessage: "Resourse not found" });
     }

});

router.post("/:courseId/edit", isAuth, async (req, res) => {
     const { courseId } = req.params;
     const {
          title,
          type,
          certificate,
          image,
          description,
          price
     } = req.body;
     console.log(req.body);

     const loadData = { title, type, certificate, image, description, price, owner: req.user };

     try {
          await courseManager.update(courseId, loadData);
          res.redirect(`/courses/${courseId}/details`);
     }
     catch (error) {
          const errorMessages = extractErrorMsgs(error);
          res.status(404).render('courses/edit', { errorMessages });
     }
});

router.get('/:courseId/delete', isAuth, async (req, res) => {
     const { courseId } = req.params;

     try {
          const course = await courseManager.getOne(courseId).lean();
          //console.log(course.owner.toString());
          // console.log(req.user._id)
          if (course.owner?.toString() !== req.user?._id) {
               return res.redirect('/404');
          }
          await courseManager.delete(courseId);
          res.redirect('/courses')
     }
     catch (error) {
          res.sendStatus(404).render("courses/delete", { errorMessage: "Unsuccessful delete" })
     }
});

router.get("/:courseId/sign", isAuth, async (req, res) => {
     const { courseId } = req.params;
     const { _id } = req.user;
     // console.log(user);

     await courseManager.signUp(courseId, _id)

     res.redirect(`/courses/${courseId}/details`)
})

router.get("/profile", isAuth, async (req, res) => {
     const { user } = req;
     console.log(user)

     const myCourses = await courseManager.getMyCourses(user?._id).lean();
    // const mySignedUpCourse = await courseManager.getMySignedUpCourses(user?._id).lean();

     console.log(myCourses)

     res.render("courses/profile", { myCourses });
})


module.exports = router;