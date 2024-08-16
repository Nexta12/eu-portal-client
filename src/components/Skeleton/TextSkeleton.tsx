import React from 'react';
import { Skeleton } from 'antd';

type TextSkeletonProp = {
  width: string;
};
export const TextSkeleton = ({ width }: TextSkeletonProp) => (
  <div className="mb-1">
    <Skeleton.Button active style={{ width }} />
  </div>
);
