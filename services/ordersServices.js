import {prisma} from "../prisma/client.js";
import {AppError} from "../utilit/AppError.js";

export const getOrderByIdService = async (orderId) => {
const order = await prisma.order.findUnique({
    where: { id: orderId }
})
    if(!order){
        throw new AppError(404,"Заказ не найден")
    }

    return order
}

export const getMyOrderByIdService = async (orderId, userId) => {
const myOrder = await prisma.order.findFirst({
    where: {
        id: orderId,
        userId
    }
})
    if(!myOrder){
        throw new AppError(404, "Заказ не найден")
    }
    return myOrder
}

export const getMyOrdersService = async (userId) => {
return prisma.order.findMany({
    where: { userId}
})
}

export const getAllOrdersService = async () => {
return prisma.order.findMany()
}

export const createOrderService = async (userId) => {

    return prisma.order.create({
        data: { userId }
    })
}

export const updateOrderStatusService = async (orderId, status) => {

const order = await prisma.order.findUnique({
    where: { id: orderId }
})
    if(!order){
        throw new AppError(404,'Заказ не найден')
    }

    return prisma.order.update({
        where: {id: orderId},
        data: {
            status: status
        }
    })

}