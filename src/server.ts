import express, { type Application, type Request, type Response } from 'express'
import {Pool} from 'pg'
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            
            )
            `,[])

    }catch(error){
        console.log(error);
    }

}

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    "message": "Hello World!",
    "author": "Tanzil",
  })
})

app.post('/', async(req:Request, res:Response)=>{
    const body=req.body;
    res.status(201).json({
        success:true,
        message:"Data received successfully",
        data:body
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})