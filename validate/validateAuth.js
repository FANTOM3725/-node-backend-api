import { AppError } from '../utilit/AppError.js'



export const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body

  if (
    typeof refreshToken !== 'string' ||
    refreshToken.trim() === ''
  ) {
    return next(new AppError(400, 'Refresh token обязателен'))
  }

  next()
}