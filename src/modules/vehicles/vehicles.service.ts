import { pool } from "../../config/db"



const createVehicle = async (
    vehicle_name: string,
    type: string,
    registration_number: string,
    daily_rent_price: number,
    availability_status: string)=>{
       
        const result = await pool.query(`
         INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,[vehicle_name, type, registration_number, daily_rent_price, availability_status]);

         return result.rows[0];
    };



    const getAllvehicles=async ()=>{
       const result=await pool.query(`SELECT * FROM vehicles`);
       
       return result.rows;
    };



    const getVehicleById=async(id:string)=>{
        const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
        return result.rows[0]; 
    };



    const updateVehicle=async(
        id: string,
        vehicle_name: string,
        type: string,
        registration_number: string,
        daily_rent_price: number,
        availability_status: string)=>{
          
            const result=await pool.query(`
             UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING * `,    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);

             return result.rows[0];
    };


 
    const deleteVehicle=async(id:string)=>{

        const check=await pool.query(`
           SELECT * FROM bookings WHERE  vehicle_id=$1 AND status='active'`,[id]);


           if(check.rows.length > 0){
              throw new Error("Cannot delete vehicle with active bookings!");  
           };


           const result=await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`,[id]);

           return result.rows[0]
    }




    export const vehicleServices={
        createVehicle,
        getAllvehicles,
        getVehicleById,
        updateVehicle,
        deleteVehicle,

    }