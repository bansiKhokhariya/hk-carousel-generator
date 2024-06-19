"use client";

interface CardProps {
    title: string;
    description: string[];
    index: number;
}

const carouselContent = [
    {
        title: "Make it stand out",
        description: [
            "Plain white carousels rarely grab your reader’s attention, especially with thousands of competing posts in the LinkedIn feed.",
            "Being bold with your design by picking a strong color or even just a black background can help your carousel make an impression."
        ]
    },
    {
        title: "Use engaging visuals",
        description: [
            "High-quality images, illustrations, and icons can make your carousel visually appealing and more likely to capture attention."
        ]
    },
    {
        title: "Keep text concise",
        description: [
            "Ensure your message is clear and to the point. Too much text can overwhelm viewers and reduce engagement."
        ]
    },
    {
        title: "Include a call to action",
        description: [
            "Encourage viewers to engage with your content by including clear calls to action, such as 'Read more,' 'Learn more,' or 'Visit our website.'"
        ]
    },
    {
        title: "Be consistent with branding",
        description: [
            "Use your brand colors, fonts, and style to ensure your carousel aligns with your overall branding and is easily recognizable."
        ]
    },
    {
        title: "Test and iterate",
        description: [
            "Analyze the performance of your carousels to understand what works and what doesn’t. Continuously refine your approach based on feedback and engagement metrics."
        ]
    }
];

const bestPracticesContent = [
    {
        title: "Design for Visual Impact",
        description: [
            "Use High-Quality Images: Incorporate high-resolution images and graphics to grab attention.",
            "Consistent Branding: Maintain your brand's visual identity across all slides for a professional look.",
            "Balance Text and Visuals: Ensure a good balance between text and visuals to keep the slides engaging."
        ]
    },
    {
        title: "Focus on Clear Messaging",
        description: [
            "Concise Text: Keep your text short and to the point to maintain reader interest.",
            "Key Points: Highlight the most important information on each slide.",
            "Readable Fonts: Use clear and legible fonts to ensure your message is easily understood."
        ]
    },
    {
        title: "Include a Strong Call to Action",
        description: [
            "Clear Instructions: Direct your audience on what to do next, such as 'Learn More' or 'Download Now.'",
            "Visible Buttons: Use prominent and clickable buttons to drive action.",
            "Consistency: Place CTAs consistently across the slides to reinforce the action you want viewers to take."
        ]
    }
];

const whyPostContent = [
    {
        title: "Boost Engagement with Visual Storytelling",
        description: [
            "Visual Appeal: LinkedIn carousels grab attention through visually appealing slides. This format is perfect for breaking down complex information into digestible chunks.",
            "Interactivity: Carousels encourage users to click through multiple slides, increasing the time they spend on your post and interacting with your content.",
            "Engagement Metrics: Posts with carousels often see higher engagement rates, including likes, comments, and shares, compared to regular posts."
        ]
    },
    {
        title: "Establish Your Expertise and Authority",
        description: [
            "Detailed Information: Carousels allow you to dive deep into topics, providing detailed insights and valuable information across multiple slides.",
            "Content Variety: Use different types of content, such as infographics, charts, and step-by-step guides, to demonstrate your knowledge and expertise.",
            "Professional Image: Sharing well-crafted carousels helps position you as a thought leader in your industry, enhancing your professional reputation."
        ]
    },
    {
        title: "Expand Your Reach on LinkedIn",
        description: [
            "Algorithm Favorability: LinkedIn's algorithm tends to favor engaging content like carousels, potentially boosting your post's visibility on the platform.",
            "Shareability: Carousels are easy to share, allowing your content to reach a broader audience beyond your immediate network.",
            "Mobile Friendly: Carousels are highly effective on mobile devices, where a significant portion of LinkedIn users access the platform, ensuring your content is seen by a wider audience."
        ]
    }
];

const Card: React.FC<CardProps> = ({ title, description, index }) => (
    <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col p-3">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="mb-4 text-xl font-bold">
                    {title}
                </h3>
                <div className="mb-4 text-grey-darker text-sm flex-1">
                    {description.map((text, i) => (
                        <p key={i}>{text}</p>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const AllSection = () => {

    return (
        <>
            <div className="">
                <div className="container px-8 py-8">
                    <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center">How to create good LinkedIn carousels?</h2>
                    <h3 className="text-xl lg:text-2xl font-semibold mb-8 text-center">Content and copywriting tips</h3>
                    <div className="flex flex-wrap -m-3">
                        {carouselContent.map((item, index) => (
                            <Card key={index} index={index} title={item.title} description={item.description} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-muted">
                <div className="container px-8 py-8">
                    <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center">Why You Should Post LinkedIn Carousels</h2>
                    <div className="flex flex-wrap -m-3">
                        {whyPostContent.map((item, index) => (
                            <Card key={index} index={index} title={item.title} description={item.description} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="">
                <div className="container px-8 py-8">
                    <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center">What Are the Best Practices for LinkedIn Carousels?</h2>
                    <div className="flex flex-wrap -m-3">
                        {bestPracticesContent.map((item, index) => (
                            <Card key={index} index={index} title={item.title} description={item.description} />
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
};

export default AllSection;
