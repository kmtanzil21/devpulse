import express, { type Application, type Request, type Response } from 'express'
import {Pool} from 'pg'
import bcrypt from 'bcryptjs'
import config from './config'
import { initDB, pool } from './DB'
const app: Application = express()
const port = config.port
app.use(express.json())


initDB();

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    "message": "Hello World!",
    "author": "Tanzil",
  })
})

app.post('/api/auth/signup', async(req:Request, res:Response)=>{
    const {name, email, password, role}=req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const result =await pool.query(`
        INSERT INTO users(name,email,password, role) VALUES($1,$2,$3,$4) RETURNING *
    `,[name, email, hashedPassword, role])
    
    res.status(201).json({
        success:true,
        message:"Data received successfully",
        data:{
            id: result.rows[0].id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            role: result.rows[0].role,
            created_at: result.rows[0].created_at,
            updated_at: result.rows[0].updated_at
        }
    })
    }catch(error:any){
        console.error(error);
        res.status(500).json({
            success:false,
            message: error.message,
            error:error
        })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})