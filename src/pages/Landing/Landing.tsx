import React from 'react';
import useSWR from 'swr';
import apiClient from '@api/apiClient';
import { endpoints } from '@api/endpoints';
import { EventCard, IconCard } from '@components/Card';
import { BlogCard } from '@components/Card/BlogCard';
import { Explore } from '@components/Explore';
import { Hero } from '@components/Hero';
import { Partnership } from '@components/Partnership';
import { Blog } from '@customTypes/blogs';
import { Event } from '@customTypes/events';
import { ourApproach } from '@utils/data';
import styles from './Landing.module.scss';

const fetcher = async (url: string) => {
  const response = await apiClient.get<Blog[]>(url);
  return response.data;
};

const Landing = () => {
  const { data: events } = useSWR<Event[]>(endpoints.getEvents, async (url) => {
    const response = await apiClient.get<Event[]>(url);
    return response.data;
  });
  // blogs
  const { data: blogs } = useSWR(endpoints.getBlogs, fetcher);

  return (
    <div>
      <Hero />
      <div className={styles.bodyContainer}>
        <Partnership />
        <Explore />
        <div className={styles.approach}>
          <div className={styles.sectionTitle}>Our Approach</div>
          <div className={styles.grid}>
            {ourApproach.map(({ title, subtitle, description }, index) => (
              <IconCard
                title={title}
                subtitle={subtitle}
                description={description}
                key={`${title}${index}`}
              />
            ))}
          </div>
        </div>
        {/* Cohorts */}
        <div className={styles.recentPosts}>
          <div className={styles.sectionTitle}>Recent Blogs</div>
          <div className={styles.grid}>
            {blogs?.slice(0, 3).map((item) => (
              <BlogCard item={item} key={item.id} />
            ))}
          </div>
        </div>

        {events && events.length > 0 && (
          <div className={styles.events}>
            <div className={styles.sectionTitle}>Activities</div>
            <div className={styles.grid}>
              {events.map((item) => (
                <EventCard item={item} key={item.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
