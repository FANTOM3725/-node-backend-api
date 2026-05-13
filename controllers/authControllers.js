import { registrationService,
    authService,
    refreshTokenService,
    logoutService} from "../services/authService.js";
import {AppError} from "../utilit/AppError.js";

export const registration = async(req, res, next) => {
    try{
        const user = await registrationService(req.body)

        return res.status(201).json({
            message: 'Пользователь успешно создан',
            user: user
        })
    }catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
  try {
    const tokens = await authService(req.body)

      res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
      })

    res.status(200).json({
      message: 'Успешный вход',
      accessToken: tokens.accessToken
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const  refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
          return next(new AppError(401, 'Refresh token отсутствует'))
      }

    const result = await refreshTokenService(refreshToken)

    return res.status(200).json({
      message: 'Access token обновлён',
      ...result
    })
  } catch (error) {
    return next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const  refreshToken  = req.cookies.refreshToken

    await logoutService(refreshToken)

      res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
      })

    return res.status(200).json({
      message: 'Выход выполнен'
    })
  } catch (error) {
    return next(error)
  }
}