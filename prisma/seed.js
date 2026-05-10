import bcrypt from 'bcrypt'
import { prisma } from '../prisma/client.js'

async function main() {
    const adminPassword = await bcrypt.hash('123456789', 10)
    const userPassword = await bcrypt.hash('12345678', 10)

    await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            name: 'admin',
            age: 30,
            email: 'admin@gmail.com',
            password: adminPassword,
            role: 'admin'
        }
    })

    await prisma.user.upsert({
        where: { email: 'john.email@email.com' },
        update: {},
        create: {
            name: 'john',
            age: 25,
            email: 'john.email@email.com',
            password: userPassword,
            role: 'user'
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })