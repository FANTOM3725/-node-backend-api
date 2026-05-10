import { AppError } from "../utilit/AppError.js"

export const roleMiddleware = (...allowedRoles) => {
    return (req,res, next) => {
        if(!req.user){
            return next(new AppError(401, 'Пользователь не авторизован'))
        }

        if(!allowedRoles.includes(req.user.role)){
            return next(new AppError(403, 'Доступ запрещён'))
        }
        next()
    }

}