import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const EditorImageSection: React.FC = () => {
    const router = useRouter();

    return (
        <div
            className="p-4 cursor-pointer"
            onClick={() => {
                router.push("/editor");
            }}
        >
            <Image
                src="/img/gikyoku_editor.png"
                alt="My Image"
                width={1366 / 2} // 画像の幅
                height={768 / 2} // 画像の高さ
            />
        </div>
    );
};

export default EditorImageSection; 