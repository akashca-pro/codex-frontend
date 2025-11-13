import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Eye, EyeOff } from "lucide-react"
import { deleteAccountSchema, type DeleteAccountSchemaType } from "../../schema"
import { useState } from "react"
import { toast } from "sonner"
import { useAuthActions } from "@/hooks/useDispatch"
import type { ProfileMutations } from "./apis"

interface DeleteAccountModalProps {
  open: boolean
  onClose: () => void
  deleteAccount : ProfileMutations['deleteAccount']
}

export default function DeleteAccountModal({ open, onClose, deleteAccount }: DeleteAccountModalProps) {
  const { logout } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<DeleteAccountSchemaType>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmText: "",
      password: "",
    },
  })

  const onSubmit = async (values: DeleteAccountSchemaType) => {
    const payload = {
      password : values.password
    }
    const toastId = toast.loading('Processing...');
    try {
      const res = await deleteAccount(payload).unwrap();
      onClose();
      logout();
      toast.success(res.message,{
        className : 'success-toast',
        id : toastId,
      });
    } catch (error : any) {
      const apiErrors = error?.data?.error
      
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.dismiss(toastId);
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
      toast.error('Error',{
          className : 'error-toast',
          id : toastId,
          description : error?.data?.message
      })
    }
   
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent 
      className="sm:max-w-md"
      onInteractOutside={(e) => e.preventDefault()} 
      onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Warning Message */}
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-destructive">This action cannot be undone</h4>
                  <p className="text-sm text-muted-foreground">Deleting your account will permanently remove:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Your profile and personal information</li>
                    <li>• All your problem submissions</li>
                    <li>• Your progress statistics, leaderboard and achievements</li>
                    <li>• Any saved code or notes</li>
                  </ul>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Confirmation Text */}
                <FormField
                  control={form.control}
                  name="confirmText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type <strong>DELETE</strong> to confirm
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="DELETE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Confirmation */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm with your password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={form.watch("confirmText") !== "DELETE" || !form.watch("password")}
                  >
                    Delete Account
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
