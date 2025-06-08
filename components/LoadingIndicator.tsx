import React from "react";

const LoadingIndicator = () => {
    return (
        <div
            className="flex justify-center h-3/4 items-center"
            aria-label="読み込み中"
        >
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
    );
};

export default LoadingIndicator; 