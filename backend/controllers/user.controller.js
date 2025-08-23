import {User} from "../models/user.model.js";

const myProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(400).send("User ID is required");
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("User not found");
        }
        return res.status(200).json({user,message:"user details fetched successfully"});
    } catch (error) {
        return res.status(500).json({error: error, message: "Internal Server Error"});
    }
}

const updateProfile = async(req,res)=>{
    try {
    const {fieldValue,field} = req.body;
    const userId = req.user.id;
    if(!userId){
        return res.status(400).send("User ID is required");
    }
    if(!fieldValue || !field){
        return res.status(400).send("All fields are required");
    }
    const updatedUser = await User.findByIdAndUpdate(userId,{[field]:fieldValue},{new:true});
    return res.status(200).json({updatedUser,message:"user details updated successfully"});
    } catch (error) {
        return res.status(500).json({error: error, message: "Internal Server Error"});
    }
}

const deleteProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(400).send("User ID is required");
        }
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).send("User not found");
        }
        return res.status(200).json({user,message:"user details deleted successfully"});
    } catch (error) {
        return res.status(500).json({error: error, message: "Internal Server Error"});
    }
}
const changePassword = async(req,res)=>{
    try {
        const {oldPassword,newPassword} = req.body;
        const userId = req.user.id;
        console.log("og::",oldPassword,newPassword);
        if(!userId){
            return res.status(400).send("User ID is required");
        }
        if(!oldPassword || !newPassword){
            return res.status(400).send("All fields are required");
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("User not found");
        }
        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordValid){
            return res.status(401).send("Invalid credentials");
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({user,message:"Password changed successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error, message: "Internal Server Error"});
    }
}

export {myProfile,updateProfile,deleteProfile,changePassword};