import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginAttempts: number;
  isLockedOut: boolean;
  lockoutRemaining: number;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  bootstrapAdmin: (email?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30; // 30 seconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Rate-limiting / lockout state
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Inactivity tracking
  const lastActivityRef = useRef<number>(Date.now());

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetActivity));

    const interval = setInterval(() => {
      if (currentUser && isAdmin) {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed > INACTIVITY_TIMEOUT) {
          console.warn('Admin auto-logout due to 30m inactivity');
          signOut(auth);
        }
      }
    }, 60000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetActivity));
      clearInterval(interval);
    };
  }, [currentUser, isAdmin, resetActivity]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLockedOut && lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining(prev => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut, lockoutRemaining]);

  // Sync profile & admin state
  const fetchProfile = useCallback(async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      const adminDocRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminDocRef);

      const isBootstrappedAdmin =
        user.email?.toLowerCase() === 'subodhjain2007777@gmail.com' ||
        userSnap.data()?.role === 'admin' ||
        adminSnap.exists();

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile(data);
        setIsAdmin(isBootstrappedAdmin);
      } else {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Little Sprout Explorer',
          role: isBootstrappedAdmin ? 'admin' : 'customer',
          addresses: [],
          wishlist: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
        setIsAdmin(isBootstrappedAdmin);

        if (isBootstrappedAdmin) {
          await setDoc(adminDocRef, {
            uid: user.uid,
            email: user.email || '',
            grantedAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Fallback check based on email
      const isBootstrappedAdmin = user.email?.toLowerCase() === 'subodhjain2007777@gmail.com';
      setIsAdmin(isBootstrappedAdmin);
      setUserProfile({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'Little Sprout Explorer',
        role: isBootstrappedAdmin ? 'admin' : 'customer',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const recordFailedAttempt = () => {
    const nextAttempts = loginAttempts + 1;
    setLoginAttempts(nextAttempts);
    if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
      setIsLockedOut(true);
      setLockoutRemaining(LOCKOUT_DURATION);
      throw new Error(`Too many failed attempts. For your security, account login is locked for ${LOCKOUT_DURATION} seconds.`);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (isLockedOut) {
      throw new Error(`Too many attempts. Please wait ${lockoutRemaining} seconds before trying again.`);
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setLoginAttempts(0);
      resetActivity();
    } catch (err: unknown) {
      recordFailedAttempt();
      throw err;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const isBootstrappedAdmin = email.toLowerCase() === 'subodhjain2007777@gmail.com';
    const newProfile: UserProfile = {
      id: res.user.uid,
      email,
      name,
      role: isBootstrappedAdmin ? 'admin' : 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', res.user.uid), newProfile);
    if (isBootstrappedAdmin) {
      await setDoc(doc(db, 'admins', res.user.uid), {
        uid: res.user.uid,
        email,
        grantedAt: new Date().toISOString(),
      });
    }
    setUserProfile(newProfile);
    setIsAdmin(isBootstrappedAdmin);
    resetActivity();
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    resetActivity();
    if (res.user) {
      await fetchProfile(res.user);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const bootstrapAdmin = async (targetEmail?: string) => {
    if (!currentUser) throw new Error('You must be signed in to bootstrap admin status');
    const emailToGrant = targetEmail || currentUser.email || '';
    const adminDocRef = doc(db, 'admins', currentUser.uid);
    await setDoc(adminDocRef, {
      uid: currentUser.uid,
      email: emailToGrant,
      grantedAt: new Date().toISOString(),
    });
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, { role: 'admin' }, { merge: true });
    setIsAdmin(true);
    if (userProfile) {
      setUserProfile({ ...userProfile, role: 'admin' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        loginAttempts,
        isLockedOut,
        lockoutRemaining,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        bootstrapAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
