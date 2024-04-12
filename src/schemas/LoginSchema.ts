import {z} from 'zod'
export const LoginSchema = z.object({
    username: z.string({
        required_error: "Username is required"
    }),
    password: z.string({
        required_error: "Password is required"
    }),
}) 

export type LoginType = z.infer<typeof LoginSchema>