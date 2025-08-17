import Link from "next/link";

interface CategoryCardProps {
    id: number;
    name: string;
    imageUrl: string;
    postCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, imageUrl, postCount = 0 }) => {
    return (
        <Link href={`/categories/${id}`}>
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <div className="aspect-w-16 aspect-h-9 relative h-48 bg-gray-200">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                            <span className="text-white text-3xl font-bold">
                                {name.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {name}
                    </h3>
                    {postCount !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>{postCount} 作品</span>
                        </div>
                    )}
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;