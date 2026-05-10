import { registrationService, authService, refreshTokenService, logoutService} from "../services/authService.js";

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

    res.status(200).json({
      message: 'Успешный вход',
      ...tokens
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

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
    const { refreshToken } = req.body

    await logoutService(refreshToken)

    return res.status(200).json({
      message: 'Выход выполнен'
    })
  } catch (error) {
    return next(error)
  }
}