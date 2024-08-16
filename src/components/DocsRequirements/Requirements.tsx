import React from 'react';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { Card } from 'antd';
import styles from './Requirements.module.scss';

interface RequirementItem {
  requirement: string;
  required: boolean;
}

interface RequirementsProps {
  requirements: RequirementItem[];
}

const displayItems = (requirements: RequirementItem[]) => (
  <div className="d-flex flex-direction-column">
    {requirements.map((item: RequirementItem, index: number) => (
      <div key={index} className="d-flex justify-content-between align-items-center p-1">
        <div>
          {index + 1}.{' '}
          {item.required ? (
            <>
              {item.requirement}
              <span className={styles.asteric}>*</span>
            </>
          ) : (
            item.requirement
          )}
        </div>
        <span className={styles.icon}>
          <AiOutlineCheckSquare />
        </span>
      </div>
    ))}
  </div>
);

const Requirements: React.FC<RequirementsProps> = ({ requirements }) => (
  <div>
    <Card type="inner" title="Required Documents" className={styles.requirementList}>
      {displayItems(requirements)}
      <div className="text-right">
        <span>*</span>
        (Required)
      </div>
    </Card>
  </div>
);

export default Requirements;
