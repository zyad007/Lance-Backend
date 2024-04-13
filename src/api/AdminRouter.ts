import { Router } from "express";
import { bodyValidation } from "../middlewares/Validation";
import { LoginSchema } from "../schemas/Login";
import * as AdminController from "../controllers/AdminController";
import { UserResgisterSchema } from "../schemas/UserResgister";
import { ForgotPasswordSchema } from "../schemas/ForgotPassword";
import { ResetPasswordSchema } from "../schemas/ResetPassword";

const adminRouter = Router();

adminRouter.post('/login', bodyValidation(LoginSchema), AdminController.login );

adminRouter.post('/register', bodyValidation(UserResgisterSchema), AdminController.register );

adminRouter.post('/forgot-password', bodyValidation(ForgotPasswordSchema), AdminController.forgotPassword );

adminRouter.post('/reset-password', bodyValidation(ResetPasswordSchema), AdminController.resetPassword );

export default adminRouter;