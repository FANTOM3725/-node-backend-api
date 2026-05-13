import { Router } from 'express'
import {
    getProducts,
    getPoductById,
    createProducts,
    putProduct,
    patchProduct,
    deleteProduct,
    uploadProductImage,
    deleteProductImage,
    restoreProduct,
    getDeletedProducts
} from '../controllers/productsControllers.js'
import { validate } from "../validate/validate.js"
import {
    createProductSchema,
    patchProductSchema
} from "../schemas/productSchemas.js"
import { authMiddleware } from '../middleWare/authMiddleware.js'
import { roleMiddleware } from '../middleWare/roleMiddleware.js'
import { uploadImage } from "../middleWare/upload.js"

const router = Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех продуктов
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *           example: phone
 *         description: Фильтр по имени
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
 *           enum: [id, name, price]
 *         description: Сортировка по полю
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Направление сортировки
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *           example: 200
 *         description: Фильтр по минимальной цене
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *           example: 3000
 *         description: Фильтр по максимальной цене
 *     responses:
 *       200:
 *         description: Список продуктов получен
 *       400:
 *         description: Ошибка валидации query-параметров
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/deleted:
 *   get:
 *     summary: Получить список удалённых продуктов
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список удалённых продуктов получен
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Удалённые продукты не найдены
 */
router.get(
    '/deleted',
    authMiddleware,
    roleMiddleware('admin'),
    getDeletedProducts
)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт найден
 *       400:
 *         description: Некорректный ID
 *       404:
 *         description: Продукт не найден
 */
router.get('/:id', getPoductById)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать продукт
 *     tags: [Products]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 999
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 */
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    validate(createProductSchema),
    createProducts
)

/**
 * @swagger
 * /api/products/{id}/image:
 *   post:
 *     summary: Загрузить изображение продукта
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Изображение успешно загружено
 *       400:
 *         description: Некорректный ID или файл не загружен
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Продукт не найден
 */
router.post(
    '/:id/image',
    authMiddleware,
    roleMiddleware('admin'),
    uploadImage.single('image'),
    uploadProductImage
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Полностью обновить продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 999
 *     responses:
 *       200:
 *         description: Продукт успешно обновлён
 *       400:
 *         description: Ошибка валидации или некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Продукт не найден
 */
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    validate(createProductSchema),
    putProduct
)

/**
 * @swagger
 * /api/products/{id}/restore:
 *   patch:
 *     summary: Восстановить удалённый продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт успешно восстановлен
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Продукт не найден
 */
router.patch(
    '/:id/restore',
    authMiddleware,
    roleMiddleware('admin'),
    restoreProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновить продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               price:
 *                 type: number
 *                 example: 1099
 *     responses:
 *       200:
 *         description: Продукт успешно обновлён
 *       400:
 *         description: Ошибка валидации или некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Продукт не найден
 */
router.patch(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    validate(patchProductSchema),
    patchProduct
)

/**
 * @swagger
 * /api/products/{id}/image:
 *   delete:
 *     summary: Удалить изображение продукта
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Изображение успешно удалено
 *       400:
 *         description: Некорректный ID или изображение отсутствует
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Продукт не найден
 */
router.delete(
    '/:id/image',
    authMiddleware,
    roleMiddleware('admin'),
    deleteProductImage
)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт успешно удалён
 *       400:
 *         description: Некорректный ID
 *       401:
 *         description: Нет токена или токен невалиден
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Продукт не найден
 */
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    deleteProduct
)

export default router