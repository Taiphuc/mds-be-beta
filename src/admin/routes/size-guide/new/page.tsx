import { RouteProps } from '@medusajs/admin';
import { FC } from 'react';
import AddSizeGuidePage from '../../../components/shared/size-guide/AddPage';

const SizeGuidePage: FC = ({ notify }: RouteProps) => {
  return <AddSizeGuidePage notify={notify} />;
};

export default SizeGuidePage;
