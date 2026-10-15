import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Container from "react-bootstrap/Container";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import axios from "axios";

interface BlogPost {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  publishedAt: string;
}

interface BlogCardProps {
  id: string;
  title: string;
  thumbnail: string;
  excerpt: string;
  publishedAt: string;
}

const TypedBlogCard = BlogCard as ComponentType<BlogCardProps>;


const apiUrl = import.meta.env.VITE_API_URL;

export default function DetalleBlog1() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/blog`);
        setBlogPosts(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching blog posts", error);
      }
    };
    fetchBlogPosts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = blogPosts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container>
      <h2>Welcome to the blog</h2>
      {currentItems.map((blog) => (
        <TypedBlogCard
          key={blog.id}
          id={blog.id}
          title={blog.title}
          thumbnail={blog.thumbnail}
          excerpt={blog.content.substring(0, 60) + "..."}
          publishedAt={blog.publishedAt}        />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}