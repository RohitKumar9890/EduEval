'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => { },
  signInWithGoogle: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

    if (IS_MOCK) {
      // Mock User for Demo
      setUser({
        uid: 'mock-uid-123',
        email: 'faculty@edueval.com',
        displayName: 'Demo Faculty',
      } as any);
      setUserData({
        uid: 'mock-uid-123',
        email: 'faculty@edueval.com',
        displayName: 'Demo Faculty',
        role: 'faculty',
        status: 'active',
      });
      // Store in localStorage for the api.ts interceptor
      localStorage.setItem('mock_user', JSON.stringify({
        uid: 'mock-uid-123',
        role: 'faculty',
        email: 'faculty@edueval.com'
      }));
      setLoading(false);
      return;
    }

    // Only use standard Firebase Authentication now
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({ ...userDoc.data(), uid: user.uid });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (process.env.NEXT_PUBLIC_MOCK_MODE !== 'true') {
      await signOut(auth);
    }
    localStorage.removeItem('mock_user');
    window.location.href = '/login';
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Provision user in Firestore if they don't exist
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: 'faculty', // PERMANENT SOLUTION: Default anyone to faculty for this demo
        status: 'active',
        joinedDate: new Date().toISOString()
      });
      setUserData({
        email: user.email,
        displayName: user.displayName,
        role: 'faculty',
        status: 'active',
        joinedDate: new Date().toISOString(),
        uid: user.uid
      });
    } else {
      setUserData({ ...userDoc.data(), uid: user.uid });
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
