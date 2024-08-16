import React from 'react';
import { Tag, TagProps } from 'antd';

type PresetColors =
  | 'green'
  | 'grey'
  | 'blue'
  | 'red'
  | 'orange'
  | 'purple'
  | 'cyan'
  | 'geekblue'
  | 'magenta'
  | 'volcano'
  | 'gold'
  | 'lime'
  | 'pink'
  | 'yellow';

interface AntTagProps extends TagProps {
  color: PresetColors;
  text: string;
}

export const AntTag = ({ color, text, ...props }: AntTagProps) => (
  <Tag color={color} {...props}>
    {text.toUpperCase()}
  </Tag>
);
