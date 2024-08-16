import React from 'react';
import { Helmet } from 'react-helmet';

interface HelmetProps {
  title: string;
}

const ReactHelmet: React.FC<HelmetProps> = ({ title }) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export default ReactHelmet;
