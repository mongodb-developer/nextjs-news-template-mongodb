import { NextResponse } from 'next/server'

export async function GET() {
  const githubClientId = process.env.GITHUB_CLIENT_ID
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET

  const isConfigured = !!(githubClientId && githubClientId.trim() !== '' &&
                          githubClientSecret && githubClientSecret.trim() !== '')

  return NextResponse.json({ isConfigured })
}