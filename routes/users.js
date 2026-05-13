import { Router } from "express";
import { ownership } from "../middleWare/ownershipMiddleware.js";
import { authMiddleware } from "../middleWare/authMiddleware.js";
import { roleMiddleware } from "../middleWare/roleMiddleware.js";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateFullUser,
    updateUser,
    deleteUser,
    restoreUser,
    getDeletedUsers,
    uploadUserAvatar,
    deleteUserAvatar
} from "../controllers/usersControllers.js";
import { validate, validateQuery } from "../validate/validate.js";
import { patchUserSchema, createUserSchema } from "../schemas/userSchemas.js";
import { userQuerySchema } from "../schemas/querySchemas.js";
import { uploadAvatar } from "../middleWare/upload.js";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *           example: dima
 *         description: Фильтр по имени
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         description: Фильтр по роли
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Количество элементов на странице
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name, createdAt, role, id]
 *         description: Сортировка по полю
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Направление сортировки
 *       - in: query
 *         name: minDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-04-01
 *         description: Фильтр по минимальной дате создания
 *       - in: query
 *         name: maxDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-04-30
 *         description: Фильтр по максимальной дате создания
 *     responses:
 *       200:
 *         description: Список пользователей получен
 *       400:
 *         description: Ошибка валидации query-параметров
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    validateQuery(userQuerySchema),
    getAllUsers
);

/**
 * @swagger
 * /api/users/deleted:
 *   get:
 *     summary: Получить список удалённых пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список удалённых пользователей получен
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Удалённые пользователи не найдены
 */
router.get(
    "/deleted",
    authMiddleware,
    roleMiddleware("admin"),
    getDeletedUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
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
 *         description: Пользователь найден
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.get(
    "/:id",
    authMiddleware,
    ownership,
    getUserById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создать пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Dima
 *               age:
 *                 type: integer
 *                 example: 21
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               email:
 *                 type: string
 *                 example: dima@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    validate(createUserSchema),
    createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Полностью обновить пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
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
 *                 example: Dima
 *               age:
 *                 type: integer
 *                 example: 21
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               email:
 *                 type: string
 *                 example: dima@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлён
 *       400:
 *         description: Ошибка валидации или некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("user", "admin"),
    ownership,
    validate(createUserSchema),
    updateFullUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Частично обновить пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dima
 *               age:
 *                 type: integer
 *                 example: 22
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               email:
 *                 type: string
 *                 example: dima@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлён
 *       400:
 *         description: Ошибка валидации или некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("user", "admin"),
    ownership,
    validate(patchUserSchema),
    updateUser
);

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Восстановить удалённого пользователя
 *     tags: [Users]
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
 *         description: Пользователь успешно восстановлен
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.patch(
    "/:id/restore",
    authMiddleware,
    roleMiddleware("admin"),
    restoreUser
);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Загрузить аватар пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Аватар успешно загружен
 *       400:
 *         description: Некорректный ID или файл не загружен
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.post(
    "/:id/avatar",
    authMiddleware,
    roleMiddleware("admin", "user"),
    ownership,
    uploadAvatar.single("avatar"),
    uploadUserAvatar
);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   delete:
 *     summary: Удалить аватар пользователя
 *     tags: [Users]
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
 *         description: Аватар успешно удалён
 *       400:
 *         description: Некорректный ID или аватар отсутствует
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.delete(
    "/:id/avatar",
    authMiddleware,
    roleMiddleware("admin", "user"),
    ownership,
    deleteUserAvatar
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
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
 *         description: Пользователь успешно удалён
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Пользователь не найден
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("user", "admin"),
    ownership,
    deleteUser
);

export default router;