import { Router } from "express";
import { bodyValidation } from "../middlewares/Validation";
import { LoginSchema } from "../schemas/LoginSchema";
import * as TestController from "../controllers/TestController"
import { testErrorHandler } from "../middlewares/handlers/TestErrorHandler";

const testRouter = Router();

testRouter.post('/login', bodyValidation(LoginSchema), TestController.login );


testRouter.use(testErrorHandler);

export default testRouter;