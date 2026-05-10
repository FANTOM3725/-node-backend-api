import { AppError } from '../utilit/AppError.js'
import {prisma} from '../prisma/client.js'
import fs from "fs";
import path from "path";

export const getAllProductsService = async ({
    page,
    limit,
    name,
    minPrice,
    maxPrice,
    sortBy,
    order
}) => {
    const where = {
        deletedAt: null
    }

    const skip = (page - 1) * limit

    if(name){
        where.name = {
            contains: name,
            mode: 'insensitive'
        }
    }

    if(maxPrice !== undefined || minPrice !== undefined){
        where.price = {}
        if(minPrice !== undefined){
            where.price.gte = minPrice
        }
        if(maxPrice !== undefined){
            where.price.lte = maxPrice
        }
    }
    const products = await prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: order
        }
    })
    const total = await  prisma.product.count({where})

    return {
        products,
        pagination: {
            page,
            skip,
            limit,
            total,
        totalPages: (Math.ceil(total / limit))
        }
    }
}

export const getProductByIdService = async (id) => {
    const product  = await prisma.product.findFirst({ where:{
            id,
            deletedAt: null
    }})
    if(!product) {
        throw new AppError(404,`Продукт с id : ${id} не найден`)
    }
        return product
    }

    export const creatProductService = async ({name, price}) => {
        const newProduct = await prisma.product.create({
            data:{
                name:name.trim(),
                price: price
            }
        })
        return newProduct
    }
    export const fullUpdateProductService = async (id, {name, price}) => {
    const existingProduct = await prisma.product.findFirst({
        where:{
            id,
            deletedAt: null
        }
    })
        if(!existingProduct){
            throw new AppError(404,`Продукт с id : ${id} не найден`)
        }
        return  prisma.product.update({
            where: {id},
            data:{
                name: name.trim(),
                price: price
            }
        })
    }

export const deleteProductsService = async (id) => {
    const existingProduct = await prisma.product.findFirst({
        where: {
            id,
        deletedAt: null
        }
    })
    if(!existingProduct){
        throw new AppError(404, `Продукт с id : ${id} не найден`)
    }
    return prisma.product.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}

export const updateProductService = async (id, {name, price}) =>{
    const existingProduct = await prisma.product.findUnique({
        where: {id}
    })
    if(!existingProduct){
        throw new AppError(404,` Продукт с id : ${id} не найден`)
    }
    const data = {}

    if(name !== undefined){
        if(typeof name !== 'string' || name.trim() === ''){
            throw new AppError(400,'Некоректное имя')
        }

        data.name = name.trim()
            }
    if(price !== undefined){
        if(typeof price !== 'number' || price <= 0){
            throw new AppError(400, 'Некорректная цена')
        }
        data.price = price
    }
    if(!Object.keys(data).length){
        throw new AppError( 400, 'Нет данных для обновления')
    }
    return prisma.product.update({
        where: {id},
        data
    })
}

export const uploadProductImagesService = async (id, filePath) => {
    const product = await prisma.product.findFirst({
        where: {
            id,
            deletedAt: null
        }
    })
    if(!product){
        throw new AppError(404, 'Продукт не найден')
    }

    const updateProduct = await prisma.product.update({
        where: { id },
        data:{
            imageUrl: filePath
        }
    })

    const oldImage = product.imageUrl
    if(oldImage){
        try {
            const oldImagePath = path.join(process.cwd(), oldImage.replace(/^\//, ''))

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath)
            }
        } catch (error) {
            console.error('Ошибка удаления старой картинки:', error.message)
        }
    }
    return updateProduct
}

export const deleteProductImageService = async (id) => {

    const product = await prisma.product.findFirst({
        where: {
            id,
            deletedAt: null
        }
    })

    if(!product){
        throw new AppError(404, 'Продукт не найден')
    }

    if(!product.imageUrl){
        throw new AppError(400, 'Изображение отсутсвует')
    }
     const image = product.imageUrl
    try{
        const imagePath = path.join(process.cwd(), image.replace(/^\//, ''))

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

    }catch (error){
        console.error('Ошибка удаления старой картинки', error.message)
    }

    return prisma.product.update({
        where: { id },
        data: {
            imageUrl: null
        }
    })
}

export const restoreProductService = async (id) => {
    const product = await prisma.product.findFirst({
        where: {
            id,
            NOT: {
                deletedAt: null
            }
        }
    })

    if(!product){
        throw new AppError(404, 'Продукт не найден')
    }
    return prisma.product.update({
        where: { id },
        data: {
            deletedAt: null
        }
    })
}

export const getDeletedProductsService = async () => {
    const product = await prisma.product.findMany({
        where: {
            NOT: {
                deletedAt: null
            }
        }
    })
    if(!product.length){
        throw new AppError(404,'Нет удалённых продуктов')
    }
    return product
}

