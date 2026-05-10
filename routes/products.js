import {Router} from 'express'
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
import {validate} from "../validate/validate.js";
import {
    createProductSchema,
    patchProductSchema
       } from "../schemas/productSchemas.js";
import { authMiddleware } from '../middleWare/authMiddleware.js'
    import { roleMiddleware } from '../middleWare/roleMiddleware.js'
import {uploadImage} from "../middleWare/upload.js";

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
router.get('/deleted',
    authMiddleware,
    roleMiddleware('admin'),
    getDeletedProducts
)
router.get('/:id',
    getPoductById)
router.post('/',
    authMiddleware,
    roleMiddleware('admin'),
    validate(createProductSchema),
    createProducts)
/**
 * @swagger
 * /api/products/{id}/image:
 *   post:
 *     summary: Добавить изображение к продукту
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ресурса
 *     requestBody:
 *          required: true
 *          content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Успешный ответ
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Нет токена
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Не найдено
 */
router.post('/:id/image',
    authMiddleware,
    roleMiddleware('admin'),
    uploadImage.single('image'),
    uploadProductImage
)
router.put('/:id',
    authMiddleware,
    roleMiddleware('admin'),
    validate(createProductSchema),
    putProduct)
router.patch('/:id/restore',
    authMiddleware,
    roleMiddleware('admin'),
    restoreProduct
    )
router.patch('/:id',
    authMiddleware,
    roleMiddleware('admin'),
    validate(patchProductSchema),
    patchProduct)
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
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Изображение успешно удалён
 *       400:
 *         description: Некорректный ID или аватар отсутствует
 *       401:
 *         description: Нет токена
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Изображение не найден
 */
router.delete('/:id/image',
    authMiddleware,
    roleMiddleware('admin'),
    deleteProductImage
)
router.delete('/:id',
    authMiddleware,
    roleMiddleware('admin'),
    deleteProduct)

export default router