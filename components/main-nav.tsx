import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/libs/utils";
import { Icons } from "@/components/icons";
import { Button } from "./ui/button";
import { EditorMenubar } from "./editor-menubar";
import { Download, Loader2Icon, AlertCircle } from "lucide-react";
import Pager from "./pager";
import { FilenameForm } from "./forms/filename-form";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

interface MainNavProps {
  handlePrint: () => void;
  isPrinting: boolean;
  className?: string;
}

export function MainNav({ handlePrint, isPrinting, className }: MainNavProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {

    // Function to get the current path from the URL
    const getCurrentPath = () => {
      const currentPath = window.location.pathname;
      const trimmedPath = currentPath.replace(/^\/+/, '');
      setUrl(trimmedPath);
    };

    // Call the function initially when the component mounts
    getCurrentPath();

  }, []);

  const handleDownloadClick = () => {
    handlePrint();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className={cn("flex gap-4 md:gap-10 justify-between items-center", className)}>
      <div className="flex gap-4">
        <Link href="/" className="items-center space-x-2 flex">
          <Icons.logo />
          <span className="hidden font-bold md:inline-block">{url === 'dashboard' ? 'Carousel Generator' : url}</span>
        </Link>
        <EditorMenubar />
      </div>

      {url == 'dashboard' ?
        <div className="hidden lg:block">
          <Pager />
        </div>
        : null}

      <div className="flex gap-2 items-center">
        {url == 'dashboard' ?
          <>
            <div className="hidden md:block">
              <FilenameForm />
            </div>

            <Button variant="ghost" size={"icon"} onClick={handleDownloadClick}>
              <div className="flex flex-row gap-1 items-center">
                {isPrinting ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Download />}
              </div>
            </Button>
          </>
          : null}

        <button
          className="flex items-center gap-2 bg-red-100 hover:text-error duration-200 py-1.5 px-4 rounded-lg font-medium justify-center"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
