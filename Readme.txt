# Backend API Project

Учебный backend-проект на Node.js и Express с аутентификацией, ролями, soft delete, загрузкой файлов и PostgreSQL через Prisma.

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

## Основной функционал

### Auth
- регистрация
- логин
- access token
- refresh token
- logout
- защищённые роуты

### Users
- CRUD пользователей
- роли `user` / `admin`
- ownership-доступ
- soft delete
- restore
- загрузка аватара
- удаление аватара
- список удалённых пользователей

### Products
- CRUD товаров
- pagination / filtering / sorting
- soft delete
- restore
- загрузка изображения
- удаление изображения
- список удалённых товаров

### Validation
- валидация body и query через Zod

### Tests
- API tests через Vitest + Supertest

## Docker

Запуск проекта:

```bash
docker compose up --build

---

## Установка

```bash
npm install

