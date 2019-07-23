const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phone: { unique: true, type: String },
    name: String,
    password: String,
    avatar: String,
    gender: String,
    age: String,
    meta: {
        careteAt: { type: Date, dafault: Date.now() },
        updateAt: { type: Date, dafault: Date.now() },
    },
});

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.careteAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
