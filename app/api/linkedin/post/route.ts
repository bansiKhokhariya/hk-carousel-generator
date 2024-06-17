import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest, res: NextResponse) {


    const body = await req.json(); // Parse the request body
    const { token, text } = body;

    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const urn = response.data.sub

    if (!urn || !token || !text) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', {
            author: `urn:li:person:${urn}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text,
                    },
                    shareMediaCategory: 'NONE',
                },
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error sharing post:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to share post' }, { status: 500 });
    }
}
