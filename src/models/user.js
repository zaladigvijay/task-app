const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task=require('./task')

const  userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email invalid");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password can't contain password as string ");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age cant be negative");
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }]
    , avatar: {
        type:Buffer
}}, { timestamps: true })


userSchema.virtual('tasks', {
    ref: "Task"    ,
    localField: '_id',
    foreignField:'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_TOKEN)
    this.tokens.push({ token })
    await this.save();
    return token
}

userSchema.methods.toJSON =  function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user
    
}

userSchema.statics.finByCredintial = async (email, password) => {0
    const user = await User.findOne({ email })  
    if (! user) {
        throw new Error("User Not Found");       
    }   
    const isMatch = await bcryptjs.compare(password, user.password);  
    if (! isMatch) {
        throw new Error("Password Not match")
    }
    return user    
}

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password= await bcryptjs.hash(this.password,8)
    }
    next();
    
})


userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id })
    next();
    
})
const User = mongoose.model("User",userSchema );

module.exports = User;