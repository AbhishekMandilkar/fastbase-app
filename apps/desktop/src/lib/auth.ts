import type { auth } from '@fastbase/api/src/lib/auth'
import {
  inferAdditionalFields,
  magicLinkClient,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins'
import { bearer } from 'better-auth/plugins'
import { createAuthClient } from 'better-auth/react'
import { toast } from 'sonner'
import { identifyUser } from './events'

export const CODE_CHALLENGE_KEY = 'fastbase.code_challenge'
export const BEARER_TOKEN_KEY = 'fastbase.bearer_token'

export const bearerToken = {
  get: () => localStorage.getItem(BEARER_TOKEN_KEY),
  set: (bearerToken: string) => localStorage.setItem(BEARER_TOKEN_KEY, bearerToken),
  remove: () => localStorage.removeItem(BEARER_TOKEN_KEY),
}

export const codeChallenge = {
  get: () => localStorage.getItem(CODE_CHALLENGE_KEY),
  set: (codeChallenge: string) => localStorage.setItem(CODE_CHALLENGE_KEY, codeChallenge),
  remove: () => localStorage.removeItem(CODE_CHALLENGE_KEY),
}

export function successAuthToast(newUser: boolean) {
  toast.success(
    newUser
      ? 'Welcome to Fastbase!'
      : 'Welcome back!',
    {
      duration: 10000,
    },
  )
}

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  basePath: '/auth',
  plugins: [
    inferAdditionalFields<typeof auth>(),
    bearer(),
    organizationClient(),
    twoFactorClient(),
    magicLinkClient(),
  ],
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: () => bearerToken.get() ?? undefined,
    },
    async onError({ error }) {
      if (error.status === 401) {
        fullSignOut()
      }
    },
  },
})

export async function fullSignOut() {
  await authClient.signOut()
  bearerToken.remove()
  identifyUser(null)
}
