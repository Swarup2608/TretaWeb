'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import UserManagement from '@/components/UserManagement';

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const { user, token } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: 'admin' });
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {
            loadUsers();
        }
    }, [token, router]);

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/get-users');

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to load users');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Failed to load users');
            setLoading(false);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!token) return;

        setDeleting(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/user-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete-user',
                    userId
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to delete user');
                setDeleting(false);
                return;
            }

            setMessage('User deleted successfully');
            setDeleteConfirm(null);
            await loadUsers();
            setDeleting(false);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
            setDeleting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !token) return;

        setEditLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user-management', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'edit-user',
                    userId: editingUser.id,
                    name: editFormData.name,
                    email: editFormData.email,
                    role: editFormData.role
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to edit user');
                setEditLoading(false);
                return;
            }

            setMessage('User updated successfully');
            setEditingUser(null);
            await loadUsers();
            setEditLoading(false);
        } catch (err) {
            console.error('Error editing user:', err);
            setError('Failed to edit user');
            setEditLoading(false);
        }
    };

    const openEditModal = (u: User) => {
        setEditingUser(u);
        setEditFormData({
            name: u.name,
            email: u.email,
            role: u.role
        });
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const isSuperadmin = user?.role === 'superadmin';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'}`}>
            {/* Header with Theme Toggle */}
            <header className={`shadow-lg animate-fade-in ${theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'} sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4 animate-slide-in">
                            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center gap-2 font-medium group">
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Users Management</h1>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 animate-slide-in animate-delay-100"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-6 h-6 text-yellow-400 animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-700 animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Messages */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl shadow-lg animate-fade-in ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-600' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'}`}>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{message}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={`mb-6 p-4 rounded-xl shadow-lg animate-fade-in ${theme === 'dark' ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-600' : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200'}`}>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>{error}</p>
                        </div>
                    </div>
                )}

                {/* User Management Component */}
                <div className="mb-8 animate-fade-in animate-delay-200">
                    <UserManagement />
                </div>

                {/* Users List */}
                <div className={`rounded-xl shadow-2xl card-hover animate-fade-in animate-delay-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'} p-6`}>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">All Users</span>
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="loader mx-auto mb-4"></div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Loading users...
                            </p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                No users found
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`border-b-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">ID</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Username</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Name</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Email</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Role</th>
                                        {isSuperadmin && (
                                            <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr
                                            key={u.id}
                                            className={`border-b ${theme === 'dark' ? 'border-gray-700/50 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-all duration-200 animate-fade-in`}
                                            style={{ animationDelay: `${0.4 + idx * 0.05}s` }}
                                        >
                                            <td className="py-4 px-4 font-mono text-sm">{u.id}</td>
                                            <td className="py-4 px-4 font-semibold text-indigo-600 dark:text-indigo-400">{u.username}</td>
                                            <td className="py-4 px-4">{u.name}</td>
                                            <td className="py-4 px-4 text-sm opacity-80">{u.email}</td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 ${u.role === 'superadmin'
                                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                                        }`}
                                                >
                                                    {u.role === 'superadmin' ? '⭐ ' : '👤 '}
                                                    {u.role}
                                                </span>
                                            </td>
                                            {isSuperadmin && (
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => openEditModal(u)}
                                                            title="Edit user"
                                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md ripple group"
                                                        >
                                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                        {deleteConfirm === u.id ? (
                                                            <div className="flex gap-1 animate-scale-in">
                                                                <button
                                                                    onClick={() => handleDelete(u.id)}
                                                                    disabled={deleting}
                                                                    title="Confirm delete"
                                                                    className="p-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900 rounded-lg transition-all duration-200 hover:scale-110 shadow-md disabled:opacity-50 ripple group"
                                                                >
                                                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    title="Cancel delete"
                                                                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110 shadow-md ripple group"
                                                                >
                                                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-90 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteConfirm(u.id)}
                                                                title="Delete user"
                                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md ripple group"
                                                            >
                                                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-2 border-blue-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'} animate-pulse-slow`}>
                        <p className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Total Users:</span> {users.length}
                        </p>
                    </div>
                </div>

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 max-w-md w-full`}>
                            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Edit User: {editingUser.username}
                            </h3>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Role
                                    </label>
                                    <select
                                        value={editFormData.role}
                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-md text-sm ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                                    >
                                        {editLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
