import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 500 });
    }

    try {
        const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch LinkedIn profile' }, { status: 500 });
    }
}
