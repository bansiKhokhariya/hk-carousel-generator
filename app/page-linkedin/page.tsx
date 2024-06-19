'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { linkedinConfig } from '../../linkedin.config';
import EmojiPicker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';


const Page = () => {
  const [profile, setProfile] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [postText, setPostText] = useState<string>('');
  const [postFiles, setPostFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setPostText(postText + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPostFiles(filesArray);
    }
  };

  const handlePost = async () => {
    if (!authToken || !postText.trim()) return;
    const formData = new FormData();
    formData.append('urn', profile.sub);
    formData.append('token', authToken);
    formData.append('text', postText);
    if (postFiles.length > 0) {
      postFiles.forEach((file, index) => {
        formData.append(`files`, file, file.name);
      });
    }

    try {
      await axios.post('/api/linkedin/post/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Post shared successfully');
      setPostText('');
      setPostFiles([]);
    } catch (error) {
      setError('Failed to share Post');
    }
  };

  return (
    <div className='container'>
      <h1 className='text-4xl'>LinkedIn Share Post</h1>
      {!profile ? (
        <button onClick={handleAuth}>
          <img className='h-10 mt-2' src={`${process.env.NEXT_PUBLIC_APP_URL}/signInLinkedin.png`} alt="Sign in with LinkedIn" />
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
          <div className='flex'>
            <textarea
              value={postText}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
              rows={4}
              cols={50}
              className='border'
            ></textarea>
            {showEmojiPicker && (
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            )}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className='btn btn-sm bg-blue-200 mb-2'
            >
              😊
            </button>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className='border'
            />
          </div>
          <button onClick={handlePost} className='btn btn-sm bg-blue-200 mb-2'>Share a Post</button>
        </div>
      )}
    </div>
  );
};

export default Page;