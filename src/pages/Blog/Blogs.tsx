import React from 'react';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { BlogCard } from '@components/Card/BlogCard';
import styles from '@components/Card/blogCard.module.scss';
import { PageLayout } from '@components/Layout';
import { Blog } from '@customTypes/blogs';

const fetcher = async (url: string) => {
  const response = await apiClient.get<Blog[]>(url);
  return response.data;
};

const Blogs: React.FC = () => {
  const { data: blogs } = useSWR(endpoints.getBlogs, fetcher);
  return (
    <div>
      <div className={styles.pageHeader}>
        <h3 className={styles.pageTitle}> Recent Posts</h3>
      </div>
      <PageLayout className="lh-md" siteTitle="Blog Posts">
        <div className={styles.blogCards}>
          {blogs?.map((item) => (
            <BlogCard item={item} key={item.id} />
          ))}
        </div>
      </PageLayout>
    </div>
  );
};

export default Blogs;
