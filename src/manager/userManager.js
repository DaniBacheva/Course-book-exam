const User = require('../models/User');

const bcrypt = require('bcrypt')
const jwt = require('../lib/jwt');
const { SECRET } = require('../constants');

async function getToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    }
    const token = await jwt.sign(payload, SECRET, { expiresIn: '2d' });
    return token;
}

async function validatePassword(password, userPassword) {
    const isValid = await bcrypt.compare(password, userPassword)
    if (!isValid) {
        throw new Error('Invalid email or password')
    }
}

exports.register = async (userData) => {
    const { password } = userData;
    const user = await User.create(userData);

    await validatePassword(password, user.password);

    const token = await getToken(user);
    return token;
}

exports.login = async (email, password) => {
    const user = await User.findOne({ email });

    //validate user
    if (!user) {
        throw new Error('Invalid email or password');
    }
    await validatePassword(password, user.password);

    const token = await getToken(user);
    return token;
};


//exports.mySignedUpCourse = async(userId)=> {
//    const user = await User.findOne(userId).populate('signUpcourses');
//    console.log(user)

//}