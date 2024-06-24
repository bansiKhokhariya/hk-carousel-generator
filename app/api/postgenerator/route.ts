import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Configuration from 'openai';



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest, res: NextResponse) {
    const reqData = await req.json();
    const { topic, keyword, tone, language } = reqData;

    const prompt = `Generate a compelling LinkedIn post about ${topic} with the keyword "${keyword}". Tone: ${tone}, Language: ${language}.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "system",
                    content: "You are an SEO-friendly blog post generator called Copymatic. You are designed to output markdown without frontmatter",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const postContent = response.choices[0]?.message?.content;

      return  NextResponse.json({ postContent })

    } catch (error) {
        return  NextResponse.json({ message: 'Failed to generate post', error: (error as Error).message })
    }
}
