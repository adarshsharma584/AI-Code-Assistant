import {Router} from "express";
import {myProfile} from "../controllers/user.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = Router();

router.get('/me', authMiddleware, myProfile);

export const userRouter = router;