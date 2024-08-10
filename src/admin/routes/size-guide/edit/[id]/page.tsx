import { RouteProps } from '@medusajs/admin';
import { FC } from 'react';
import UpdateSizeGuidePage from '../../../../components/shared/size-guide/UpdatePage';

const SizeGuidePage: FC = ({ notify }: RouteProps) => {
  return <UpdateSizeGuidePage notify={notify} />;
};

export default SizeGuidePage;
