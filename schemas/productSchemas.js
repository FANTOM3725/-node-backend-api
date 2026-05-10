import {z} from 'zod'

export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1,'Название обязательно'),
    price: z
        .number({
            invalid_type_error: 'Цена должна быть числом'
        })
        .positive('Цена должна быть больше 0')

})
export const patchProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1,'Название обязательно')
        .optional(),
    price: z
        .number({
            invalid_type_error: 'Цена должна быть числом'
        })
        .positive('Цена должна быть больше 0')
        .optional()
})