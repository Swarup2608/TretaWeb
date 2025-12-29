import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function comparePassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Verify JWT token
export async function verifyJWTToken(token: string) {
    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload;
    } catch (error) {
        return null;
    }
}

// Get token from request headers or cookies
export function getTokenFromRequest(request: NextRequest): string | null {
    // Try to get from Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    // Try to get from cookies
    const token = request.cookies.get('auth_token')?.value;
    return token || null;
}

// Middleware to verify authentication on API routes
export async function verifyAuth(request: NextRequest) {
    const token = getTokenFromRequest(request);

    if (!token) {
        return {
            authenticated: false,
            user: null,
            error: 'No authentication token provided',
        };
    }

    const payload = await verifyJWTToken(token);

    if (!payload) {
        return {
            authenticated: false,
            user: null,
            error: 'Invalid or expired token',
        };
    }

    return {
        authenticated: true,
        user: payload.user,
        error: null,
    };
}
