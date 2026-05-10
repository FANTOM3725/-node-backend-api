import { AppError } from "../utilit/AppError.js";
import jwt from 'jsonwebtoken'
import {JWT_SECRET} from "../config/env.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next(new AppError(401, 'Токен отсутствует'))
  }
  const [bearer, token] = authHeader.split(' ')

  if (bearer !== 'Bearer' || !token) {
    return next(new AppError(400, 'Некоректный формат токена'))
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    return next()
  } catch (error) {
    return next(new AppError(401, 'Невалидный токен'))
  }
}