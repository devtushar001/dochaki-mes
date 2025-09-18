import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    access: {
        type: Boolean,
        default: false,
    },
    userProfile: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: Math.floor(Math.random() * 100000)
    }
}, { timestamps: true });

const UserModel = mongoose.models.Users || mongoose.model("Users", UserSchema);

export default UserModel;
