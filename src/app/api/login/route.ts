import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/utils/auth';
import { readEncryptedUsers } from '@/utils/encryption';
import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

// Simple rate limiting store (in production, use Redis)
const loginAttempts: Map<string, { count: number; resetTime: number }> = new Map();
const RATE_LIMIT_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    if (!attempt || now > attempt.resetTime) {
        loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (attempt.count >= RATE_LIMIT_ATTEMPTS) {
        return false;
    }

    attempt.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

        // Rate limiting check
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Read encrypted users from file
        const users = readEncryptedUsers();

        // Find user
        const user = users.find((u: any) => u.username === username);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Compare passwords
        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token using jose
        const token = await new SignJWT({ 
            user: { 
                id: user.id, 
                username: user.username, 
                name: user.name, 
                role: user.role 
            } 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // Create response with HttpOnly cookie
        const response = NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username, name: user.name, role: user.role },
            token
        });

        // Set HttpOnly, Secure, SameSite cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
