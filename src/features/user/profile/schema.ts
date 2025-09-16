import { z } from 'zod';

export const updateEmailSchema = z.object({
    newEmail : z
    .email('Invalid email address')
    .min(5)
    .max(255),

    password : z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
})

export const changePasswordSchema = z.object({
    currPass : z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),

    newPass : z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),

  confirmPassword : z
    .string()

}).refine((data) => data.newPass === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const deleteAccountSchema = z.object({
    confirmText : z
    .string(),
    
    password : z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
})

export type UpdateEmailSchemaType = z.infer<typeof updateEmailSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type DeleteAccountSchemaType = z.infer<typeof deleteAccountSchema>;