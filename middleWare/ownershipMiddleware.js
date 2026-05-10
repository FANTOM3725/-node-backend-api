import {AppError} from "../utilit/AppError.js";
import {parseId} from "../utilit/parse.js";

export const ownership = (req, res, next) => {
    const userId = parseId(req.params.id)
    if(userId === null){
        return next(new AppError(400,'Некорректный id'))
    }
    if(!req.user){
        return next(new AppError(401, 'Пройдите авторизацию'))
    }
    const {role, id} = req.user

    if(role === 'admin'){
        return next()
    }
    if(role === 'user' && userId !== id){
        return next(new AppError(403,'Доступ запрещён'))
    }
    return next()
}