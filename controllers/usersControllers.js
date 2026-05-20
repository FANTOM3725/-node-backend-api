import { AppError } from "../utilit/AppError.js";
import {
    getAllUsersService,
    getUserByIdService,
    creatUserService,
    updateFullUserService,
    updateUserService,
    deleteUserService,
    restoreUserService,
    getDeletedUserService,
    uploadUserAvatarService,
    deleteUserAvatarService
} from '../services/usersService.js'
import { parseId } from "../utilit/parse.js";

export const getAllUsers = async (req, res, next) => {
    try{
        const {
            name,
            role,
            minDate,
            maxDate,
            sortBy,
            order,
            page,
            limit
        } = req.validateQuery || {}
        const result = await getAllUsersService({name, role, minDate, maxDate, sortBy, order, page, limit})
        return res.status(200).json({
            message: 'Список пользователей',
            ...result
        })
    }catch(error){
        return next(error)
    }
}
export const getUserById = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400,'Некоретный Id'))
        }

        const user = await getUserByIdService(id)

        return res.status(200).json({
            message: 'Пользователь найден',
            user
        })
    } catch(error) {
        next(error)
    }
}

export const createUser = async(req, res, next) => {
    try{
        const newUser = await creatUserService(req.body)

        return res.status(201).json({
            message: 'Пользователь создан',
            newUser
        })
    }catch(error){
        next(error)
    }
}
export const updateFullUser = async (req, res, next) => {
    try {
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400,'Некоретный Id'))
        }
        const updateUser = await updateFullUserService(id, req.body)

        return res.status(200).json({
            message: 'Пользовавтель полностью обновлён',
            user: updateUser
        })
    }catch (error){
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400,'Некоретный Id'))
        }
        const updateUser = await updateUserService(id, req.body)

        return res.status(200).json({
            message: 'Пользователь успешно обновлён',
            user: updateUser
        })
    }catch (error){
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400,'Некоретный Id'))
        }
        const deleteUser = await deleteUserService(id)

        return res.status(200).json({
            message: 'Пользователь удалён',
            user: deleteUser
        })

    }catch (error){
        next(error)
    }
}

export const restoreUser = async (req, res, next) => {
    try {
        const id = parseId(req.params.id)
        if(id === null) {
            return next(new AppError(400, 'Некорректный id'))
        }
            const restoreUser = await restoreUserService(id)
            return res.status(200).json({
                message: 'Пользователь успешно востановлен',
                user: restoreUser
            })

    }catch (error){
        next(error)
    }
}

export const getDeletedUsers = async (req, res, next) => {
    try {
        const deletedUsers = await getDeletedUserService()
        return res.status(200).json({
            message: 'Пользователи найдены',
            users: deletedUsers
        })
    }catch (error){
        next(error)
    }
}

export const uploadUserAvatar = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400, "Некоректный id"))
        }

        if(!req.file){
            return next( new AppError(400, "файл не загружен"))
        }
        const filePath = `/uploads/${req.file.filename}`
        const user = await uploadUserAvatarService(id, filePath)

        return res.status(200).json({
            message: 'Аватар успешно загружен',
            user: {
                id: user.id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                avatarUrl: user.avatarUrl

            }
        })
    }catch (error){
        return next(error)
    }
}

export const deleteUserAvatar = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400, 'Некоректный id'))
        }

        const user = await deleteUserAvatarService(id)

        return res.status(200).json({
            message: "Аватар успешно удвлён",
            user: {
                id: user.id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                avatarUrl: user.avatarUrl
            }
        })
    }catch(error){
        return next(error)
    }
}