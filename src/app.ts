import express from 'express'
import connectDb from './db'
import userRoute from './routes/userRoute'
import otpRouter from './routes/otpRoute'
import productRouter from './routes/productRoute'
import prodImageRouter from './routes/ProdImageRoute'
import fileRouter from './routes/fileRoute'
const app=express()

const port=8080
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/user',userRoute)
app.use('/otp',otpRouter)
app.use('/products',productRouter)
app.use('/image',prodImageRouter)
app.use('/file',fileRouter)


connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server running at http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log('db not connected',error)
})

export default app