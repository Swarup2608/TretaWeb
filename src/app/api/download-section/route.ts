import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import * as XLSX from 'xlsx';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Allowed sections that can be downloaded
const ALLOWED_SECTIONS = [
    'hero', 'about', 'services', 'numbersHome', 'values', 
    'caseStudies', 'faq', 'footer', 'header', 'cta', 'meta'
];

export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const sectionName = searchParams.get('section');
        const format = searchParams.get('format'); // csv, excel, json
        const includeImages = searchParams.get('includeImages') === 'true';

        if (!sectionName || !format) {
            return NextResponse.json(
                { error: 'Missing section name or format' },
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

        // Validate format
        if (!['csv', 'excel', 'json'].includes(format)) {
            return NextResponse.json(
                { error: 'Invalid format. Use csv, excel, or json' },
                { status: 400 }
            );
        }

        // Load section data
        const filePath = path.join(
            process.cwd(),
            'public',
            'SiteContent',
            `${sectionName}.json`
        );

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'Section file not found' },
                { status: 404 }
            );
        }

        const sectionData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Collect image paths from the data (only if including images)
        const imagePaths = includeImages ? extractImagePaths(sectionData) : [];

        // Create appropriate format
        if (format === 'json') {
            return await createJsonWithImages(sectionName, sectionData, imagePaths, includeImages);
        } else if (format === 'csv') {
            return await createCsvWithImages(sectionName, sectionData, imagePaths, includeImages);
        } else if (format === 'excel') {
            return await createExcelWithImages(sectionName, sectionData, imagePaths, includeImages);
        }

        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to generate download' },
            { status: 500 }
        );
    }
}

// Extract all image paths from the data
function extractImagePaths(data: any, paths: string[] = []): string[] {
    if (typeof data === 'string' && data.startsWith('/images/')) {
        paths.push(data);
    } else if (Array.isArray(data)) {
        data.forEach(item => extractImagePaths(item, paths));
    } else if (typeof data === 'object' && data !== null) {
        Object.values(data).forEach(value => extractImagePaths(value, paths));
    }
    return paths;
}

// Convert nested object to flat array for CSV/Excel
function flattenData(data: any, parentKey = ''): any[] {
    const rows: any[] = [];

    function flatten(obj: any, prefix = '') {
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                flatten(item, `${prefix}[${index}]`);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === 'object' && value !== null) {
                    flatten(value, newKey);
                } else {
                    if (rows.length === 0) {
                        rows.push({});
                    }
                    if (rows[rows.length - 1][newKey]) {
                        rows.push({});
                    }
                    rows[rows.length - 1][newKey] = value;
                }
            });
        } else {
            rows.push({ [prefix || 'value']: obj });
        }
    }

    flatten(data, parentKey);
    return rows;
}

// Create JSON with images zip
async function createJsonWithImages(sectionName: string, data: any, imagePaths: string[], includeImages: boolean) {
    // If not including images, just return the JSON file
    if (!includeImages || imagePaths.length === 0) {
        const jsonContent = JSON.stringify(data, null, 2);
        return new NextResponse(jsonContent, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${sectionName}.json"`,
            },
        });
    }

    // Otherwise create a zip with JSON and images
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    // Add JSON file
    archive.append(JSON.stringify(data, null, 2), { name: `${sectionName}.json` });

    // Add images if any
    if (imagePaths.length > 0) {
        for (const imagePath of imagePaths) {
            const fullPath = path.join(process.cwd(), 'public', imagePath);
            if (fs.existsSync(fullPath)) {
                const fileName = path.basename(imagePath);
                const dirName = path.basename(path.dirname(imagePath));
                archive.file(fullPath, { name: `images/${dirName}/${fileName}` });
            }
        }
    }

    await archive.finalize();

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of archive) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${sectionName}_json.zip"`,
        },
    });
}

// Create CSV with images zip
async function createCsvWithImages(sectionName: string, data: any, imagePaths: string[], includeImages: boolean) {
    // Convert data to CSV
    const flatData = flattenData(data);
    
    // Create CSV content
    let csvContent = '';
    if (flatData.length > 0) {
        const headers = Object.keys(flatData[0]);
        csvContent = headers.join(',') + '\n';
        
        flatData.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                const stringValue = String(value || '');
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            });
            csvContent += values.join(',') + '\n';
        });
    }

    // If not including images, just return the CSV file
    if (!includeImages || imagePaths.length === 0) {
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${sectionName}.csv"`,
            },
        });
    }

    // Otherwise create a zip with CSV and images
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.append(csvContent, { name: `${sectionName}.csv` });

    // Add images if any
    if (imagePaths.length > 0) {
        for (const imagePath of imagePaths) {
            const fullPath = path.join(process.cwd(), 'public', imagePath);
            if (fs.existsSync(fullPath)) {
                const fileName = path.basename(imagePath);
                const dirName = path.basename(path.dirname(imagePath));
                archive.file(fullPath, { name: `images/${dirName}/${fileName}` });
            }
        }
    }

    await archive.finalize();

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of archive) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${sectionName}_csv.zip"`,
        },
    });
}

// Create Excel with images zip
async function createExcelWithImages(sectionName: string, data: any, imagePaths: string[], includeImages: boolean) {
    // Convert data to Excel
    const flatData = flattenData(data);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sectionName);
    
    // Write to buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // If not including images, just return the Excel file
    if (!includeImages || imagePaths.length === 0) {
        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${sectionName}.xlsx"`,
            },
        });
    }

    // Otherwise create a zip with Excel and images
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.append(excelBuffer, { name: `${sectionName}.xlsx` });

    // Add images if any
    if (imagePaths.length > 0) {
        for (const imagePath of imagePaths) {
            const fullPath = path.join(process.cwd(), 'public', imagePath);
            if (fs.existsSync(fullPath)) {
                const fileName = path.basename(imagePath);
                const dirName = path.basename(path.dirname(imagePath));
                archive.file(fullPath, { name: `images/${dirName}/${fileName}` });
            }
        }
    }

    await archive.finalize();

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of archive) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${sectionName}_excel.zip"`,
        },
    });
}
