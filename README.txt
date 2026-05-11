# Node Backend API

Backend API на Node.js и Express с аутентификацией, ролями, ownership-доступом, soft delete, загрузкой файлов, Prisma, PostgreSQL, Swagger, Docker и тестами.

## Stack

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

## Features

### Auth
- регистрация
- логин
- access token
- refresh token
- logout
- protected routes
- admin-only route

### Users
- CRUD пользователей
- роли `user` / `admin`
- ownership access
- soft delete
- restore
- список удалённых пользователей
- загрузка аватара
- удаление аватара

### Products
- CRUD товаров
- pagination
- filtering
- sorting
- soft delete
- restore
- список удалённых товаров
- загрузка изображения
- удаление изображения

### Validation
- body validation через Zod
- query validation через Zod

### Tests
- API tests через Vitest + Supertest

### Documentation
- Swagger UI

---

## Live Demo

- API: `https://node-backend-api-ivlj.onrender.com`
- Swagger: `https://node-backend-api-ivlj.onrender.com/api-docs`

---

## Local запуск

### 1. Установка зависимостей

```bash
npm install