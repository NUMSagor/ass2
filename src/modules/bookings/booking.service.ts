import { pool } from "../../config/db";



const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;


    const availableVehicle = await pool.query(`SELECT daily_rent_price,availability_status FROM vehicles WHERE id=$1`, [vehicle_id]);

    if (availableVehicle.rows.length === 0) {
        throw new Error("Vehicle not found")
    };


    if (availableVehicle.rows[0].availability_status !== "available") {
        throw new Error("Vehicle not available");
    };


    const rentDays =
        Math.ceil((
            new Date(rent_end_date as string).getTime() -
            new Date(rent_start_date as string).getTime()
        ) /
            (1000 * 60 * 60 * 24))


    const totalPrice = rentDays * availableVehicle.rows[0].daily_rent_price;



    const result = await pool.query(
        `
  INSERT INTO bookings 
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
  VALUES ($1,$2,$3,$4,$5,'active')
  RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
  `,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
    );

    const vehicleInfo = await pool.query(
        `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );

    return {
        ...result.rows[0],
        vehicle: vehicleInfo.rows[0],
    };

};




const getAllBookings = async (user: any) => {
 
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        json_build_object(
          'name', u.name,
          'email', u.email
        ) AS customer,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number
        ) AS vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
    `);

    return result.rows;
  }

  
  const result = await pool.query(`
    SELECT
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
  `, [user.id]);

  return result.rows;
};



// const updateBooking=async(bookingId:string,status: "cancelled" | "returned",user: any)=>{

//     const getBooking=await pool.query( `SELECT * FROM bookings WHERE id = $1`,
//     [bookingId]);


//     if (getBooking.rows.length === 0) {
//         throw new Error("Booking not found");
//     };

//     const booking=getBooking.rows[0]


//     if(user.role === "customer"){
//       if (booking.customer_id !== user.id) {
//       throw new Error("Forbidden");
//     }

    


//     if (status !== "cancelled") {
//       throw new Error("Invalid status");
//     }


//      if (new Date(booking.rent_start_date) <= new Date()) {
//       throw new Error("Cannot cancel after rental start");
//     }

//     const result = await pool.query(
//       `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
//       [bookingId]
//     );

//       await pool.query(
//       `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
//       [booking.vehicle_id]
//     );

//     return result.rows[0];


// };


// if (user.role === "admin"){

//     if (status !== "returned") {
//       throw new Error("Invalid status");
//     }



//     const result = await pool.query(
//       `UPDATE bookings SET status ='returned' WHERE id=$1 RETURNING *`,
//       [bookingId]
//     );

//     await pool.query(
//       `UPDATE vehicles SET availability_status ='available' WHERE id=$1`,
//       [booking.vehicle_id]
//     );


//     return {
//       ...result.rows[0],
//       vehicle: { availability_status: "available" },
//     };

// }

//  throw new Error("Unauthorized");

// }

// const updateBooking = async (
//   bookingId: string,
//   status: "cancelled" | "returned",
//   user: any
// ) => {
//   const { rows } = await pool.query(
//     `SELECT * FROM bookings WHERE id = $1`,
//     [bookingId]
//   );

//   if (rows.length === 0) throw new Error("Booking not found");

//   const booking = rows[0];

//   if (user.role === "customer") {
//     if (booking.customer_id !== user.id) throw new Error("Forbidden");

//     if (status !== "cancelled") throw new Error("Invalid status");

//     if (new Date(booking.rent_start_date) < new Date())
//       throw new Error("Cannot cancel after rental start");

//   } else if (user.role === "admin") {
//     if (status !== "returned") throw new Error("Invalid status");
//   } else {
//     throw new Error("Unauthorized");
//   }

//   const result = await pool.query(
//     `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
//     [status, bookingId]
//   );

//   await pool.query(
//     `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
//     [booking.vehicle_id]
//   );

//   return {
//     booking: result.rows[0],
//     vehicleStatus: status === "returned" ? "available" : undefined,
//   };
// };


// const updateBooking = async (
//   bookingId: string,
//   status: "cancelled" | "returned",
//   user: any
// ) => {
//   const { rows } = await pool.query(
//     `SELECT * FROM bookings WHERE id = $1`,
//     [bookingId]
//   );

//   if (rows.length === 0) throw new Error("Booking not found");

//   const booking = rows[0];

//   // 👤 CUSTOMER LOGIC
//   if (user.role === "customer") {
//     if (booking.customer_id !== user.id) {
//       throw new Error("Forbidden");
//     }

//     if (status !== "cancelled") {
//       throw new Error("Invalid status");
//     }

//       if (new Date(booking.rent_start_date) < new Date()) {
//           throw new Error("Cannot cancel after rental start");
//       }

//   }

//   // 👮 ADMIN LOGIC
//   else if (user.role === "admin") {
//     if (status !== "returned") {
//       throw new Error("Invalid status");
//     }
//   }

//   else {
//     throw new Error("Unauthorized");
//   }

//   // ✅ Update booking
//   const result = await pool.query(
//     `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
//     [status, bookingId]
//   );

//     // 🚗 Update vehicle when booking ends (cancelled OR returned)
//     if (status === "cancelled" || status === "returned") {
//         await pool.query(
//             `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
//             [booking.vehicle_id]
//         );
//     }



//   return result.rows[0];
// };




type BookingStatus = "cancelled" | "returned";

const updateBooking = async (
  bookingId: string,
  status: BookingStatus,
  user: any
) => {
  
  const { rows } = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = rows[0];

  
  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("Access forbidden");
    }

    if (status !== "cancelled") {
      throw new Error("Invalid status");
    }

    if (new Date(booking.rent_start_date) <= new Date()) {
      throw new Error("Cannot cancel after rental start");
    }

    const result = await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    return result.rows[0];
  }

 
  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Invalid status");
    }

    const result = await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      ...result.rows[0],
      vehicle: {
        availability_status: "available",
      },
    };
  }

  throw new Error("Unauthorized");
};





export const bookingServices = {
    createBooking,
    getAllBookings,
    updateBooking

}