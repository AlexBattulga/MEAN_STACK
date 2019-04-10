const m = require('../config/mongoose.js');

const usersSchema = new m.Schema({
    email: {
        type: String,
        required: [true, 'Email field is required'],
        trim: true
    },
    first_name: {
        type: String,
        required: [true, 'First Name field is required'],
        trim: true
    },
    last_name:{
        type: String,
        required: [true, 'Last Name field is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
        trim: true
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday field is required'],
        trim: true
    }
});

module.exports = m.model('User', usersSchema);