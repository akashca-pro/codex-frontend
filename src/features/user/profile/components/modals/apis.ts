// user apis
import { useUpdateProfileMutation } from "@/apis/auth-user/profile/user"
import { useChangePasswordMutation } from '@/apis/auth-user/profile/user'
import { useUpdateEmailMutation, useChangeEmailresendOtpMutation, useVerifyEmailMutation } from '@/apis/auth-user/profile/user'
import { useDeleteAccountMutation } from '@/apis/auth-user/profile/user';

// admin apis
import { useAdminUpdateProfileMutation } from '@/apis/auth-user/profile/admin'
import { useAdminChangePasswordMutation } from '@/apis/auth-user/profile/admin'
import { useAdminUpdateEmailMutation, useAdminChangeEmailresendOtpMutation, useAdminVerifyEmailMutation } from '@/apis/auth-user/profile/admin'
import { useAdminDeleteAccountMutation } from '@/apis/auth-user/profile/admin'

export function useProfileMutations(isAdmin: boolean) {
  if (isAdmin) {
    const [updateProfile] = useAdminUpdateProfileMutation();
    const [changePassword] = useAdminChangePasswordMutation();
    const [updateEmail] = useAdminUpdateEmailMutation();
    const [resendOtp] = useAdminChangeEmailresendOtpMutation();
    const [verifyEmail] = useAdminVerifyEmailMutation();
    const [deleteAccount] = useAdminDeleteAccountMutation();

    return {
      updateProfile,
      changePassword,
      updateEmail,
      resendOtp,
      verifyEmail,
      deleteAccount,
    };
  }

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [updateEmail] = useUpdateEmailMutation();
  const [resendOtp] = useChangeEmailresendOtpMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  return {
    updateProfile,
    changePassword,
    updateEmail,
    resendOtp,
    verifyEmail,
    deleteAccount,
  };
}

export type ProfileMutations = ReturnType<typeof useProfileMutations>;