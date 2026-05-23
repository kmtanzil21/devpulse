import express, { type Application, type Request, type Response } from 'express'
import {Pool} from 'pg'
import bcrypt from 'bcryptjs'
const app: Application = express()
const port = 5000
app.use(express.json())

const pool =new Pool({
    connectionString: "postgresql://neondb_owner:npg_r0n7YCMAKQTF@ep-lucky-breeze-aq1b4n4y-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB=async()=>{
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            
            )
            `,[])

    }catch(error){
        console.log(error);
    }

}
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