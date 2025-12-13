import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router=Router();


router.post("/bookings", auth("customer", "admin"), bookingControllers.createBooking);



router.get("/bookings",  auth("admin", "customer"), bookingControllers.getAllBookings);


router.put("/bookings/:bookingId",auth("admin", "customer"), bookingControllers.updateBooking);


export const bookingRoutes=router;