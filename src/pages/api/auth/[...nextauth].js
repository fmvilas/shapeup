import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt(params) {
      let { token, user } = params
      console.log('>>>', params)
      if (user) {
        token = { accessToken: token.access_token }
      }
  
      return token
    },
    async session(params) {
      const { session, user, token } = params
      console.log('-->', params)
      session.accessToken = token.accessToken
      session.user.id = token.id
      return session
    },
  }
}

export default NextAuth(authOptions)