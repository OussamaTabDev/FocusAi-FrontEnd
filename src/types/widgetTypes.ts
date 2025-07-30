import React from 'react';

export interface Widget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  size: 'small' | 'medium' | 'large';
}