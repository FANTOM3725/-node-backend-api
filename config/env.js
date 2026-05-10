import 'dotenv/config'

export const PORT = Number(process.env.PORT) || 3001
export const JWT_SECRET = process.env.JWT_SECRET
export const REFRESH_SECRET = process.env.REFRESH_SECRET
export const DATABASE_URL = process.env.DATABASE_URL

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
}

if (!REFRESH_SECRET) {
    throw new Error('REFRESH_SECRET is not defined')
}

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
}