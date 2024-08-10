import { RouteProps } from "@medusajs/admin";
import { FC } from "react";
import DetailOptionPage from "../../../components/shared/option-page/detail";

const OptionPagePage: FC = ({ notify }: RouteProps) => {
  return <DetailOptionPage notify={notify} />;
};

export default OptionPagePage;
