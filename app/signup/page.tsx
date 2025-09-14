import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo.svg"
import logoDark from "@/assets/logo-dark.svg"

import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image
            className="h-6 w-auto dark:hidden"
            src={logo}
            alt="MongoDB logo"
            width={88}
            height={24}
            priority
          />
          <Image
            className="hidden h-6 w-auto dark:block"
            src={logoDark}
            alt="MongoDB logo"
            width={88}
            height={24}
            priority
          />
        </Link>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}