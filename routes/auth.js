import { Router } from "express";
import {validate} from "../validate/validate.js";
import {authSchema} from "../schemas/userSchemas.js";

const router = Router()
import {login, registration, refresh, logout} from '../controllers/authControllers.js'
import { validateRefreshToken} from '../validate/validateAuth.js'
import { authMiddleware } from "../middleWare/authMiddleware.js";
import { roleMiddleware } from "../middleWare/roleMiddleware.js";
import {createUserSchema} from "../schemas/userSchemas.js";

router.post('/register',  validate(createUserSchema), registration)
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
router.post('/refresh', validateRefreshToken, refresh)
router.post('/logout', validateRefreshToken, logout)
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Получить доступ к профилю
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Доcтуп разрешён
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
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
 *         description: Нет токена
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