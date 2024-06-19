'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { linkedinConfig } from '../linkedin.config';
import EmojiPicker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';

const PageLinkedin = () => {
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

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from reloading the page

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
        <div className="bg-muted">
            <div className="container px-8 py-8">
                <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center">Share a post on LinkedIn using this tool</h2>
                <div className='flex justify-between'>
                    <div>
                        <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 pt-2">
                            <li className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                                    <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                    </svg>
                                </span>
                                <h3 className="font-bold leading-tight">Authentication</h3>
                                <p className="text-sm">Sign In: Users need to sign in with their LinkedIn account using OAuth</p>
                            </li>
                            <li className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                    <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                                    </svg>
                                </span>
                                <h3 className="font-bold leading-tight">Profile Information</h3>
                                <p className="text-sm">Fetch Profile: A fter successful authentication, fetch and display the user's LinkedIn profile information.</p>
                            </li>
                            <li className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                    <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                    </svg>
                                </span>
                                <h3 className="font-bold leading-tight">Post Creation</h3>
                                <p className="text-sm">Text Input: A textarea for users to enter their post content.</p>
                                <p className="text-sm">File Upload: An option for users to upload images or videos for their post.</p>
                                <p className="text-sm">Emoji Picker: An emoji picker to add emojis to the post.</p>
                            </li>
                            <li className="ms-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                    <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.412 0H3.588A3.588 3.588 0 0 0 0 3.588v12.824A3.588 3.588 0 0 0 3.588 20h12.824A3.588 3.588 0 0 0 20 16.412V3.588A3.588 3.588 0 0 0 16.412 0ZM6 17H4V7h2Zm-1-12.19a1.19 1.19 0 1 1 0-2.38 1.19 1.19 0 0 1 0 2.38ZM17 17h-2v-4.5c0-3.184-4-2.941-4 0V17H9V7h2v1.403C12.932 6.336 17 5.973 17 9.87V17Z" />
                                    </svg>
                                </span>
                                <h3 className="font-bold leading-tight">Post Submission</h3>
                                <p className="text-sm">Form Submission: A button to submit the post to LinkedIn.</p>
                            </li>
                        </ol>
                        {!authToken ? <button className='mt-8' onClick={handleAuth}>
                            <img className='h-10' src={`${process.env.NEXT_PUBLIC_APP_URL}/signInLinkedin.png`} alt="Sign in with LinkedIn" />
                        </button> : <>
                            {profile ?
                                <div className="w-120px max-w-sm bg-white  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-8">
                                    <div className="flex flex-col items-center p-5">
                                        <img className="w-24 h-24 mb-3 rounded-full shadow-lg mt-2" src={profile.picture} alt="ProfileImage" />
                                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{profile.name}</h5>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</span>
                                    </div>
                                </div> :
                                <div role="status" className='w-120px max-w-sm bg-white  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-8 py-10 flex justify-center'>
                                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                </div>}
                        </>}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full h-full">
                        {error && <div className="bg-red-100 mb-2 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>}

                        {message && <div className="bg-green-100 mb-2 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>}

                        <h5 className="text-2xl font-medium text-gray-900 dark:text-white">Create post</h5>
                        <form onSubmit={handlePost}>
                            <div className="mb-4">
                                <textarea id="postText" rows={4} className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={postText} onChange={handleTextChange} required />
                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mt-2 p-1 border border-gray-300 rounded-md">😊</button>
                                {showEmojiPicker && (
                                    <div className="mt-2">
                                        <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                    </div>
                                )}
                            </div>
                            <div className="font-[sans-serif] max-w-md mx-auto mb-2">
                                <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                            </div>
                            <button
                                type="submit"
                                onClick={handlePost}
                                className={`px-4 py-2 rounded-md text-white ${authToken ? 'bg-blue-500' : 'bg-blue-500 opacity-50 cursor-not-allowed'}`}
                                disabled={!authToken}
                            >
                                Share Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLinkedin;
