import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const domain = `${protocol}://${host}`;

        const filePath = path.join(process.cwd(), 'public', 'skill.md');
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // Dynamically replace placeholder with current host
        fileContent = fileContent.replace(/\[YOUR_DOMAIN\]/g, domain);

        return new NextResponse(fileContent, {
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Instructions not found' }, { status: 404 });
    }
}
