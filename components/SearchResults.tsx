import React from "react";
import DropBox from "@/components/DropBox";
import PostCardList from "@/components/PostCardList";
import Pagination from "@/components/Pagination";
import LoadingIndicator from "@/components/LoadingIndicator";
import ShareSearchButton from "@/components/ShareSearchButton";

interface SearchResultsProps {
    data: any;
    sort_by: number;
    setSortIndex: (index: number) => void;
    sortDirection: number;
    setSortDirection: (direction: number) => void;
    setPage: (page: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
    data,
    sort_by,
    setSortIndex,
    sortDirection,
    setSortDirection,
    setPage,
}) => {
    return (
        <div className="bg-transparent">
            {data ? (
                <>
                    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <DropBox
                            sort_by={sort_by}
                            setSortIndex={setSortIndex}
                            setSortDirection={setSortDirection}
                            sortDirection={sortDirection}
                        />
                    </div>

                    <div className="mb-6">
                        {data.searchResults && (
                            <>
                                {data.searchResults.length !== 0 ? (
                                    <>
                                        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="text-lg font-semibold text-gray-700">
                                                    検索結果: <span className="text-green-700">{data.pagination?.total || 0}</span> 件
                                                </div>
                                                <ShareSearchButton />
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {data.pagination?.current_page || 1} / {data.pagination?.total_pages || 1} ページ
                                            </div>
                                        </div>
                                        <PostCardList posts={data.searchResults} />
                                    </>
                                ) : (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    条件にあう戯曲は見つかりませんでした。検索条件を変更してお試しください。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {data.pagination ? (
                        <div className="mt-8">
                            <Pagination
                                setPage={setPage}
                                pagination={data.pagination}
                                className="max-w-full"
                            />
                        </div>
                    ) : (
                        <LoadingIndicator />
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <LoadingIndicator />
                    <p className="mt-4 text-gray-600">検索結果を読み込んでいます...</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults; 