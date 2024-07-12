'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export const getUser = async (data) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (user) {
        return user
    }
    return null
}