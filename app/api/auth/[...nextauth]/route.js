import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUser } from "@/app/auth/actions"
import { PrismaClient } from '@prisma/client'
import { compare } from "bcryptjs"
import { signIn } from "next-auth/react"


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy : 'jwt'
    },
    providers: [
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){
                const user = await getUser(credentials)
                if(!user){
                    throw new Error("404");
                }
                const correct = await compare(credentials.password,user.password)
                if(!correct){
                    throw new Error("405");
                }
                return user;
            }
        })
    ],
    callbacks: {
        session : ({session , token})=>{
            return {
                ...session,
                user:{
                    ...session.user,
                    id: token.id
                }
            }
        },
        jwt: ({user, token})=>{
            if(user){
                return {
                    ...token,
                    id: user.id
                }
            }
            return token
        }
    },
    pages:{
        signIn: "/auth/signin",
        error: '/auth/signin'
    }
}

const handler = NextAuth(authOptions)

export {handler as GET , handler as POST}