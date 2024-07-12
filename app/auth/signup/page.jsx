'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getUser,createUser } from "../actions"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Loader2 } from "lucide-react"


const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z
        .string()
        .min(8, { message: "Min 8 characters" })
        .max(20, { message: "Max 20 characters" })
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must include atleat 1 Upper Case letter",
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "Password must include atleat 1 Lower Case letter",
        })
        .refine((password) => /[0-9]/.test(password), { message: "Password must include atleat 1 number" })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "Password must include atleat 1 special character",
        }),
    confirm: z.string()
}).refine((data) => data.password === data.confirm, {
    message: "Passwords doesn't match",
    path: ['confirm'],
})

export default function SignUp({ }) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading , setLoading]= useState(false)
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email:"",
            password:"",
            confirm:""
        },
    })
    async function onSubmit(data) {
        setLoading(true)
        const  existing = await getUser(data)
        if(existing){
            toast({
                title: "Email already exists!",
                variant: "destructive",
            })
            setLoading(false)
        }else{
            const user = await createUser(data)
            if (user) {
                console.log(user)
                toast({
                    title: "User Created",
                })
                await signIn("credentials", { email: data.email, password: data.password, callbackUrl: `${window.location.origin}/` })
                setLoading(false)
                router.push("/")
            } else {
                toast({
                    title: "Something went wrong!",
                    variant: "destructive",
                })
                setLoading(false)
            }
        }
    }
    return (
        <div className="flex flex-col h-[450px] w-[45%] items-start px-20">
            <Button 
            variant="outline" 
            className="w-[150px] bg-white text-black mb-20" 
            onClick={()=>{router.push("/auth/signin")}}  >Login</Button>
            <Form {...form}>
                <h3 className="text-3xl font-bold text-gray-500 mb-5">Create Account</h3>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="email" placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end w-full flex-row">
                        <Button 
                        disabled={loading}
                        className="bg-[#FF748C] w-[100px] font-bold" 
                        type="submit">
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : "Sign Up"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
