import { Router } from "express";
import { bodyValidation } from "../middlewares/Validation";
import { LoginSchema } from "../schemas/Login";
import * as UserController from "../controllers/UserController";
import { UserResgisterSchema } from "../schemas/UserResgister";
import { ForgotPasswordSchema } from "../schemas/ForgotPassword";
import { ResetPasswordSchema } from "../schemas/ResetPassword";

const userRouter = Router();

userRouter.post('/login', bodyValidation(LoginSchema), UserController.login );

userRouter.post('/register', bodyValidation(UserResgisterSchema), UserController.register );

userRouter.post('/forgot-password', bodyValidation(ForgotPasswordSchema), UserController.forgotPassword );

userRouter.post('/reset-password', bodyValidation(ResetPasswordSchema), UserController.resetPassword );

export default userRouter;