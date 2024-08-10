import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@medusajs/icons';

type Props = {
  path?: string;
  label?: string;
  className?: string;
};

const BackButton = ({ path, label = 'Go back', className }: Props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        path ? navigate(path) : navigate(-1);
      }}
      className={clsx('px-small py-xsmall', className)}
    >
      <div className="gap-x-xsmall text-grey-50 inter-grey-40 inter-small-semibold flex items-center">
        <ArrowLeft />
        <span className="ml-1">{label}</span>
      </div>
    </button>
  );
};

export default BackButton;
