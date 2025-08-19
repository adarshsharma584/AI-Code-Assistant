import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
}