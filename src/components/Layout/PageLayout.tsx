import React, { ReactNode } from 'react';
import cn from 'classnames';
import { ReactHelmet } from '@components/ReactHelmet';
import styles from './PageLayout.module.scss';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  siteTitle?: string;
}

export const PageLayout = ({
  children,
  className = '',
  siteTitle = 'eUniversity Africa'
}: PageLayoutProps) => (
  <div className={cn(styles.pageContainer, { [className]: className })}>
    <ReactHelmet title={siteTitle} />
    {children}
  </div>
);
