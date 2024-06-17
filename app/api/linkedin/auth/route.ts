import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';
import axios from 'axios';
import { cookies } from 'next/headers'
import { linkedinConfig } from '../../../../linkedin.config';

const getLinkedInAuthURL = () => {
  const state = Math.random().toString(36).substring(7); // Random state for security
  const params = querystring.stringify({
    response_type: 'code',
    client_id: linkedinConfig.clientId,
    redirect_uri: linkedinConfig.redirectUri,
    state,
    scope: 'r_liteprofile r_emailaddress w_member_social'
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
};

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    if (!code) {
      const authURL = getLinkedInAuthURL();
      console.log('Redirecting to:', authURL);
      return NextResponse.redirect(authURL);
    }
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: linkedinConfig.redirectUri,
      client_id: linkedinConfig.clientId,
      client_secret: linkedinConfig.clientSecret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const { access_token } = response.data;
    console.log(access_token);
    if (access_token) {
      const cookieStore = cookies()
      cookieStore.set('linkedin_access_token', access_token);
      return NextResponse.redirect('https://hk-carousel-generator.vercel.app/page-linkedin');
    }
    return NextResponse.json({ access_token });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

