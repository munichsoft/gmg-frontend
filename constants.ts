import type { ComponentType, SVGProps } from 'react';
import { HomeIcon, ShoppingBagIcon, UsersIcon, BriefcaseIcon, MapIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Data is now fetched from the backend. This file is for static constants.

export const CATEGORY_ICONS: { [key: string]: ComponentType<SVGProps<SVGSVGElement>> } = {
  'housing': HomeIcon,
  'second-hand': ShoppingBagIcon,
  'community-events': UsersIcon,
  'jobs': BriefcaseIcon,
  'travel': MapIcon,
  'services': SparklesIcon,
};
