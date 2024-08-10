import { RouteConfig, RouteProps } from '@medusajs/admin';
import { Snooze } from '@medusajs/icons';
import { FC } from 'react';
import SizeGuide from '../../components/shared/size-guide';

const SizeGuidePage: FC = ({ notify }: RouteProps) => {
  return <SizeGuide notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: 'Size Guide',
    icon: Snooze,
  },
};

export default SizeGuidePage;
