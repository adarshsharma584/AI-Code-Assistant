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
        return res.status(500).send("Internal Server Error");
    }
}
export {myProfile};