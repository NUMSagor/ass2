import { Router } from "express";
import { authControllers } from "./auth.controller";



const router=Router();



router.post("/auth/signup", authControllers.signUp);

router.get("/auth/signin", authControllers.signIn);





export const  authRoutes=router;