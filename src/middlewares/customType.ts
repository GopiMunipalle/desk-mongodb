import { Request } from "express";

interface RequestWithUser extends Request{
    email?:string
}

export default RequestWithUser