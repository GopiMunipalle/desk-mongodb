import express from 'express'
import connectDb from './db'
import userRoute from './routes/userRoute'
const app=express()

const port='8080'
app.use(express.json())
app.use('/user',userRoute)

connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server running at http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log('db not connected',error)
})

export default app