import React from 'react';
import { Blog } from '@customTypes/blogs';
import { paths } from '@routes/paths';
import { capitalizeWords, formatDate } from '@utils/helpers';
import blogImage1 from '../../assets/images/explore2.jpg';
import userImage from '../../pages/Blog/user-img.png';
import styles from './blogCard.module.scss';

interface BlogCardProps {
  item: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ item }) => (
  <div className={styles.singleCard}>
    <img className={styles.blogImage} src={item.blogImage || blogImage1} alt="blogImage" />
    <div className={styles.blogBody}>
      <p className={styles.category}>{capitalizeWords(item.category.title)}</p>
      <a href={`${paths.blogs}/${item.slug}`} className={styles.link}>
        <p className={styles.title}>{item.title}</p>
      </a>
      <p className={styles.content}>{item.snippet}...</p>
      <div className={styles.authorSection}>
        <img className={styles.authorImg} src={userImage} alt="authorImage" />
        <div className={styles.rightSide}>
          <span className={styles.author}>
            {capitalizeWords(item.author.firstName)} {capitalizeWords(item.author.lastName)}
          </span>
          <p className={styles.time}>{formatDate(item.createdAt)}</p>
        </div>
      </div>
      <div className={styles.readMore}>
        <a className={styles.readMoreBtn} href={`${paths.blogs}/${item.slug}`}>
          Read More
        </a>
      </div>
    </div>
  </div>
);
