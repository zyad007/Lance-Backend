import { Router } from "express";
import { bodyValidation } from "../middlewares/Validation";
import { LoginSchema } from "../schemas/LoginSchema";
import * as UserController from "../controllers/UserController";
import { UserResgisterSchema } from "../schemas/CreateNewUser";

const userRouter = Router();

userRouter.post('/login', bodyValidation(LoginSchema), UserController.login );

userRouter.post('/register', bodyValidation(UserResgisterSchema), UserController.register );

export default userRouter;