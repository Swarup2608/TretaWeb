import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import { readEncryptedUsers } from '@/utils/encryption';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const auth = await verifyAuth(request);
        if (!auth.authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Read encrypted users file
        const users = readEncryptedUsers();

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
