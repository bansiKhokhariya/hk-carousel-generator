'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { linkedinConfig } from '../../linkedin.config';

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [postText, setPostText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;    
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // First useEffect to set the auth token
  useEffect(() => {
    const token = getCookie('linkedin_access_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);  

  // Second useEffect to fetch user info once the token is set
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!authToken) return;

      try {
        const response = await axios.get('/api/linkedin/userinfo', {
          params: { token: authToken },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserInfo();
  }, [authToken]);


  const handleAuth = () => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinConfig.clientId}&redirect_uri=${linkedinConfig.redirectUri}&state=gkven&scope=${linkedinConfig.scope}`;
    window.location.href = authUrl;
  };


  const handlePost = async () => {
    if (!authToken || !postText.trim()) return;

    try {
      await axios.post('/api/linkedin/post', {
        urn: profile.id,
        token: authToken,
        text: postText,
      });

      setMessage('Post shared successfully');
      setPostText('');
    } catch (error) {
      setError('Failed to share Post');
    }
  };

  return (
    <div className='container'>
      <h1 className='text-4xl'>LinkedIn Share Post</h1>
      {!profile ? (
        <button onClick={handleAuth}>
          <img className='h-10 mt-2' src={`${process.env.NEXT_PUBLIC_APP_URL}/signInLinkedin.png`} alt="" />
        </button>
      ) : (

        <div className='border container'>
          <h2 className='text-2xl mt-2'>Profile Information</h2>

          {message && <p>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className='flex items-center mb-5'>
            <img className='rounded-full me-3' src={profile.picture} alt="ProfileImage" />
            <div>
              <p>First Name: {profile.name}</p>
              <p>Last Name: {profile.family_name}</p>
              <p>Email: {profile.email}</p>
            </div>
          </div>
          <div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              cols={50}
              className='border'
            ></textarea>
          </div>
          <button onClick={handlePost} className='btn btn-sm bg-blue-200 mb-2'>Share a Post</button>
        </div>
      )}
    </div>
  );
};

export default Page;
