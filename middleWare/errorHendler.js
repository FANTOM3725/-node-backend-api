import { AppError } from "../utilit/AppError.js"

export const errorHendler = (err, req, res)=> {
    console.error(err)

    if(err instanceof AppError){
        return res.status(err.status).json({
            message: err.message
        })
    }
    return res.status(500).json({
        message: 'Server error'
    })
}