import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      if (!allowedEmail) {
        console.error('ADMIN_EMAIL environment variable is not configured. Rejecting all logins.');
        return false;
      }
      if (!user?.email || user.email.trim().toLowerCase() !== allowedEmail) {
        console.warn(`Unauthorized login attempt rejected for email: ${user?.email}`);
        return false; // Reject any non-admin account
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email.trim().toLowerCase();
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
        (session.user as any).isAdmin = true;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-32bytes!',
  trustHost: true,
});
