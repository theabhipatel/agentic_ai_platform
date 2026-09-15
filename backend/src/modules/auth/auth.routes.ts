import { Router } from "express";

import {
    signupController,
    loginController,
} from "./auth.controller.js";

import {
    signupSchema,
    loginSchema,
} from "./auth.schema.js";
import { validate } from "../../middleware/validate.middleware.js";



const authRouter = Router();

authRouter.post(
    "/signup",
    validate(signupSchema),
    signupController
);

authRouter.post(
    "/login",
    validate(loginSchema),
    loginController
);

export default authRouter;