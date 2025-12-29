import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAuth } from '@/utils/auth';

// Allowed sections that can be updated
const ALLOWED_SECTIONS = [
    'hero', 'about', 'services', 'numbersHome', 'values', 
    'caseStudies', 'faq', 'footer', 'header', 'cta', 'meta'
];

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const auth = await verifyAuth(request);

        if (!auth.authenticated) {
            return NextResponse.json(
                { error: auth.error || 'Unauthorized' },
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

        const { sectionName, data } = await request.json();

        if (!sectionName || !data) {
            return NextResponse.json(
                { error: 'Missing sectionName or data' },
                { status: 400 }
            );
        }

        // Validate section name
        if (!ALLOWED_SECTIONS.includes(sectionName)) {
            return NextResponse.json(
                { error: 'Invalid section name' },
                { status: 400 }
            );
        }

        // Construct the file path
        const filePath = path.join(
            process.cwd(),
            'public',
            'SiteContent',
            `${sectionName}.json`
        );

        // Ensure path is within SiteContent directory (prevent directory traversal)
        const resolvedPath = path.resolve(filePath);
        const allowedDir = path.resolve(path.join(process.cwd(), 'public', 'SiteContent'));
        
        if (!resolvedPath.startsWith(allowedDir)) {
            return NextResponse.json(
                { error: 'Invalid file path' },
                { status: 400 }
            );
        }

        // Write the data to the JSON file
        fs.writeFileSync(resolvedPath, JSON.stringify(data, null, 2), 'utf8');

        return NextResponse.json({
            success: true,
            message: 'Section updated successfully'
        });
    } catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json(
            { error: 'Failed to update section' },
            { status: 500 }
        );
    }
}