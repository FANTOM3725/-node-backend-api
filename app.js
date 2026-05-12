import express from 'express'
import { errorHendler } from './middleWare/errorHendler.js'
import productsRouting from './routes/products.js'
import usersRouting from './routes/users.js'
import authRouting from './routes/auth.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.js'
import cookieParser from "cookie-parser"



export const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/products', productsRouting)
app.use('/api/users', usersRouting)
app.use('/api/auth', authRouting)
app.use('/uploads', express.static('uploads'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use((req, res) => {
    res.status(404).json({
        message: 'Страница не найдена'
    })
})

app.use(errorHendler)
