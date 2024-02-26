import {connect} from 'mongoose'
import { config } from "dotenv";
config()

let url=process.env.MONGOOSE_URI

const connectDb=async()=>{
    try {
        await connect(url as string)
        console.log('Database is connected')
        return Promise.resolve()
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export default connectDb