import React from "react";
import DropBox from "@/components/DropBox";
import PostCardList from "@/components/PostCardList";
import Pagination from "@/components/Pagination";
import LoadingIndicator from "@/components/LoadingIndicator";

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
        <div>
            {data ? (
                <>
                    <DropBox
                        sort_by={sort_by} s
                        setSortIndex={setSortIndex}
                        setSortDirection={setSortDirection}
                        sortDirection={sortDirection}
                    />
                    {data.searchResults && (
                        <>
                            {data.searchResults.length !== 0 ? (
                                <PostCardList posts={data.searchResults} />
                            ) : (
                                <div>条件にあう戯曲は見つかりませんでした。</div>
                            )}
                        </>
                    )}
                    {data.pagination ? (
                        <Pagination
                            setPage={setPage}
                            pagination={data.pagination}
                            className="max-w-full"
                        />
                    ) : (
                        <LoadingIndicator />
                    )}
                </>
            ) : (
                <LoadingIndicator />
            )}
        </div>
    );
};

export default SearchResults; 