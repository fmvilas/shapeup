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
    async jwt(token, user) {
      console.log('token', token)
      console.log('user', user)
      if (user) {
        token = { accessToken: user.accessToken }
      }
  
      return token
    },
    async session({ session, user, token }) {
      console.log(session)
      console.log(user)
      console.log(token)
      session.accessToken = token.accessToken
      session.user.id = token.id
      return session
    },
  }
}

export default NextAuth(authOptions)