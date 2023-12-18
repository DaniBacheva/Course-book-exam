const { MongooseError } = require("mongoose");

exports.extractErrorMsgs = (error)=> {
    const isInstansceOfMongoose = error instanceof MongooseError;

    if (isInstansceOfMongoose) {
        const errors = Object.values(error.errors);
        const msgs = errors.map((e) => e.message);
        return msgs;
    }

    return [error.message];
};