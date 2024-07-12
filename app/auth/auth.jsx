'use client'

import { signOut,signIn } from 'next-auth/react'

export const Login=()=>{
    return (<button onClick={() => { signIn() }} >Signin</button>)
}
export const Signout=()=>{
    return (<button onClick={() => { signOut() }} >SignOut</button>)
}