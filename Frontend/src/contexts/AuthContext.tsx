import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  current_role?: string;
  profile_picture?: string;
  phone_number?: string;
  college_name?: string;
  resume_path?: string;
  bio?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  created_at?: string;
  status?: 'Active' | 'Inactive';
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, otp: string) => Promise<{ error: Error | null }>;
  sendOtp: (email: string) => Promise<{ error: Error | null, message?: string }>;
  verifyAdminLogin: (email: string, otp: string) => Promise<{ error: Error | null, user?: User | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null, user?: User | null, status?: string }>;
  signOut: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (value: boolean) => void;
  refreshUser: () => Promise<void>;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            if (userData.status === 'Inactive') {
              toast({ title: "Account Deactivated", description: "Your account is inactive.", variant: "destructive" });
              localStorage.removeItem('token');
              setUser(null);
            } else {
              setUser(userData);
            }
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Poll for user status updates (Immediate Access Revocation)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          // Check if status changed to Inactive
          if (userData.status === 'Inactive') {
            toast({
              title: "Access Revoked",
              description: "Your account has been deactivated by an administrator.",
              variant: "destructive"
            });
            signOut();
          } else {
            // Silently update user data to reflect other changes (like name, etc) but avoid re-renders if deep equal? 
            // For now just set user if status matches to keep it fresh
            setUser(prev => JSON.stringify(prev) !== JSON.stringify(userData) ? userData : prev);
          }
        } else if (res.status === 401 || res.status === 403) {
          signOut();
        }
      } catch (error) {
        console.error("Status check failed", error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Socket Connection Management
  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL, {
        query: { userId: user.id }
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]); // Re-run when user changes (login/logout)

  const sendOtp = async (email: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      });

      return { error: null, message: data.message };
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error sending OTP",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, otp: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: fullName, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      setShowOnboarding(true); // Enable onboarding overlay before setting user to prevent redirect
      setUser(data.user);

      toast({
        title: "Account created!",
        description: "Welcome to Student Workspace.",
      });

      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Sign up failed",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    }
  };

  const verifyAdminLogin = async (email: string, otp: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-admin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      localStorage.setItem('token', data.token);
      setUser(data.user);

      toast({
        title: "Admin Login Successful",
        description: "Welcome back, Admin.",
      });

      return { error: null, user: data.user };
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Verification failed",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.status === 'OTP_SENT') {
        toast({
          title: "Verification Required",
          description: data.message,
        });
        return { error: null, status: 'OTP_SENT' };
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      return { error: null, user: data.user };
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Sign in failed",
        description: err.message,
        variant: "destructive",
      });
      return { error: err, user: null };
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, sendOtp, verifyAdminLogin, showOnboarding, setShowOnboarding, refreshUser, socket }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
