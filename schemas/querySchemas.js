import { z } from 'zod'

export const productsQuerySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'name не может быть пустым')
        .optional(),

    minPrice: z.coerce
        .number()
        .positive('minPrice должен быть больше 0')
        .optional(),

    maxPrice: z.coerce
        .number()
        .positive('maxPrice должен быть больше 0')
        .optional(),

    page: z.coerce
        .number()
        .int('page должен быть целым числом')
        .min(1, 'page должен быть больше 0')
        .optional(),

    limit: z.coerce
        .number()
        .int('limit должен быть целым числом')
        .min(1, 'limit должен быть больше 0')
        .max(100, 'limit не должен быть больше 100')
        .optional(),

    sortBy: z.enum(['id', 'name', 'price']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
}).refine(
    (data) =>
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.minPrice <= data.maxPrice,
    {
        message: 'minPrice не может быть больше maxPrice'
    }
)
export const userQuerySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Имя обязательно')
        .optional(),

    role: z
        .enum(['admin', 'user'])
        .optional(),
    page: z.coerce
        .number()
        .min(1,'Страница не может быть меньше первой')
        .int('Страница должна быть целым числом')
        .optional(),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),
    sortBy: z
        .enum(['name', 'createdAt', 'role', 'id'])
        .optional(),
    order: z
        .enum(['asc', 'desc'])
        .optional(),
    minDate: z.coerce
        .date()
        .optional(),

    maxDate: z.coerce
        .date()
        .optional(),
}).refine(
    (data) =>
        data.minDate === undefined ||
        data.maxDate === undefined ||
        data.minDate <= data.maxDate,
    {
        message: 'minDate не может быть больше maxDate'
    }
)
