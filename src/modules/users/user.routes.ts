import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";


const router=Router();


router.get("/users",auth("admin"),userController.getAllUser);

router.put("/users/:id", auth("admin","customer"), userController.updateUser);


router.delete("/users/:id",auth("admin"), userController.deleteUser);



export const userRoute= router;