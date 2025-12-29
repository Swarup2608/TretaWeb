import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
import path from 'path';
import { verifyAuth } from '@/utils/auth';
import { existsSync } from 'fs';

// Allowed sections for image uploads
const ALLOWED_SECTIONS = ['hero', 'about', 'services', 'caseStudies', 'footer', 'header', 'favicon'];

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const auth = await verifyAuth(request);

        if (!auth.authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin or superadmin
        const userRole = (auth.user as any).role;
        if (userRole !== 'admin' && userRole !== 'superadmin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;
        const sectionName: string = data.get('sectionName') as string;

        if (!file || !sectionName) {
            return NextResponse.json({ error: 'Missing file or section name' }, { status: 400 });
        }

        // Validate section name
        if (!ALLOWED_SECTIONS.includes(sectionName)) {
            return NextResponse.json({ error: 'Invalid section name' }, { status: 400 });
        }

        // Validate file type
        let allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        
        // For favicon, also allow svg and ico
        if (sectionName === 'favicon') {
            allowedTypes = ['image/png', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
        }
        
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large' }, { status: 400 });
        }

        // Create directory path
        const uploadDir = path.join(process.cwd(), 'public', 'images', sectionName);
        const allowedDir = path.resolve(path.join(process.cwd(), 'public', 'images'));
        const resolvedUploadDir = path.resolve(uploadDir);

        // Prevent directory traversal
        if (!resolvedUploadDir.startsWith(allowedDir)) {
            return NextResponse.json({ error: 'Invalid directory' }, { status: 400 });
        }

        // Create directory if it doesn't exist
        await mkdir(uploadDir, { recursive: true });

        // For favicon, delete all existing favicon files first
        if (sectionName === 'favicon') {
            try {
                const files = await readdir(uploadDir);
                for (const file of files) {
                    if (file.startsWith('favicon.')) {
                        await unlink(path.join(uploadDir, file));
                    }
                }
            } catch (err) {
                // Directory might not exist yet, ignore
            }
        }

        // Generate filename
        const extension = path.extname(file.name).toLowerCase();
        let filename: string;
        
        if (sectionName === 'favicon') {
            // For favicon, use fixed name with extension
            filename = `favicon${extension}`;
        } else {
            // For other sections, use timestamp and sanitized name
            const timestamp = Date.now();
            const sanitizedName = path.basename(file.name, extension).replace(/[^a-z0-9-_]/gi, '_');
            filename = `${timestamp}_${sanitizedName}${extension}`;
        }
        
        const filepath = path.join(uploadDir, filename);

        // Final path validation
        const resolvedFilepath = path.resolve(filepath);
        if (!resolvedFilepath.startsWith(resolvedUploadDir)) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
        }

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(resolvedFilepath, buffer);

        // Return the public path
        const publicPath = `/images/${sectionName}/${filename}`;

        return NextResponse.json({
            success: true,
            path: publicPath,
            filename: filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}