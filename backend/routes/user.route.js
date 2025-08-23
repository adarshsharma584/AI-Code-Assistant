import {Router} from "express";
import {myProfile,updateProfile,deleteProfile,changePassword} from "../controllers/user.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = Router();

router.get('/me', authMiddleware, myProfile);
router.put('/update', authMiddleware, updateProfile);
router.delete('/delete', authMiddleware, deleteProfile);
router.post('/change-password', authMiddleware, changePassword);

export const userRouter = router;