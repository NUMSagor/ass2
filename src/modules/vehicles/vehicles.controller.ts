import { Request,Response } from "express";
import { vehicleServices } from "./vehicles.service";


const createVehicle=async(req:Request,res:Response)=>{
    try {
      const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
      
      const result=await vehicleServices.createVehicle( 
          vehicle_name,
          type,
          registration_number,
          daily_rent_price,
          availability_status
        );

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });

    } catch (error:any) {
      res.status(500).json({ 
        success: false, 
        message: error.message });  
    }
};


const getAllvehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllvehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });

  } catch (error: any) {
    res.status(500).json({ 
        success: false, 
        message: error.message 
    });
  }
};


const getVehicleById=async(req: Request, res: Response)=>{
    try {
     const result=await vehicleServices.getVehicleById(req.params.vehicleId!) 
        
     if (!result)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });

    } catch (error:any) {
      res.status(500).json({ 
        success: false, 
        message: error.message });  
    }
} 



const updateVehicle=async(req: Request, res: Response)=>{

    try {

    const {vehicleId}=req.params;

    if (!vehicleId) {
      return res.status(400).json({ error: "Vehicle ID is required" });
    }

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;


    const result=await vehicleServices.updateVehicle(
        vehicleId,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });

 
    } catch (error:any) {
      res.status(500).json({ 
        success: false, 
        message: error.message });  
    }
   
};


const deleteVehicle = async (req: Request, res: Response) =>{
    try {
        const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);
        
        if (!result)
            return res.status(404).json({ success: false, message: "Vehicle not found" });

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: result,
        });

    } catch (error:any) {
       res.status(400).json({ 
        success: false, 
        message: error.message }); 
    }
}




export const vehiclesController={
    createVehicle,
    getAllvehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle

}