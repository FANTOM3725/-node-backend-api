import {roleMiddleware} from "../middleWare/roleMiddleware.js";
import {authMiddleware} from "../middleWare/authMiddleware.js";
import { updateOrderStatusSchema} from "../schemas/orderSchemas.js";
import {validate} from "../validate/validate.js";
import {Router} from "express"
import {
    createOrder,
    getAllOrders,
    getMyOrders,
    getMyOrdersById,
    getOrderById, updateOrderStatus,
} from "../controllers/ordersControllers.js";

const router = Router()

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllOrders
)
router.get(
    "/my",
    authMiddleware,
    getMyOrders

)
router.get(
    "/my/:id",
    authMiddleware,
    getMyOrdersById
)
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getOrderById

)
router.post(
    '/',
    authMiddleware,
    createOrder

)
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    validate(updateOrderStatusSchema),
    updateOrderStatus
)


export default router