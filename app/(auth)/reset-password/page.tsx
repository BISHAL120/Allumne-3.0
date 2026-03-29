import { ResetPasswordForm } from '@/components/auth/reset-password/reset-password-form'

const Page = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) => {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <div className="flex w-full items-center justify-center px-4">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <p className="text-center text-lg font-bold text-red-500">
            Invalid or expired token. Please request a new password reset.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}

export default Page