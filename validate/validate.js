import {AppError} from "../utilit/AppError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        console.log(`req.body: ${req.body}`)

        if(!result.success){
            const message = result.error.issues[0]?.message || 'Некорректные данные'
            return next(new AppError(400, message))
        }
        req.body = result.data
        return  next()
    }
}

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const message = result.error.issues[0]?.message || 'Некорректные query-параметры';
            return next(new AppError(400, message));
        }

        req.validateQuery = result.data;
        return next();
    };
};