
"use client";

import React, { useState } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import Editor from "@/components/editor";
import { DocumentProvider } from "@/libs/providers/document-provider";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    // <main className="min-h-screen p-8 pb-24">
    //   <section className="max-w-xl mx-auto space-y-8">
    //     <ButtonAccount />
    //     <h1 className="text-3xl md:text-4xl font-extrabold">Private Page</h1>
    //   </section>
    // </main>
    <main className="flex-1 h-full min-h-full flex flex-col justify-stretch">
      <DocumentProvider>
        <Editor/>
        <SiteFooter />
      </DocumentProvider>
    </main>
  );
}
