import { RouteProps } from '@medusajs/admin';
import { FC } from 'react';
import UpdateThemePage from '../../../../components/shared/theme/UpdateThemePage';

const EditPage: FC = ({ notify }: RouteProps) => {
  return <UpdateThemePage notify={notify} />;
};

export default EditPage;
