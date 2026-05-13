import { Router } from "express";
import { validate } from "../validate/validate.js";
import { authSchema, createUserSchema } from "../schemas/userSchemas.js";
import { login, registration, refresh, logout } from '../controllers/authControllers.js'
import { authMiddleware } from "../middleWare/authMiddleware.js";
import { roleMiddleware } from "../middleWare/roleMiddleware.js";

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - role
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               age:
 *                 type: integer
 *                 example: 25
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               email:
 *                 type: string
 *                 example: john.email@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 */
router.post('/register', validate(createUserSchema), registration)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Логин пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.email@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Успешный вход
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Неверный email или пароль
 */
router.post('/login', validate(authSchema), login)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновить access token с помощью refresh token из cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token успешно обновлён
 *       401:
 *         description: Refresh token отсутствует или невалиден
 */
router.post('/refresh', refresh)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выйти из системы и удалить refresh token из cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Выход выполнен
 *       401:
 *         description: Refresh token отсутствует или невалиден
 */
router.post('/logout', logout)

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Получить профиль текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль успешно получен
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 */
router.get('/profile', authMiddleware, roleMiddleware('user', 'admin'), (req, res) => {
    res.status(200).json({
        message: 'Доступ разрешён',
        user: req.user
    })
})

/**
 * @swagger
 * /api/auth/admin-panel:
 *   get:
 *     summary: Доступ к административной панели
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Доступ разрешён
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Недостаточно прав
 */
router.get('/admin-panel', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.status(200).json({
        message: 'Добро пожаловать админ',
        user: req.user
    })
})

export default router