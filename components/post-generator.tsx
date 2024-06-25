import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useComponentPrinter } from '@/libs/hooks/use-component-printer';
import { RefProvider } from "@/libs/providers/reference-context";
import { MainNav } from "./main-nav";
import { linkedinConfig } from '../linkedin.config';
import EmojiPicker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';
import axios from 'axios';

const PostGenerator = () => {
    const { componentRef, handlePrint, isPrinting } = useComponentPrinter();
    const [topic, setTopic] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');
    const [tone, setTone] = useState<string>('None');
    const [language, setLanguage] = useState<string>('English');
    const [activeTab, setActiveTab] = useState<string>('mobile');
    const [isAI, setIsAI] = useState<boolean>(false);
    const [profile, setProfile] = useState<any>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [postText, setPostText] = useState<string>('');
    const [postFiles, setPostFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loaderAI, setLoaderAI] = useState(false);
    const [loaderPost, setLoaderPost] = useState(false);

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

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
        const popupWidth = 600;
        const popupHeight = 600;
        const left = (window.screen.width / 2) - (popupWidth / 2);
        const top = (window.screen.height / 2) - (popupHeight / 2);

        window.open(
            authUrl,
            'LinkedInAuthPopup',
            `width=${popupWidth},height=${popupHeight},top=${top},left=${left},noopener,noreferrer`
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setLoaderAI(true);

        if (isAI) {
            const response = await fetch('/api/postgenerator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, keyword, tone, language }),
            });

            const data = await response.json();
            setPostText(data.postContent);
            setLoaderAI(false);
        } else {
            setPostText(topic);
        }
    };

    const handleTabChange = (tabName: string) => {
        setActiveTab(tabName);
    };

    const isActiveTab = (tabName: string) => {
        return activeTab === tabName;
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

        if (!authToken) {
            alert('authToken is required');
        } else if (!postText.trim()) {
            alert('Post Text is required');
        }

        if (!authToken || !postText.trim()) return;

        setLoaderPost(true);

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

            setPostText('');
            setPostFiles([]);
            setLoaderPost(false);

        } catch (error) {
            alert("failed share post!")
        }
    };

    const handleDelete = (index: number) => {
        setPostFiles(postFiles.filter((_, i) => i !== index));
    };

    return (
        <>
            <RefProvider myRef={componentRef}>
                <div className="flex-1 flex flex-col">
                    <MainNav
                        className="h-14 border-b px-6"
                        handlePrint={handlePrint}
                        isPrinting={isPrinting}
                    />
                </div>
            </RefProvider>
            <div className='bg-muted flex flex-col gap-10 items-center justify-center p-2 sm:p-8 w-full '>
                <div className="flex flex-col lg:flex-row gap-5 w-full">
                    <div className='w-full h-full flex flex-col gap-5'>
                        <div className={`p-4 bg-white shadow-lg rounded-md w-full h-full`}>
                            <h1 className="mb-4 text-2xl font-bold  text-gray-900 lg:text-3xl ">LinkedIn Post Generator</h1>
                            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-1">
                                        What is your post about?
                                    </label>
                                    <textarea value={topic}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTopic(e.target.value)} className="shadow appearance-none border rounded p-4 w-full text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Digital Marketing , Social Media , Content Marketing , Branding" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-lg font-bold mb-1">
                                        Keyword
                                    </label>
                                    <input value={keyword}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)} className="shadow appearance-none border rounded p-2 w-full text-gray-700 leading-tight focus:outline-none focus:border-blue-500" type="text" placeholder="Enter your Keywords" />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-6 ">
                                    <div className='w-full sm:w-1/2'>
                                        <label htmlFor="language" className="block text-gray-700 text-lg font-bold mb-1">
                                            Language
                                        </label>
                                        <select value={language}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)} id="language" name="language" className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="English">English</option>
                                            <option value="Gujarati">Gujarati</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="German">German</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Japanese">Japanese</option>
                                            <option value="Russian">Russian</option>
                                            <option value="Portuguese">Portuguese</option>
                                        </select>
                                    </div>
                                    <div className=' w-full sm:w-1/2'>
                                        <label htmlFor="tone" className="block text-gray-700 text-lg font-bold mb-1">
                                            Tone
                                        </label>
                                        <select value={tone}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)} id="tone" name="tone" className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="None">None</option>
                                            <option value="Witty">Witty</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Excited">Excited</option>
                                            <option value="Curious">Curious</option>
                                            <option value="Informative">Informative</option>
                                            <option value="Sarcastic">Sarcastic</option>
                                            <option value="Secretive">Secretive</option>
                                            <option value="Bold">Bold</option>
                                            <option value="Funny">Funny</option>
                                            <option value="Professional">Professional</option>
                                            <option value="Dramatic">Dramatic</option>
                                            <option value="Grumpy">Grumpy</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-start mt-2 sm:justify-end items-center">
                                    <button type="submit" onClick={() => setIsAI(true)} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                        {loaderAI
                                            ?
                                            <div className='flex gap-2'>
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                Processing...
                                            </div>
                                            :
                                            'Generate AI Post'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='p-4 bg-white shadow-lg rounded-md w-full h-full'>
                            <h1 className="mb-4 text-2xl font-bold  text-gray-900 lg:text-3xl ">Publish Post</h1>
                            <div className='mb-4'>
                                <textarea
                                    value={postText}
                                    onChange={handleTextChange}
                                    placeholder="What's on your mind?"
                                    rows={4}
                                    cols={50}
                                    className='shadow appearance-none border rounded p-4 w-full h-full text-gray-700 leading-tight focus:outline-none focus:border-blue-500'
                                ></textarea>
                            </div>
                            <div className='mb-4'>
                                <label className="block text-gray-700 text-lg font-bold mb-1">
                                    Select Image
                                </label>
                                <input type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                                file:me-4 file:py-2 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-500 file:text-white
                                                hover:file:bg-blue-700
                                                file:disabled:opacity-50 file:disabled:pointer-events-none border border-gray-300  rounded-lg w-full"/>
                            </div>
                            <div>
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className='btn btn-sm bg-blue-200 '
                                >
                                    😊
                                </button>
                                {showEmojiPicker && (
                                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                )}
                            </div>

                            <div className='flex justify-start mt-2 sm:justify-end items-center'>
                                {!profile ? (
                                    <button type="submit" onClick={handleAuth} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Connect Linkedin</button>
                                ) : (
                                    <button onClick={handlePost} className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
                                        {loaderPost
                                            ?
                                            <div className='flex gap-2'>
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                Processing...
                                            </div>
                                            :
                                            'Publish Post'
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-start items-center gap-2 flex-col  h-full'>
                        <div className='hidden sm:block'>
                            <button className={`btn btn-sm hover:bg-blue-400  ${isActiveTab('desktop') ? 'bg-blue-400' : 'bg-blue-200'}`} onClick={() => handleTabChange('desktop')}>Desktop view</button>
                            <button className={`btn btn-sm hover:bg-blue-400 ${isActiveTab('mobile') ? 'bg-blue-400' : 'bg-blue-200'}`} onClick={() => handleTabChange('mobile')}>Mobile view</button>
                        </div>
                        <div className={`preview ${isActiveTab('desktop') ? 'w-[522px]' : 'w-[430px]'}`}>
                            <div className="bg-white shadow-lg rounded ">
                                <div className="p-4 flex items-center">
                                    <img className="w-14 h-14 rounded-full" src={`${profile ? profile.picture : 'https://cdn.icon-icons.com/icons2/1378/PNG/64/avatardefault_92824.png'}`} alt="Profile Picture" />
                                    <div className="ml-4">
                                        <div className="font-bold text-lg">{profile ? profile.name : 'Username'}</div>
                                        <div className="text-gray-600 text-sm">Founder at aiCarousels, the first AI Carousel Generator 🌟</div>
                                        <div className="text-gray-500 text-xs flex items-center">
                                            <span>12h</span>
                                            <span className="mx-1">•</span>
                                            <span>
                                                <svg className="w-3 h-3 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-2 9.11c.78 0 1.55-.3 2.12-.88.38-.38.86-.86 1.24-1.24.56-.57.89-1.34.89-2.12 0-1.66-1.34-3-3-3s-3 1.34-3 3 .34 3 3 3z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='pl-4 pb-2'>{postText}</div>
                                <div>
                                    {postFiles.length !== 0 ?
                                        <>
                                            {postFiles.map((file, index) => (
                                                <div key={index} className='relative group'>
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`preview-${index}`}
                                                        className='w-full h-50'
                                                    />
                                                    <button
                                                        onClick={() => handleDelete(index)}
                                                        className='absolute top-2 right-2 bg-red-500 text-white rounded px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                                    >
                                                        &#x2716;
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                        : <>
                                            <img className='h-50 w-full' src="https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png" alt="" />
                                        </>
                                    }
                                </div>
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-gray-500 text-sm">
                                        <div className="flex items-center">
                                            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><rect width="16" height="16" rx="8"></rect><circle fill="#1485BD" cx="8" cy="8" r="7"></circle><path d="M11.93 7.25h-.55c-.05 0-.15-.19-.4-.46-.37-.4-.78-.91-1.07-1.19a7.18 7.18 0 0 1-1.73-2.24c-.24-.51-.26-.74-.75-.74a.77.77 0 0 0-.67.81c0 .14.07.63.1.8a7.62 7.62 0 0 0 1 2.2h.54-4.28a.87.87 0 0 0-.88.94.91.91 0 0 0 .93.85h.16a.78.78 0 0 0-.76.8.81.81 0 0 0 .74.8.8.8 0 0 0 .33 1.42.79.79 0 0 0-.09.55.86.86 0 0 0 .85.63h2.29c.3 0 .599-.038.89-.11l1.42-.42h1.9c1.02-.04 1.29-4.64.03-4.64z" fill="#E6F7FF"></path><path d="M7.43 6.43H4.11a.88.88 0 0 0-.88 1 .91.91 0 0 0 .93.84h.16a.78.78 0 0 0-.76.8.83.83 0 0 0 .74.81.81.81 0 0 0-.31.63.82.82 0 0 0 .65.8.81.81 0 0 0-.09.56.86.86 0 0 0 .85.62h2.29c.3 0 .599-.038.89-.11l1.42-.47h1.9c1 0 1.27-4.64 0-4.64a5 5 0 0 1-.55 0c-.05 0-.15-.19-.4-.46-.37-.4-.78-.91-1.07-1.19a7.18 7.18 0 0 1-1.7-2.25 2 2 0 0 0-.32-.52.83.83 0 0 0-1.16.09 1.39 1.39 0 0 0-.25.38 1.49 1.49 0 0 0-.09.3 2.38 2.38 0 0 0 .07.84c.064.288.155.569.27.84.188.353.41.688.66 1a.18.18 0 0 1 .07.08" stroke="#004B7C" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                            <span>64</span>
                                        </div>
                                        <div className="flex space-x-4">
                                            <span>27 comments</span>
                                            <span>4 reposts</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-200 flex justify-around text-gray-500 text-sm">
                                    <div className="flex items-center gap-1">
                                        <img className='w-4 h-4 sm:w-8 sm:h-8' src="https://www.citypng.com/public/uploads/preview/hd-black-thumbs-up-like-icon-png-701751695035844kdxuys3ffy.png" alt="" />
                                        <span>Like</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <img className='w-4 h-4 sm:w-8 sm:h-8' src="https://www.pngall.com/wp-content/uploads/8/Comment-Transparent.png" alt="" />
                                        <span>Comment</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <img className='w-3 h-3 sm:w-6 sm:h-6' src="https://www.pikpng.com/pngl/b/78-782135_share-png-share-icon-free-download-clipart.png" alt="" />
                                        <span>Share</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <img className='w-4 h-4 sm:w-8 sm:h-8' src="https://www.pngall.com/wp-content/uploads/12/Save-Bookmark-PNG-Images.png" alt="" />
                                        <span>Save</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostGenerator;