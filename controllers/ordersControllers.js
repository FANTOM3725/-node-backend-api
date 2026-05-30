import {parseId} from "../utilit/parse.js";
import {AppError} from "../utilit/AppError.js";
import {getMyOrderByIdService, getOrderByIdService, createOrderService, getAllOrdersService, getMyOrdersService, updateOrderStatusService} from "../services/ordersServices.js";

export const getOrderById = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400,"Некорректный id"))
        }

        const order = await getOrderByIdService(id)

        return res.status(200).json({
            message: 'Заказ успешно найден',
            order
        })
    }catch (error) {
        return next(error)
    }
}

export const getMyOrdersById = async (req, res, next) => {
    try{

        const orderId = parseId(req.params.id)
        if(orderId === null){
            return next(new AppError(400, 'Некорректный id'))
        }

        const userId = req.user.id

        const order = await getMyOrderByIdService(orderId, userId)

        return res.status(200).json({
            message: 'Заказ успешно найден',
            order
        })
    }catch (error) {
        return next(error)
    }
}

export const getAllOrders = async (req, res, next) => {
    try{

        const orders = await getAllOrdersService()

        return res.status(200).json({
            message: 'Заказы успешно найдены',
            orders
        })
    }catch (error){
        return next(error)}
}
export const updateOrderStatus = async (req, res, next) => {
    try{
        const orderId = parseId(req.params.id)
        if(orderId === null){
            return next(new AppError(400, "Некорректный id"))
        }

        const status = req.body.status

        const order = await updateOrderStatusService(orderId, status)

        return res.status(200).json({
            message: 'Статус заказа успешно обновлён',
            order
        })
    }catch (error) {
        return next(error)
    }
}

export const createOrder = async (req, res, next) => {
    try{

        const userId = req.user.id
        const order = await createOrderService(userId)

        return res.status(201).json({
            message: 'Заказ успешно создан',
            order
        })
    }catch (error){
        return next(error)
    }
}

export const getMyOrders = async (req, res, next) => {
    try{
        const userId = req.user.id
        const orders = await getMyOrdersService(userId)

        return res.status(200).json({
            message: 'Заказы успешно найдены',
            orders
        })
    }catch (error){
        return next(error)
    }
}
