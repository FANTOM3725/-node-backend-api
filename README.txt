# Node Backend API

Backend API на Node.js и Express с аутентификацией, ролями, ownership-доступом, soft delete, загрузкой файлов, заказами, Prisma, PostgreSQL, Swagger, Docker и тестами.

## Стек

- Node.js
- Express
- PostgreSQL
- Prisma
- JWT
- bcrypt
- Zod
- Multer
- Vitest
- Supertest
- Swagger
- Docker

## Возможности

### Auth
- регистрация
- логин
- access token
- refresh token в httpOnly cookie
- logout
- protected routes
- admin-only route

### Users
- получение списка пользователей
- получение пользователя по id
- создание пользователя
- полное и частичное обновление пользователя
- soft delete
- восстановление удалённого пользователя
- получение удалённых пользователей
- загрузка аватара
- удаление аватара

### Products
- получение списка продуктов
- получение продукта по id
- создание продукта
- полное и частичное обновление продукта
- soft delete
- восстановление удалённого продукта
- получение удалённых продуктов
- загрузка изображения
- удаление изображения

### Orders
- создание заказа
- получение своих заказов
- получение своего заказа по id
- получение всех заказов для admin
- получение заказа по id для admin
- изменение статуса заказа для admin

### Validation
- body validation через Zod
- query validation через Zod

### Documentation
- Swagger UI

### Tests
- API tests через Vitest + Supertest

---

## Live Demo

- API: `YOUR_DEPLOY_LINK`
- Swagger: `YOUR_DEPLOY_LINK/api-docs`

---

## Локальный запуск

### 1. Установка зависимостей

```bash
npm install