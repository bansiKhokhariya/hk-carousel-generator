"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "Who are you? What’s HkAppS?",
    answer: <div className="space-y-2 leading-relaxed">We’re the founders of Taplio, a new LinkedIn tool on the block. Instead of focusing on automation like most tools, we focus on helping you create high performing content and engaging with other relevant LinkedIn accounts.
      <br /><br />
      We strongly believe in the power of personal branding and how it can help drive opportunities for your business, and we’ve built our entire tool around this belief. We currently have 1500+ paying customers using our tool.</div>,
  },
  {
    question: "Is this tool free?",
    answer: (
      <p>
        Yes! This tool is entirely free, no catch.
      </p>
    ),
  },
  {
    question: "What are Linkedin carousel posts?",
    answer: (
      <div className="space-y-2 leading-relaxed">The carousel format on Linkedin is when you upload a set of slides that people can navigate, similar to a PowerPoint presentation. In order to create such a posts, you need to create a PDF document and upload it in your post. Linkedin will then interpret each page as a different slide of your presentation.</div>
    ),
  },
  {
    question: "Why should I care about LinkedIn carousels?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        LinkedIn rewards publishers that keep users on the platform with extra visibility. And needless to say that carousel are rather catchy long-form content that will do just that.
        <br /><br />
        Carousels are also one of the most popular content formats on LinkedIn right now, generating a high level of engagement.
        <br /><br />
        With the 800M+ users LinkedIn has, we think it’s a good idea if you can leverage part of that audience to your advantage.
      </div>
    ),
  },
  {
    question: "What is the correct LinkedIn carousel format and size?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        LinkedIn carousels are typically PDFs which can exist in 2 different sizes: 1080x1080 pixels (square format) or 1080x1350 pixels (slightly higher than larger). At Taplio, we prefer the look and feel of that second format which is a bit more original and gives you more space to express yourself.
        <br /><br />
        Which is why we've made it our default format for our carousels.
      </div>
    ),
  },
  {
    question: "How does the carousel generator work?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Start by choosing whether you want to repurpose tweets, threads or other media into a carousel (classic version), or if you prefer creating your own carousel from scratch with the help of AI (new version).
        <br /><br />
        If you chose the classic version, here’s how it works: All you need to do is import the various “slides” you want for your final carousel.
        <br /><br />
        Those can be either tweets, Reddit posts or image URLs. Just copy/paste those URLs into each field at the top, and press “add new” to add an image.
        <br /><br />
        When you're done, hit “generate carousel” and wait a couple minutes until the “download carousel” button is available.
        <br /><br />
        If you chose the new version (with AI):
        <ul>
          <li>
            • Start from scratch or let AI generate some slide ideas for you by telling it what you want to talk about
          </li>
          <li>
            • Edit the content and make sure you add your profile pic, name, handle for greater visibility
          </li>
          <li>• Choose the theme (background and color)</li>
          <li>• And finally preview and download your carousel in PDf format</li>
        </ul>
      </div>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${isOpen && "rotate-180"
              }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${isOpen && "rotate-180 hidden"
              }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    // <section className="bg-base-200" id="faq">
    //   <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
    //     <div className="flex flex-col text-left basis-1/2">
    //       <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
    //       <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
    //         Frequently Asked Questions
    //       </p>
    //     </div>

    //     <ul className="basis-1/2">
    //       {faqList.map((item, i) => (
    //         <FaqItem key={i} item={item} />
    //       ))}
    //     </ul>
    //   </div>
    // </section>

    <section className="p-8 bg-muted" id="faq">
      <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
      <h3 className="text-xl lg:text-2xl font-semibold mb-8 text-center">Ask everything you need to know about our products and services</h3>
      <div className="container">
        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
