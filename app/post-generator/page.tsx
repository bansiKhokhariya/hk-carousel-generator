'use client';
import React, { useState, useEffect } from 'react';
import { DocumentProvider } from "@/libs/providers/document-provider";
import PostGenerator from "@/components/post-generator";
import { SiteFooter } from "@/components/site-footer";

const page = () => {

    return (
        <DocumentProvider>
            <PostGenerator />
            <SiteFooter />
        </DocumentProvider>
    );
};

export default page;
