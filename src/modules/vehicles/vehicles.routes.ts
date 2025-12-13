import { Router } from "express";
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router=Router();


router.post("/vehicles", auth("admin"),vehiclesController.createVehicle)


router.get("/vehicles",vehiclesController.getAllvehicles);


router.get("/vehicles/:vehicleId",vehiclesController.getVehicleById);


router.put("/vehicles/:vehicleId",auth("admin"),vehiclesController.updateVehicle);


router.delete("/vehicles/:vehicleId",auth("admin"),vehiclesController.deleteVehicle);






export const vehicleRoutes=router;