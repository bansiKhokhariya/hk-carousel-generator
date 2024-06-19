// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';

// export async function POST(req: NextRequest) {
//     const formData = await req.formData();
//     const urn = formData.get('urn') as string;
//     const token = formData.get('token') as string;
//     const text = formData.get('text') as string;
//     const files = formData.getAll('files') as File[];

//     if (!urn || !token || !text || files.length === 0) {
//         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     try {
//         const uploadedAssets = [];
//         const linkedInVersion = '202305'; // Example version; ensure this is the correct one for your case

//         for (const file of files) {
//             let uploadUrl = '';
//             let asset = '';

//             // Register the upload for images
//             const registerResponse = await axios.post(
//                 'https://api.linkedin.com/v2/assets?action=registerUpload',
//                 {
//                     registerUploadRequest: {
//                         recipes: 'urn:li:digitalmediaRecipe:feedshare-image',
//                         owner: `urn:li:person:${urn}`,
//                         serviceRelationships: [
//                             {
//                                 relationshipType: 'OWNER',
//                                 identifier: 'urn:li:userGeneratedContent',
//                             },
//                         ],
//                     },
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                         'LinkedIn-Version': linkedInVersion,
//                     },
//                 }
//             );

//             uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
//             asset = registerResponse.data.value.asset;

//             // Upload the file
//             const arrayBuffer = await file.arrayBuffer();
//             const buffer = Buffer.from(arrayBuffer);

//             await axios.put(uploadUrl, buffer, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': file.type, // Get the correct MIME type from the uploaded file
//                 },
//             });

//             uploadedAssets.push({
//                 status: 'READY',
//                 description: {
//                     text: file.name,
//                 },
//                 media: asset, // Ensure the asset URN is included here
//                 title: {
//                     text: file.name,
//                 },
//             });
//         }

//         // Create the post
//         const postResponse = await axios.post(
//             'https://api.linkedin.com/v2/ugcPosts',
//             {
//                 author: `urn:li:person:${urn}`,
//                 lifecycleState: 'PUBLISHED',
//                 specificContent: {
//                     'com.linkedin.ugc.ShareContent': {
//                         shareCommentary: {
//                             text,
//                         },
//                         shareMediaCategory: 'IMAGE',
//                         media: uploadedAssets.map(asset => ({
//                             status: 'READY',
//                             description: asset.description,
//                             media: asset.media, // Ensure this includes the media URN
//                             title: asset.title,
//                         })),
//                     },
//                 },
//                 visibility: {
//                     'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
//                 },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                     'LinkedIn-Version': linkedInVersion,
//                 },
//             }
//         );

//         return NextResponse.json(postResponse.data, { status: 200 });
//     } catch (error) {
//         console.error('Error sharing post:', error.response?.data || error.message);
//         return NextResponse.json({ error: 'Failed to share post' }, { status: 500 });
//     }
// }


import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const urn = formData.get('urn') as string;
    const token = formData.get('token') as string;
    const text = formData.get('text') as string;
    const files = formData.getAll('files') as File[];

    if (!urn || !token || !text) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const uploadedAssets = [];
        const linkedInVersion = '202305'; // Ensure this is the correct version for your case

        for (const file of files) {
            let uploadUrl = '';
            let asset = '';

            // Register the upload for images
            const registerResponse = await axios.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                        owner: `urn:li:person:${urn}`,
                        serviceRelationships: [
                            {
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent',
                            },
                        ],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'LinkedIn-Version': linkedInVersion,
                    },
                }
            );

            uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            asset = registerResponse.data.value.asset;


            // Upload the file
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await axios.put(uploadUrl, buffer, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': file.type, // Get the correct MIME type from the uploaded file
                },
            });

            uploadedAssets.push({
                status: 'READY',
                description: {
                    text: file.name,
                },
                media: asset, // Ensure the asset URN is included here
                title: {
                    text: file.name,
                },
            });
        }

        // Create the post
        const postResponse = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            {
                author: `urn:li:person:${urn}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text,
                        },
                        shareMediaCategory: uploadedAssets.length > 0 ? 'IMAGE' : 'NONE',
                        ...(uploadedAssets.length > 0 ? {
                            media: uploadedAssets.map(asset => ({
                                status: 'READY',
                                description: asset.description,
                                media: asset.media, // Ensure this includes the media URN
                                title: asset.title,
                            })),
                        } : {}),
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'LinkedIn-Version': linkedInVersion,
                },
            }
        );

        return NextResponse.json(postResponse.data, { status: 200 });
    } catch (error) {
        console.error('Error sharing post:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to share post' }, { status: 500 });
    }
}
