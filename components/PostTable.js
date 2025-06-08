import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function PostTable() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    const res = await fetch(`/api/posts?page=${page}&limit=10`);
    const data = await res.json();
    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    if (posts.length >= data.totalPosts) {
      setHasMore(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setPage(page + 1)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author.name}</td>
              <td>{post.categories.map((cat) => cat.name).join(", ")}</td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfiniteScroll>
  );
}

export default PostTable;
