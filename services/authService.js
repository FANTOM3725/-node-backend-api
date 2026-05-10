import {prisma} from "../prisma/client.js";
import { AppError } from '../utilit/AppError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {JWT_SECRET, REFRESH_SECRET} from "../config/env.js";

export const registrationService = async ({name, age, role, email, password}) => {
    const existingUser = await prisma.user.findUnique({
        where: {email}
    })
    if(existingUser){
        throw  new AppError(400, 'Пользователь с таким email уже существует')
    }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await prisma.user.create({
            data:{
                name: name.trim(),
                age: age,
                email: email.trim(),
                password: hashedPassword,
                role: role
            }
        })
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    }

}

export const authService = async ({email, password}) => {

    const normalizedEmail = email.trim()

    const user = await prisma.user.findFirst({

        where: {
            email: normalizedEmail,
            deletedAt: null
        }

    })
    if(!user){
        throw new AppError(404, 'Пользователь с таким email не найден')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        throw new AppError(401,'Пароль введён не корректно')
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )

    const refreshToken = jwt.sign(
        {
            id: user.id,
        },
        REFRESH_SECRET,
        {
            expiresIn: '7d'
        }
    )

    await prisma.user.update({
        where:{id: user.id},
        data: {
            refreshToken: refreshToken
        }
    })
    return {
        accessToken,
        refreshToken
    }

}

export const refreshTokenService = async (refreshToken) => {
    if(!refreshToken){
        throw new AppError(401,'Токен отсутствует')
    }
    let decoded

    try{
        decoded = jwt.verify(refreshToken, REFRESH_SECRET)
    } catch(error) {
        throw new AppError('401', 'Невалидный refresh token')
    }
    const user = await prisma.user.findUnique({
        where: {id: decoded.id}
    })
    if (!user || user.refreshToken !== refreshToken) {

        throw new AppError(401, 'Невалидный refresh token')

    }

    const newAccessToken = jwt.sign(
        {
            id:user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: '15m'
        }
    )
    return {
        accessToken: newAccessToken
    }

}

export const logoutService = async (refreshToken) => {
    if(!refreshToken){
        throw new AppError(401, 'refresh token обязателен')
    }
    const user = await prisma.user.findFirst({
        where: {refreshToken}
    })

    if(!user){
        throw new AppError(404,'Пользователь не найден')
    }
    await prisma.user.update({
        where: {id: user.id},
        data: {refreshToken: null}
    })
}