"use client"
import {z} from "zod"
import React, { useId } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { toast } from "sonner"
import { resetPassword } from "@/app/actions/auth-actions"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address!"
    }),
})

const ResetPassword = ({className}: {className?: string}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: "",
        },
    })

    const toastId = useId();
    async function onSubmit(values: z.infer<typeof formSchema>){
      toast.loading('sending password reset email...', {id: toastId})
      try{
          const {success, error} = await resetPassword({email: values.email || ""});
          if(!success){
              toast.error(error, {id: toastId})
          }else{
              toast.success("Password reset email sent! Please check your email for instructions.", {id: toastId})
          }
      }catch(error: any){
          toast.error(error?.message || "There is an error sending the password reset email!", {id: toastId})
      }
    }
  return (
    <div className={cn("grid gap-6", className)}>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full ">Reset Password</Button>
      </form>
    </Form>
    </div>
  )
}

export default ResetPassword