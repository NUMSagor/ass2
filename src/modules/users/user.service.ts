import { pool } from "../../config/db";



const getAllUser = async ()=>{
    const result = await pool.query(`SELECT * FROM users`);

    return result;
}


const updateUser = async (
    id:string,
    name:string, 
    email:string, 
    password:string, 
    phone:string, 
    role:string)=>{

  const result = await pool.query(`UPDATE users SET name=$1,email=$2,password=$3,phone=$4,role=$5 WHERE id=$6 RETURNING *`,[name,email,password,phone,role,id]);

  return result.rows[0];
};


const deleteUser = async (id:string)=>{
    const result = await    pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`,[id]);

     return result;
}



export const userServices={
    getAllUser,
    updateUser,
    deleteUser,
}