import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyAuth } from '@/utils/auth';
import { encryptFile, decryptFile, readEncryptedUsers, writeEncryptedUsers } from '@/utils/encryption';
import fs from 'fs';
import path from 'path';

// In-memory store for password reset tokens (use database in production)
const passwordResetTokens: Map<string, { 
  userId: number; 
  token: string; 
  expiresAt: number;
  username: string;
  email: string;
}> = new Map();

export async function POST(request: NextRequest) {
    try {
        const { action, ...data } = await request.json();

        // Verify authentication for create-user, update-user, delete-user, edit-user and send-reset-link actions
        // Only superadmins can create, edit, or delete users
        if (action === 'create-user' || action === 'send-reset-link' || action === 'update-user' || action === 'delete-user' || action === 'edit-user') {
            const auth = await verifyAuth(request);
            const userRole = (auth.user as any)?.role;
            
            // Only superadmin can perform user management actions
            if (!auth.authenticated || userRole !== 'superadmin') {
                return NextResponse.json(
                    { error: 'Only superadmins can perform this action' },
                    { status: 403 }
                );
            }
        }

        if (action === 'create-user') {
            return await handleCreateUser(data);
        } else if (action === 'send-reset-link') {
            return await handleSendResetLink(data);
        } else if (action === 'update-user') {
            return await handleUpdateUser(data);
        } else if (action === 'edit-user') {
            return await handleEditUser(data);
        } else if (action === 'delete-user') {
            return await handleDeleteUser(data);
        } else if (action === 'verify-reset-token') {
            return await handleVerifyResetToken(data);
        } else if (action === 'reset-password') {
            return await handleResetPassword(data);
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('User management error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleCreateUser(data: any) {
    const { username, name, email, createdByUsername, role = 'admin' } = data;

    if (!username || !name || !email) {
        return NextResponse.json(
            { error: 'Missing required fields: username, name, email' },
            { status: 400 }
        );
    }

    if (!['admin', 'superadmin'].includes(role)) {
        return NextResponse.json(
            { error: 'Invalid role. Must be admin or superadmin' },
            { status: 400 }
        );
    }

    try {
        // Read users file
        const users = readEncryptedUsers();

        // Check if user already exists
        if (users.some((u: any) => u.username === username)) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await hashPassword(tempPassword);

        // Create new user
        const newUser = {
            id: Math.max(...users.map((u: any) => u.id), 0) + 1,
            username,
            password: hashedPassword,
            role,
            name,
            email
        };

        // Add to users
        users.push(newUser);
        writeEncryptedUsers(users);

        // Generate password reset token
        const resetToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        const expiresAt = Date.now() + 6 * 60 * 60 * 1000; // 6 hours

        passwordResetTokens.set(resetToken, {
            userId: newUser.id,
            token: resetToken,
            expiresAt,
            username,
            email
        });

        const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                username,
                name,
                email
            },
            resetLink,
            expiresIn: '6 hours',
            message: `User created. Send reset link to ${email}`,
            // In production, actually send email here
            emailContent: {
                to: email,
                subject: 'Your Account Has Been Created - Set Your Password',
                body: `Hello ${name},\n\nYour admin account has been created.\n\nUsername: ${username}\n\nPlease set your password by clicking the link below:\n${resetLink}\n\nThis link will expire in 6 hours.\n\nIf you did not request this, please contact your administrator.\n\nBest regards,\nAdmin Team`
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

async function handleSendResetLink(data: any) {
    const { userId } = data;

    if (!userId) {
        return NextResponse.json(
            { error: 'Missing userId' },
            { status: 400 }
        );
    }

    try {
        const users = readEncryptedUsers();

        const user = users.find((u: any) => u.id === userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate new reset token
        const resetToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        const expiresAt = Date.now() + 6 * 60 * 60 * 1000;

        passwordResetTokens.set(resetToken, {
            userId,
            token: resetToken,
            expiresAt,
            username: user.username,
            email: user.email
        });

        const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        return NextResponse.json({
            success: true,
            resetLink,
            expiresIn: '6 hours',
            emailContent: {
                to: user.email,
                subject: 'Reset Your Password',
                body: `Hello ${user.name},\n\nPlease reset your password by clicking the link below:\n${resetLink}\n\nThis link will expire in 6 hours.\n\nIf you did not request this, please contact your administrator.`
            }
        });
    } catch (error) {
        console.error('Error sending reset link:', error);
        return NextResponse.json(
            { error: 'Failed to send reset link' },
            { status: 500 }
        );
    }
}

async function handleVerifyResetToken(data: any) {
    const { token } = data;

    if (!token) {
        return NextResponse.json(
            { error: 'Missing token' },
            { status: 400 }
        );
    }

    const resetData = passwordResetTokens.get(token);

    if (!resetData) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 400 }
        );
    }

    if (resetData.expiresAt < Date.now()) {
        passwordResetTokens.delete(token);
        return NextResponse.json(
            { error: 'Token has expired. Request a new reset link.' },
            { status: 400 }
        );
    }

    return NextResponse.json({
        success: true,
        username: resetData.username,
        email: resetData.email
    });
}

async function handleResetPassword(data: any) {
    const { token, newPassword, confirmPassword } = data;

    if (!token || !newPassword || !confirmPassword) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    if (newPassword !== confirmPassword) {
        return NextResponse.json(
            { error: 'Passwords do not match' },
            { status: 400 }
        );
    }

    if (newPassword.length < 8) {
        return NextResponse.json(
            { error: 'Password must be at least 8 characters' },
            { status: 400 }
        );
    }

    const resetData = passwordResetTokens.get(token);

    if (!resetData) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 400 }
        );
    }

    if (resetData.expiresAt < Date.now()) {
        passwordResetTokens.delete(token);
        return NextResponse.json(
            { error: 'Token has expired. Request a new reset link.' },
            { status: 400 }
        );
    }

    try {
        const users = readEncryptedUsers();

        const user = users.find((u: any) => u.id === resetData.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Hash and update password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;

        writeEncryptedUsers(users);

        // Delete used token
        passwordResetTokens.delete(token);

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully. You can now log in.'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        );
    }
}

async function handleUpdateUser(data: any) {
    const { userId, username, name, email } = data;

    if (!userId) {
        return NextResponse.json(
            { error: 'Missing userId' },
            { status: 400 }
        );
    }

    try {
        const users = readEncryptedUsers();

        const userIndex = users.findIndex((u: any) => u.id === userId);
        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = users[userIndex];

        // Update only provided fields
        if (username && username !== user.username) {
            // Check if new username is already taken
            if (users.some((u: any) => u.username === username && u.id !== userId)) {
                return NextResponse.json(
                    { error: 'Username already exists' },
                    { status: 400 }
                );
            }
            user.username = username;
        }

        if (name) user.name = name;
        if (email) user.email = email;

        users[userIndex] = user;
        writeEncryptedUsers(users);

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

async function handleDeleteUser(data: any) {
    const { userId } = data;

    if (!userId) {
        return NextResponse.json(
            { error: 'Missing userId' },
            { status: 400 }
        );
    }

    try {
        let users = readEncryptedUsers();

        const userIndex = users.findIndex((u: any) => u.id === userId);
        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const deletedUser = users[userIndex];

        // Remove user from array
        users = users.filter((u: any) => u.id !== userId);
        writeEncryptedUsers(users);

        // Clean up any reset tokens for this user
        for (const [token, tokenData] of passwordResetTokens.entries()) {
            if (tokenData.userId === userId) {
                passwordResetTokens.delete(token);
            }
        }

        return NextResponse.json({
            success: true,
            message: `User ${deletedUser.username} deleted successfully`,
            deletedUser: {
                id: deletedUser.id,
                username: deletedUser.username,
                name: deletedUser.name,
                email: deletedUser.email
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}

async function handleEditUser(data: any) {
    const { userId, username, name, email, role } = data;

    if (!userId) {
        return NextResponse.json(
            { error: 'Missing userId' },
            { status: 400 }
        );
    }

    if (role && !['admin', 'superadmin'].includes(role)) {
        return NextResponse.json(
            { error: 'Invalid role. Must be admin or superadmin' },
            { status: 400 }
        );
    }

    try {
        const users = readEncryptedUsers();

        const userIndex = users.findIndex((u: any) => u.id === userId);
        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = users[userIndex];

        // Update only provided fields
        if (username && username !== user.username) {
            // Check if new username is already taken
            if (users.some((u: any) => u.username === username && u.id !== userId)) {
                return NextResponse.json(
                    { error: 'Username already exists' },
                    { status: 400 }
                );
            }
            user.username = username;
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        users[userIndex] = user;
        writeEncryptedUsers(users);

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error editing user:', error);
        return NextResponse.json(
            { error: 'Failed to edit user' },
            { status: 500 }
        );
    }
}

setInterval(() => {
    const now = Date.now();
    for (const [token, data] of passwordResetTokens.entries()) {
        if (data.expiresAt < now) {
            passwordResetTokens.delete(token);
        }
    }
}, 60 * 60 * 1000);
