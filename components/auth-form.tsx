"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

export function AuthForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      })

      if (error) {
        setError(error.message || "Failed to sign in with GitHub")
        setIsLoading(false)
        return
      }
    } catch {
      setError("Failed to sign in with GitHub")
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {error && (
              <div className="text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <Button
              onClick={handleGitHubSignIn}
              className="w-full"
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Continue with GitHub
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}