import {User} from "../models/user.model.js";

const generateAccessAndRefreshTokens = async (user) => {

    if(!user){
         throw new Error("User not found");
    }

   const accessToken = await user.generateAccessToken();
   const refreshToken = await user.generateRefreshToken();

   return { accessToken, refreshToken };
};

const register =  (async (req, res) => {
    try {
        //register user 
        const {fullName, username,email,password} = req.body;

        if(!fullName || !username || !email || !password){
            return res.status(400).send("All fields are required");
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).send("User already exists");
        }


        const user = await User.create({
            fullName,
            username,
            email,
            password
        });

        const {refreshToken , accessToken} = await generateAccessAndRefreshTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        };
       
        res.cookie("refreshToken", refreshToken, options);
        res.cookie("accessToken", accessToken, options);
       return res.status(201).json({user, accessToken, refreshToken, message:"User registered successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
     }
})

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email ||!password){
            return res.status(400).send("All fields are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }
        const {refreshToken, accessToken} = await generateAccessAndRefreshTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        };
        
        res.cookie("refreshToken", refreshToken, options);
        res.cookie("accessToken", accessToken, options);
        return res.status(200).json({user, accessToken, refreshToken, message:"User logged in successfully"});
       
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const logout = async (req,res)=> {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(401).send("Unauthorized"); 
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("User not found"); 
        }
        user.refreshToken = null;
        await user.save();
        
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };
        
        res.clearCookie("refreshToken", options);
        res.clearCookie("accessToken", options);
        return res.status(200).json({success: true, message: "User logged out successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

        
export { register,login,logout }
