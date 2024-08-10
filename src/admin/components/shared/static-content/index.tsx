import { RouteProps } from "@medusajs/admin";
import { FC } from "react";
import BodyCard from "../body-card";

interface StaticContentProps extends RouteProps {}

const StaticContentPage: FC<StaticContentProps> = ({ notify }) => {
  return (
    <BodyCard
      className="h-full"
      title="Static content"
      subtitle="Static Content Management"
      footerMinHeight={40}
      setBorders
    >
      <div>Heheheh</div>
    </BodyCard>
  );
};
export default StaticContentPage;
