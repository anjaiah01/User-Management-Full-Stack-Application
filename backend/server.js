import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import env from 'dotenv'
import UserRoutes from './routes/UserRoutes.js'

env.config()
mongoose.connect(process.env.MONGO_URI)    
.then(() => console.log("DataBase Connected"))
.catch((err) => console.log(err))


const app = express()
app.use(express.json())
app.use(cors())
app.use('/',UserRoutes)

app.listen(3000, () => {
    console.log("Server Running on PORT 3000")
})