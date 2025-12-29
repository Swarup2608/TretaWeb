'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const token = searchParams.get('token');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
            setLoading(false);
            return;
        }

        // Verify token
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const res = await fetch('/api/user-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify-reset-token',
                    token
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Invalid token');
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUsername(data.username);
            setEmail(data.email);
            setLoading(false);
        } catch (err) {
            console.error('Error verifying token:', err);
            setError('Failed to verify token');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/user-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reset-password',
                    token,
                    newPassword,
                    confirmPassword
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to reset password');
                setSubmitting(false);
                return;
            }

            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            console.error('Error resetting password:', err);
            setError('Failed to reset password');
            setSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`max-w-md w-full space-y-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg`}>
                <div>
                    <h2 className={`text-center text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Reset Password
                    </h2>
                    <p className={`mt-2 text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {username && `for ${username}`}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Verifying your reset link...
                        </p>
                    </div>
                ) : error && error.includes('Invalid') || error.includes('expired') ? (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-800">{error}</p>
                        <p className="mt-4">
                            <a href="/login" className="text-red-600 hover:text-red-500 font-medium">
                                Back to Login
                            </a>
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="rounded-md bg-green-50 p-4">
                                <p className="text-sm text-green-800">{success}</p>
                            </div>
                        )}

                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="newPassword" className="sr-only">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500 text-gray-900'} rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500 text-gray-900'} rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Remember your password?{' '}
                                <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
