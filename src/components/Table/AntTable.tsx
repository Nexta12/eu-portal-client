import React from 'react';
import { Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import styles from './AntTable.module.scss';

interface AntTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  emptyText?: string;
}

const CustomEmptyMessage = ({ text }: { text: string }) => (
  <div className="text-center p-2 text-color-primary">
    <p>{text}</p>
  </div>
);
export const AntTable = <T extends object>({
  columns,
  dataSource,
  pagination = false,
  emptyText,
  ...props
}: AntTableProps<T>) => (
  <Table
    className={styles.table}
    columns={columns}
    dataSource={dataSource}
    pagination={pagination}
    locale={{ emptyText: emptyText && <CustomEmptyMessage text={emptyText} /> }}
    {...props}
  />
);
