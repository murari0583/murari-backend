import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credentials:true
}))


// data kaha se aayega aur kitna aayega 
app.use(express.json({limit: "16kb"}))

// url se data aayega 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// image store karwane ke liye aur koi bhi access kar sakta hai
app.use(express.static("public"))

// cookie parser server  aur browser ki cookie acces kar pau

app.use((cookieParser()))


// routes import

import userRouter from './routes/user.routes.js'

// routes declaration
 app.use("/api/v1/users",userRouter)

 



export {app}