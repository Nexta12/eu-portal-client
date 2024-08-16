import React, { ReactNode } from 'react';
import cn from 'classnames';

interface TitleProps {
  children: ReactNode;
  bold?: boolean;
}

export const Title = ({ children, bold = false }: TitleProps) => (
  <h2 className={cn('mt-2', { 'font-weight-bold': bold })}>{children}</h2>
);
