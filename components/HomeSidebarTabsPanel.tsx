'use client';
import React, { ReactNode, useEffect, useState } from "react";
import {
    VerticalTabs,
} from "@/components/ui/vertical-tabs";
import { useSelectionContext } from "@/libs/providers/selection-context";
import {
    Briefcase,
    FileDigit,
    LucideIcon,
    Palette,
    Type,
    Plus,
    Brush,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DocumentFormReturn } from "@/libs/document-form-types";
import { Separator } from "@/components/ui/separator";
import { FontsForm } from "@/components/forms/fonts-form";
import { PageNumberForm } from "./forms/page-number-form";
import { BrandForm } from "@/components/forms/brand-form";
import { ThemeForm } from "@/components/forms/theme-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useFormContext } from "react-hook-form";
import { cn } from "@/libs/utils";
import { StyleMenu } from "@/components/style-menu";

type TabInfo = {
    name: string;
    value: string;
    icon: LucideIcon;
};

const ALL_FORMS: Record<string, TabInfo> = {
    brand: {
        name: "Brand",
        value: "brand",
        icon: Briefcase,
    },
    theme: {
        name: "Theme",
        value: "theme",
        icon: Palette,
    },
    fonts: {
        name: "Fonts",
        value: "fonts",
        icon: Type,
    },
    pageNumber: {
        name: "Numbers",
        value: "number",
        icon: FileDigit,
    },
};

const HomeSidebarTabsPanel = () => {
    return (
        <>
            {/* <div className={cn("h-full flex flex-1", className)}> */}
            {/* <aside className="h-full w-full shrink-0 md:sticky md:block border-r"> */}
            <SidebarTabsPanel />
            {/* </aside> */}
            {/* </div> */}
        </>

    );
};

function HorizontalTabTriggerButton({ tabInfo }: { tabInfo: TabInfo }) {
    const { setCurrentSelection } = useSelectionContext();
    //  TODO Convert this comp into a forwardref like its child
    return (
        <TabsTrigger
            value={tabInfo.value}
            className="h-16 flex flex-col gap-2 items-center py-2 justify-center"
            onFocus={() => setCurrentSelection("", null)}
        >
            <tabInfo.icon className="h-4 w-4" />
            <span className="sr-only ">{tabInfo.name}</span>
            <p className="text-xs">{tabInfo.name}</p>
        </TabsTrigger>
    );
}

export function SidebarTabsPanel() {
    const { currentSelection } = useSelectionContext();
    const [tab, setTab] = useState(ALL_FORMS.brand.value);
    const form: DocumentFormReturn = useFormContext();

    return (
        <VerticalTabs
            value={currentSelection ? "" : tab}
            onValueChange={(val) => {
                if (val) {
                    // Don't lost previous state when showing current selection
                    setTab(val);
                }
            }}
            className="flex-1 h-full p-0"
        >
            <div className="flex flex-col w-full lg:h-[670px] sm:h-[full]">
                <ScrollArea className="border-b bg-muted">
                    <TabsList className="grid grid-cols-4 gap-2 h-20 rounded-none">
                        <HorizontalTabTriggerButton tabInfo={ALL_FORMS.brand} />
                        <HorizontalTabTriggerButton tabInfo={ALL_FORMS.theme} />
                        <HorizontalTabTriggerButton tabInfo={ALL_FORMS.fonts} />
                        <HorizontalTabTriggerButton tabInfo={ALL_FORMS.pageNumber} />
                    </TabsList>
                </ScrollArea>
                <div className="p-2 lg:w-[320px] sm:w-full">
                    {/* // TODO Should be in a ScrollArea but it does not scroll */}
                    <TabsContent
                        value={ALL_FORMS.brand.value}
                        className="mt-0 border-0 p-0 m-4 "
                    >
                        <h4 className="text-xl font-semibold">{ALL_FORMS.brand.name}</h4>
                        <Separator className="mt-2 mb-4"></Separator>
                        <BrandForm />
                    </TabsContent>
                    <TabsContent
                        value={ALL_FORMS.theme.value}
                        className="mt-0 border-0 p-0 m-4 "
                    >
                        <h4 className="text-xl font-semibold">{ALL_FORMS.theme.name}</h4>
                        <Separator className="mt-2 mb-4"></Separator>
                        <ThemeForm />
                    </TabsContent>
                    <TabsContent
                        value={ALL_FORMS.fonts.value}
                        className="mt-0 border-0 p-0 m-4"
                    >
                        <h4 className="text-xl font-semibold">{ALL_FORMS.fonts.name}</h4>
                        <Separator className="mt-2 mb-4"></Separator>
                        <FontsForm />
                    </TabsContent>
                    <TabsContent
                        value={ALL_FORMS.pageNumber.value}
                        className="mt-0 border-0 p-0 m-4"
                    >
                        <h4 className="text-xl font-semibold">
                            {ALL_FORMS.pageNumber.name}
                        </h4>
                        <Separator className="mt-2 mb-4"></Separator>
                        <PageNumberForm />
                    </TabsContent>
                </div>
                <StyleMenu form={form} className={"m-4"} />
            </div>
        </VerticalTabs>
    );
}

export default HomeSidebarTabsPanel;
