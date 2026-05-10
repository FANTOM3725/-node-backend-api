import { z } from "zod"

export const createUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1, "Имя обязательно")
        .optional(),
    age: z.coerce
        .number({
            invalid_type_error: 'Возраст должен быть числом'
        })
        .int('Возраст должен быть целым числом')
        .positive('Возраст должен быть больше 0')
        .optional(),

    email: z
        .string()
        .trim()
        .min(1, 'Email обязателен')
        .email('Некорректный email'),

    password: z.coerce
        .string()
        .min(4, 'Слишком короткий пароль'),
    role: z.enum(['admin', 'user'])

})

export const patchUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1, "Имя обязательно")
        .optional(),

    age: z.coerce
        .number({
            invalid_type_error: 'Возраст должен быть числом'
        })
        .int('Возраст должен быть целым числом')
        .positive('Возраст должен быть больше 0')
        .optional(),

    email: z
        .string()
        .trim()
        .min(1, 'Email обязателен')
        .email('Некорректный email')
        .optional(),

    password: z
        .string()
        .min(4, 'Слишком короткий пароль')
        .optional()
}).refine(

    (data) =>
        data.name !== undefined ||
        data.age !== undefined ||
        data.email !== undefined ||
        data.password !== undefined,

    {
        message: 'Нет данных для обновления'
    }
)

export const authSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1,'Введите имя')
        .email('Некорректный email'),
    password: z.coerce
        .string()
        .trim()
        .min(4,'Пароль слишком короткий')
})

