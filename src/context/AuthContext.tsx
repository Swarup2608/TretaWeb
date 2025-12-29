'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
    id: number;
    username: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Try to restore session from JWT token in localStorage
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            // Decode JWT to get user info (client-side only for display)
            try {
                const payload = JSON.parse(atob(savedToken.split('.')[1]));
                if (payload.user) {
                    setToken(savedToken);
                    setUser(payload.user);
                } else {
                    // Token is invalid, clear it
                    localStorage.removeItem('token');
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                }
            } catch {
                // Token parsing failed
                localStorage.removeItem('token');
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (
        username: string,
        password: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Include cookies
            });

            if (!res.ok) {
                const data = await res.json();
                return {
                    success: false,
                    error: data.error || 'Login failed'
                };
            }

            const data = await res.json();

            if (data.success && data.token) {
                setToken(data.token);
                setUser(data.user);
                // Store token in localStorage as fallback
                localStorage.setItem('token', data.token);
                return { success: true };
            }

            return {
                success: false,
                error: 'Invalid response from server'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Network error or server unavailable'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        // Clear auth cookie
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict;';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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