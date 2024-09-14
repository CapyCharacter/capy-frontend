"use client";

import { callAuthInfo } from '@/utils/backend/callAuthInfo';
import { UserLoginInfo } from '@/utils/backend/schemas/UserLoginInfo';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
    isAuthenticated: null;
} | {
    isAuthenticated: false;
} | ({
    isAuthenticated: true;
} & UserLoginInfo);

type AuthContextData = {
    auth: AuthContextType;
    setAuth: React.Dispatch<React.SetStateAction<AuthContextType>>;
};

const AuthContext = createContext<AuthContextData>({
    auth: {
        isAuthenticated: null,
    },
    setAuth: () => {},
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context.auth;
};

export const useSetAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useSetAuth must be used within an AuthProvider');
    }
    return context.setAuth;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthContextType>({
        isAuthenticated: null,
    });

    useEffect(() => {
        callAuthInfo().then((data) => {
            if (data) {
                setAuth({
                    isAuthenticated: true,
                    token: data.token,
                    user: data.user,
                });
            }
        }).catch(() => {
            setAuth({
                isAuthenticated: false,
            });
        });
    }, []);

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};
