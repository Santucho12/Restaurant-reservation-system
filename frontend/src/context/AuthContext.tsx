import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    email: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
    const [email, setEmail] = useState<string | null>(localStorage.getItem('adminEmail'));

    useEffect(() => {
        if (token) localStorage.setItem('adminToken', token);
        else localStorage.removeItem('adminToken');

        if (email) localStorage.setItem('adminEmail', email);
        else localStorage.removeItem('adminEmail');
    }, [token, email]);

    const login = (newToken: string, newEmail: string) => {
        setToken(newToken);
        setEmail(newEmail);
    };

    const logout = () => {
        setToken(null);
        setEmail(null);
    };

    return (
        <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
