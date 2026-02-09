import { useState, useEffect } from 'react';
import { auth, type User } from '../lib/auth-client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChange((user) => {
      console.log('Auth state changed in useAuth:', user);
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: false, // For now, no roles in simple auth
    isModerator: false,
    signIn: () => auth.signIn(),
    signOut: () => auth.signOut()
  };
}