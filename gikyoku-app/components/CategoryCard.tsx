import Link from "next/link";

interface CategoryCardProps {
    id: number;
    name: string;
    imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, imageUrl }) => {
    return (
        <div className="category-card">
            <Link href={`/categories/${id}`}>
                <img src={imageUrl} alt={name} className="category-image" />
                <h3 className="category-name">{name}</h3>
            </Link>
            <style jsx>{`
        .category-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .category-card:hover {
          transform: translateY(-5px);
        }
        .category-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .category-name {
          padding: 10px;
          text-align: center;
          font-size: 1.2em;
        }
      `}</style>
        </div>
    );
};

export default CategoryCard; 