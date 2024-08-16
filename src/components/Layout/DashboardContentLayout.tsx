import React, { ReactNode } from 'react';
import cn from 'classnames';
import { ReactHelmet } from '@components/ReactHelmet';
import { AntTag } from '@components/Tag';
import styles from './DashboardContentLayout.module.scss';

interface DashboardContentLayoutProps {
  children: ReactNode;
  title?: string;
  siteTitle?: string;
  preTitle?: string;
  description?: string;
  className?: string;
}

const fallbackSiteTitle = 'eUniversity Africa';

export const DashboardContentLayout = ({
  children,
  title,
  preTitle,
  description,
  siteTitle = title,
  className = ''
}: DashboardContentLayoutProps) => (
  <div className={cn('mx-2', { [className]: className })}>
    <div className="my-2">
      <ReactHelmet title={siteTitle || fallbackSiteTitle} />
      {preTitle && <AntTag color="red" text={preTitle} className="mb-1" />}
      {title && (
        <>
          <h1 className="font-weight-bolder mb-0">{title}</h1>
          <hr className={styles.underline} />
        </>
      )}
      {description && <div className="mb-2 font-semi-large mt-1">{description}</div>}
    </div>
    {children}
  </div>
);
