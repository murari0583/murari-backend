// require('dotenv').config({path:`./env`})

import dotenv from "dotenv";
import connectDB from "./db/index.js";





import express from "express"

dotenv.config({
    path:`./env`
})



connectDB()




















/*
const app= express()

//ify function execute fast

( async() =>  {
    try{
      await  mongoose.coonect(`${process.env.MONGODB_URI}/$
            {DB_NAME}`)
            app.on("error",(error)=>{
                console.log("ERRR:" , error)
                throw error
            })
            app.listen(process.env.PORT,()=>{
                console.log('App is listening on port ${process.env.PORT}');
            })

    }catch(error) {
        console.error('ERROR:' , error)
        throw
    }
})()
    */
