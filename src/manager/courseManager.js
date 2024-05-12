const Course = require('../models/Course');

exports.create = (courseData) => Course.create(courseData);

exports.getAll = () => Course.find();

exports.getOne = (courseId) => Course.findById(courseId).populate('signUpList');

exports.update = (courseId, courseData) => Course.findByIdAndUpdate(courseId, courseData, { runValidators: true })

exports.delete = (courseId) => Course.findByIdAndDelete(courseId);

exports.signUp = async (courseId, userId) => {
    const course = await this.getOne(courseId);

    //console.log({ signUpList: course.signUpList });
    //console.log({ userId });

    const isSignedUp = course.signUpList.some((s) => s?.toString() === userId);
    //console.log(isSignedUp);

    if (isSignedUp) {
        return;
    }

    course.signUpList.push(userId);
    return course.save();

}

exports.getLatest=()=> Course.find().sort({_id: -1}).limit(3);

exports.getMyCourses = (userId)=>Course.find({owner : userId}).populate('owner');

exports.getMySignedUpCourses = async (userId)=> {
    const courses = await this.getAll().populate('signUpList');
    //console.log({ signUpList: courses.signUpList });

    //const myCourses = courses.signUpList.find((s) => s?.toString() === userId);
    //console.log(myCourses)
}


