import React from 'react';
import { Skeleton } from 'antd';
import styles from './Skeleton.module.scss';

type SkeletonProps = {
  number: number;
  widths?: (number | null)[];
};

const DEFAULT_CARD_SKELETON_WIDTH = 250;

export const CardSkeleton = ({ number, widths = [] }: SkeletonProps) => {
  const skeletons = [];
  for (let i = 0; i < number; i += 1) {
    const width = widths[i] === null ? DEFAULT_CARD_SKELETON_WIDTH : widths[i];
    skeletons.push(
      <div key={i}>
        <Skeleton
          active
          avatar
          className="w-100"
          paragraph={{ rows: 5, width: 300 }}
          title={{ width: width as string | number }}
        />
        <Skeleton.Button active block />
      </div>
    );
  }

  return <div className={styles.skeletonList}>{skeletons}</div>;
};
