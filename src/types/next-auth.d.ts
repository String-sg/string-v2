import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: 'user' | 'admin' | 'moderator';
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: 'user' | 'admin' | 'moderator';
  }
}