import express, {Request,Response} from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoute } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookimg.routes";


const app = express();

app.use(express.json());

initDB();


//auth route

app.use("/api/v1", authRoutes);


//user route

app.use("/api/v1", userRoute);


//vehicle route

app.use("/api/v1", vehicleRoutes);


//booking route
app.use("/api/v1", bookingRoutes)




app.get("/", (req:Request,res:Response)=>{
    res.send("Hello, Friends What's up!")
});



export default app;