'use client'
import { signIn } from "next-auth/react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { getUser } from "../actions"
import { compare } from "bcryptjs"
import { useState } from "react"
import { Loader2 } from "lucide-react"


const FormSchema = z.object({
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
})

export default function SignIn({}) {
    const router = useRouter()
    const [loading,setLoading] = useState(false)
    const {toast} = useToast()
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password:""
        },
    })
    async function onSubmit(data) {
        setLoading(true)
        const user = await getUser(data);
        if(!user){
            toast({
                variant:"destructive",
                title:"Email dosen't exist",
                description:"Try Creating an Account"
            })
            setLoading(false)
        }else{
            const correctPass = await compare(data.password,user.password);
            if(!correctPass){
                toast({
                    variant: "destructive",
                    title: "Wrong Password!"
                })
                setLoading(false)
            }else{
                await signIn("credentials", { email: data.email, password: data.password, callbackUrl: `${window.location.origin}/` })
                setLoading(false)
            }
        }
    }
    return (
        <div className="flex flex-col h-[450px] w-[45%] items-start px-20">
            <Button 
            variant="outline" 
            className="w-[150px] bg-white text-black mb-20" 
            onClick={()=>{router.push("/auth/signup")}}  >Create Account</Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <h3 className="text-3xl font-bold text-gray-500 mb-5">Login</h3>
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
                    <div className="flex justify-end w-full flex-row">
                        <Button 
                        disabled={loading}
                        className="bg-[#FF748C] w-[100px] font-bold" 
                        type="submit">
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ):"Login"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
