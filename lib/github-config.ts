import { toast } from "sonner"

export async function checkGitHubConfig(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check-github-config')
    const { isConfigured } = await response.json()
    return isConfigured
  } catch {
    return false
  }
}

export function showGitHubConfigError() {
  toast.error("GitHub OAuth Not Configured", {
    description: "Please set up GitHub OAuth credentials. Go to GitHub Developer Settings, create a new OAuth App, and set the Authorization callback URL to: http://localhost:3000/api/auth/callback/github. Then copy the Client ID and Client Secret to your .env file.",
    duration: 8000,
  })
}