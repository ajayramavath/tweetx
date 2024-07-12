"use server"
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()


export const getUser = async(data)=>{
    const user = await prisma.user.findUnique({
        where:{
            email : data.email
        }
    })
    if(user){
        return user
    }
    return null
}

export const createUser = async(data)=>{
    const hashedpassword = await hash(data.password,12)
    const user = await prisma.user.create({
        data:{
            email: data.email,
            password: hashedpassword.toString(),
            name: data.username,
        }
    })
    if(user){
        return user
    }
    return null
}
export const compare = async (password,hashedPassword)=>{
    const hash = await hash(password, 12);
    if(hash !== hashedPassword){
        return false;
    }
    return true;
}