import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import styles from '@components/Card/blogCard.module.scss';
import { PageLayout } from '@components/Layout';
import { Blog } from '@customTypes/blogs';
import { SuccessResponse } from '@customTypes/general';
import { formatDate } from '@utils/helpers';
import blogImage1 from '../../assets/images/explore2.jpg';

const SingleBlog = () => {
  const { slug } = useParams<{ slug: string }>();
  // Fetch blog data
  const { data: blog } = useSWR(`${endpoints.getBlogs}/${slug}`, async (url: string) => {
    const response = await apiClient.get<SuccessResponse<Blog>>(url);
    return response.data.data;
  });

  return (
    <PageLayout className="lh-md" siteTitle="Blog:Slug">
      <div className={styles.singleBlogPage}>
        <div className={styles.postContainer}>
          <img className={styles.singleImage} src={blog?.blogImage || blogImage1} alt="blogImage" />
          <h1 className={styles.singletitle}>{blog?.title}</h1>
          <div className={styles.authorDate}>
            <span>
              Author: {blog?.author.firstName} {blog?.author.lastName}
            </span>
            <p className={styles.time}>{formatDate(`${blog?.createdAt}`)}</p>
          </div>
          <p>{blog?.content}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default SingleBlog;
