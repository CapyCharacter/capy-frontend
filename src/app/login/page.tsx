"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useSetAuth } from '@/components/_common/AuthProvider';
import Button from '@/components/_common/Button';
import { callAuthLogin } from '@/utils/backend/callAuthLogin';
import Link from 'next/link';
import { useGlobalContext } from '@/components/_common/GlobalContextProvider';
import { createNotification } from '@/components/_common/Notification';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const auth = useAuth();
    const setAuth = useSetAuth();
    const searchParams = useSearchParams();
    const { setJustLoggedIn } = useGlobalContext();

    useEffect(() => {
        const registrationSuccess = searchParams.get('registrationSuccess') === 'true';
        if (registrationSuccess) {
            createNotification("Registration successful! Please login!");
            history.replaceState(null, '', '/login');
        }
    }, [searchParams, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await callAuthLogin({ email, password });
            if (response instanceof Error) {
                setError(response.message);
            } else {
                setAuth({
                    isAuthenticated: true,
                    token: response.token,
                    user: response.user,
                });
                setJustLoggedIn(true);
                router.push('/');
            }
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    if (auth.isAuthenticated === true) {
        router.push('/'); // Redirect to home if already logged in
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <LoginForm onSubmit={handleLogin} error={error} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div>
                                <Button
                                    label="Register"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => router.push('/register')}
                                    centerText={true}
                                />
                            </div>
                            <div>
                                <Button
                                    label="Forgot Password?"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => router.push('/forgot-password')}
                                    centerText={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface LoginFormProps {
    onSubmit: (e: React.FormEvent) => void;
    error: string;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error, email, setEmail, password, setPassword }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            {error && (
                <p className="text-sm mb-4">
                    <span className="text-red-500">{error}</span>{" "}
                    <span className="text-gray-500">
                        Do you want to{" "}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-800">
                            register
                        </Link>{" "}
                        instead?
                    </span>
                </p>
            )}
            <Button
                type="submit"
                label="Sign in"
                variant="primary"
                className="w-full py-3"
                centerText={true}
            />
        </form>
    );
};

export default LoginPage;
