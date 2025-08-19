import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
   fullName:{
    type: String,
    required: true
   },
   username:{
    type: String,
    required: true,
    unique: true
   },
   email:{
    type: String,
    required: true,
    unique: true
   },
   password:{
    type: String,
    required: true
   },
   refreshToken:{
    type: String,
    default: null,
   },
   progress:{
    type:Number,
    default:0,
   }
},{
    timestamps: true,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateRefreshToken = async function() {
   const token = await jwt.sign({
       id: this._id,
   },
   process.env.REFRESH_TOKEN_SECRET,
   { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
   return token;
};
userSchema.methods.generateAccessToken = async function() {
   const token = await jwt.sign({
       id: this._id,
       username: this.username,
       email: this.email
   },
   process.env.ACCESS_TOKEN_SECRET,
   { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
   return token;
};

export const User = mongoose.model("User", userSchema);
 

