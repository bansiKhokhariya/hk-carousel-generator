
'use client';
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
export function EditorMenubar({ }: {}) {
  return (
    <div className="flex items-center flex-row gap-2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Select Generator</MenubarTrigger>
          <MenubarContent>
            <Dialog>
              <DialogTrigger asChild>
                <MenubarItem>
                  <Link href="/dashboard" className="items-center space-x-2 flex">
                    Carousel Generator
                  </Link>
                </MenubarItem>
              </DialogTrigger>
            </Dialog>
            <MenubarSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <MenubarItem>
                  <Link href="/post-generator" className="items-center space-x-2 flex">
                    Post Generator
                  </Link>
                </MenubarItem>
              </DialogTrigger>
            </Dialog>
            <MenubarSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <MenubarItem>
                  <Link href="/" className="items-center space-x-2 flex">
                    Home
                  </Link>
                </MenubarItem>
              </DialogTrigger>
            </Dialog>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
