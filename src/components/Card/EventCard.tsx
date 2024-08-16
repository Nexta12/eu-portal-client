import parse from 'html-react-parser';
import React from 'react';
import { Event } from '@customTypes/events';
import styles from './Card.module.scss';

interface EventCardProps {
  item: Event;
}

const DateWidget: React.FC<{ date: Date | string }> = ({ date }) => {
  const eventDate = new Date(date);
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const day = eventDate.getDate();

  return (
    <div className={styles.dateWidget}>
      <div className={styles.monthYear}>{month}</div>
      <div className={styles.day}>{day}</div>
    </div>
  );
};

const generateGoogleCalendarUrl = (event: Event) => {
  const startDate = new Date(event.eventDate).toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(new Date(event.eventDate).getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d+/g, ''); // Assuming 1 hour duration

  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(''); // Add location if available

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${startDate}/${endDate}&details=${details}&location=${location}&sf=true&output=xml`;
};

export const EventCard: React.FC<EventCardProps> = ({ item }) => (
  <div className={styles.eventCardContainer}>
    <div className={styles.heading}>
      <div>{item.focus}</div>
      <DateWidget date={item.eventDate} />
    </div>
    <div className={styles.body}>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.description}>{item?.description && parse(item.description)}</div>
    </div>
    <div className={styles.footer}>
      <a
        href={generateGoogleCalendarUrl(item)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.addToCalendar}
      >
        Add to Calendar
      </a>
    </div>
  </div>
);
