import { parseId } from "../utilit/parse.js";
import { AppError } from "../utilit/AppError.js";
import {
    getAllProductsService,
    getProductByIdService,
    creatProductService,
    fullUpdateProductService,
    updateProductService,
    deleteProductsService,
    deleteProductImageService,
    uploadProductImagesService,
    getDeletedProductsService,
    restoreProductService
} from '../services/productService.js'


export const getProducts = async (req, res, next) => {
    try{
        const {
            name,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
            sortBy = 'id',
            order = 'asc'
        } = req.validateQuery || {}
        const result = await getAllProductsService({
            page,
            limit,
            name,
            minPrice,
            maxPrice,
            sortBy,
            order
        })
        return res.status(200).json(result)
    } catch (error) {
        return next(error)
    }
}

export const getPoductById = async (req, res, next) => {
    try{
         const id = parseId(req.params.id)
         if(id === null){
            return next(new AppError(400, 'Некоректный Id'))
         }
        const product = await getProductByIdService(id)

        return res.status(200).json({
            message: 'Продукт найден',
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        })

    }catch(error){
        return next(error)
    }
}

export const createProducts = async (req,res, next) => {
    try {
        const product = await creatProductService(req.body)
        return res.
        status(201)
        .json({
            message: 'Продукт создан',
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        })
    } catch (error) {
        return next(error)
    }
}

export const putProduct = async (req, res, next) => {
    const productId = parseId(req.params.id)
    if(productId === null) {
        return next(new AppError(400, 'Некоректный Id'))
    }
    try {
        const product = await fullUpdateProductService(productId, req.body)
        return res.status(200).json({
            message: 'Продукт успешно обновлен',
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        })
    } catch (error) {
        return next(error)
    }
}
export const patchProduct = async (req, res, next) => {
const productId = parseId(req.params.id)
if(productId === null) {
    return next(new AppError(400, 'Некоректный Id'))
}
try {
const product = await updateProductService(productId, req.body)
return res
.status(200)
.json({
    message: 'Продукт усаешно обновлён',
    product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    }
})
} catch(error) {
    return next(error)
}
}

export const deleteProduct = async (req, res, next) => {
    const productId = parseId(req.params.id)
    if(productId === null) {
        return next(new AppError(400,'Некоретный Id'))
    }
    try {
const product = await deleteProductsService(productId)
return res
.status(200)
.json({
    message: 'Продукт усаешно удалён',
    product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
        }
})
} catch(error){
    return next(error)
}
}

export const uploadProductImage = async (req, res, next) => {
try {
    const id = parseId(req.params.id)
    if(id === null){
        return next(new AppError(400, 'Некорректный Id'))
    }
    if(!req.file){
        return next(new AppError(400, 'Файл не обнаружен'))
    }
    const filePath = `/uploads/${req.file.filename}`

    const product = await uploadProductImagesService(id, filePath)

    return res.status(200).json({
        message: 'Изображение добавлено',
        product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }
    })
}catch (error){
    return next(error)
}
}

export const deleteProductImage = async (req, res, next) => {
    try{
        const id = parseId(req.params.id)
        if(id === null){
            return next(new AppError(400, 'Некорректный Id'))
        }
         const product = await deleteProductImageService(id)

        return res.status(200).json({
            message: 'Изображение удалено',
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        })

    }catch (error){
        return next(error)
    }
}

export const restoreProduct = async (req, res, next) => {
    try {
        const id = parseId(req.params.id)
        if (id === null) {
            return next(new AppError(400, 'Некорректный id'))
        }

        const product = await restoreProductService(id)

        return res.status(200).json({
            message: "Продукт востановлен",
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        })

    }catch (error){
        return next(error)
    }
}

export const getDeletedProducts = async (req, res, next) => {
    try {
        const products = await getDeletedProductsService()
        
        return res.status(200).json({
            message: 'Продукты найдены',
            products
        })

    }catch (error) {
        return next(error)
    }
}