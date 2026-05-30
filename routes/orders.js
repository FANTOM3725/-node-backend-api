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
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Получить список всех заказов
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Заказы получены
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllOrders
)
/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Получить список заказов пользователя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов пользователя получен
 *       401:
 *         description: Нет токена или токен невалиден
 */
router.get(
    "/my",
    authMiddleware,
    getMyOrders
)
/**
 * @swagger
 * /api/orders/my/{id}:
 *   get:
 *     summary: Получить заказ пользователя по id
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ найден
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.get(
    "/my/:id",
    authMiddleware,
    getMyOrdersById
)
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Получить заказ по id
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Заказ успешно получен
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getOrderById

)
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Создать заказ
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *       401:
 *         description: Нет токена или токен невалиден
 */
router.post(
    '/',
    authMiddleware,
    createOrder
)
/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Изменить статус заказа
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: cancelled
 *     responses:
 *       200:
 *         description: Статус успешно изменён
 *       400:
 *         description: Некорректный ID или body
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    validate(updateOrderStatusSchema),
    updateOrderStatus
)


export default router