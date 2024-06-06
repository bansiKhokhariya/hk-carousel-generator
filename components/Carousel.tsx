import React, { useState, useEffect } from 'react';
import { useComponentPrinter } from '@/libs/hooks/use-component-printer';
import HomeSidebarTabsPanel from './HomeSidebarTabsPanel';
import HomeSlider from './HomeSlider';
import { AIPanel } from '@/components/ai-panel';
import { RefProvider } from "@/libs/providers/reference-context";
import { Button } from "./ui/button";
import { Download, Loader2Icon, AlertCircle } from "lucide-react";
import { FilenameForm } from "./forms/filename-form";
import { useSession, signOut } from "next-auth/react";

const Carousel = () => {
    const { componentRef, handlePrint, isPrinting } = useComponentPrinter();
    const [downloadCount, setDownloadCount] = useState(0);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user) {
            const count = localStorage.getItem("downloadCount");
            setDownloadCount(count ? parseInt(count, 10) : 0);
        }
    }, [session]);

    const handleDownloadClick = () => {
        if (!session?.user) {
            const newCount = downloadCount + 1;
            setDownloadCount(newCount);
            localStorage.setItem("downloadCount", newCount.toString());
        }
        handlePrint();
    };

    const handleAlertClick = () => {
        alert("You have reached the maximum number of downloads allowed.");
    };

    const showAlertButton = !session?.user && downloadCount >= 2;

    return (
        <RefProvider myRef={componentRef}>
            <section className="container mx-auto p-5">
                <div className="flex flex-col items-center space-y-5">
                    <div className='flex items-end'>
                        <AIPanel />
                        <div className="flex gap-2 items-center justify-center">
                            <div className="hidden md:block">
                                <FilenameForm />
                            </div>
                            {showAlertButton ? (
                                <Button variant="ghost" size={"icon"} onClick={handleAlertClick}>
                                    <div className="flex flex-row gap-1 items-center">
                                        <Download />
                                    </div>
                                </Button>
                            ) : (
                                <Button variant="ghost" size={"icon"} onClick={handleDownloadClick}>
                                    <div className="flex flex-row gap-1 items-center">
                                        {isPrinting ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Download />}
                                    </div>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-center gap-10 sm:flex-row">
                        <div className="bg-white rounded shadow">
                            <HomeSidebarTabsPanel />
                        </div>
                        <div>
                            <HomeSlider />
                        </div>
                    </div>
                </div>
            </section>
        </RefProvider>
    );
};

export default Carousel;
