import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BOOK_CALL_PATH = path.join(process.cwd(), 'public', 'SiteContent', 'bookCall.json');

async function saveToBookCall(data: any) {
  let calls = [];
  try {
    const file = await fs.readFile(BOOK_CALL_PATH, 'utf-8');
    calls = JSON.parse(file);
    if (!Array.isArray(calls)) calls = [];
  } catch {
    calls = [];
  }
  calls.unshift({ ...data, createdAt: new Date().toISOString() });
  await fs.writeFile(BOOK_CALL_PATH, JSON.stringify(calls, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.description || (!body.email && !body.mobile)) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }
    await saveToBookCall(body);
    // Send email via existing API
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/send-contact-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        subject: body.subject || 'Book a Call',
        message: body.description,
      }),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
