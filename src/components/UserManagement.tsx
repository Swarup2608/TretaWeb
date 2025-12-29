'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function UserManagement() {
    const { user, token } = useAuth();
    const { theme } = useTheme();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        role: 'admin'
    });

    // Only show for superadmins (user management is superadmin-exclusive)
    if (user?.role !== 'superadmin') {
        return (
            <div className={`rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-600' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'}`}>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                        Only superadmins can create and manage users.
                    </p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/user-management', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'create-user',
                    username: formData.username,
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    createdByUsername: user?.username
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to create user');
                setLoading(false);
                return;
            }

            const data = await res.json();

            setMessage(`User created successfully! Reset link:`);
            console.log('Reset Link:', data.resetLink);
            console.log('Email Content:', data.emailContent);

            // Copy reset link to clipboard
            navigator.clipboard.writeText(data.resetLink);

            setFormData({ username: '', name: '', email: '', role: 'admin' });
            setTimeout(() => setShowForm(false), 2000);
            setLoading(false);
        } catch (err) {
            console.error('Error creating user:', err);
            setError('Failed to create user');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    User Management
                </h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                    >
                        Create New User
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className={`p-3 rounded text-sm ${theme === 'dark' ? 'bg-red-900/20 border border-red-600 text-red-200' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className={`p-3 rounded text-sm ${theme === 'dark' ? 'bg-green-900/20 border border-green-600 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}>
                            <div>{message}</div>
                            <div className="mt-2 p-2 bg-opacity-50 rounded font-mono text-xs break-all">
                                {/* Reset link will be displayed here */}
                                Check console for reset link (copied to clipboard)
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            placeholder="e.g., john.doe"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            placeholder="e.g., John Doe"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            placeholder="e.g., john@example.com"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Cancel
                        </button>
                    </div>

                    <div className={`p-3 rounded text-xs ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-600 text-blue-200' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
                        <p className="font-medium mb-1">📧 How it works:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>User is created with a temporary password</li>
                            <li>A password reset link is generated (valid for 6 hours)</li>
                            <li>The reset link is copied to clipboard</li>
                            <li>Send this link to the user via email</li>
                            <li>User clicks the link to set their own password</li>
                        </ul>
                    </div>
                </form>
            )}
        </div>
    );
}
