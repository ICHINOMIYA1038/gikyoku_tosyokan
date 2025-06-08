import React from "react";
import Image from "next/image";
import Recommend from "@/components/Widget/recommend";
import AuthorList from "@/components/Widget/AuthorList";
import CategoryList from "@/components/Widget/CategoryList";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useRouter } from "next/router";
import EditorImageSection from "@/components/EditorImageSection";

interface ContentSectionProps {
    posts: any;
    authors: any;
    categories: any;
}

const ContentSection: React.FC<ContentSectionProps> = ({ posts, authors, categories }) => {
    const router = useRouter();

    return (
        <div className="lg:flex lg:flex-wrap">
            <div className="mx-5 my-5">
                {posts ? <Recommend /> : <LoadingIndicator />}
            </div>
            <EditorImageSection />
            <div className="mx-5 my-5">
                {authors ? <AuthorList authors={authors} /> : <LoadingIndicator />}
            </div>
            <div className="mx-5 my-5">
                {categories ? <CategoryList categories={categories} /> : <LoadingIndicator />}
            </div>
        </div>
    );
};

export default ContentSection; 