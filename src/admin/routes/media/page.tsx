import { RouteConfig, RouteProps } from "@medusajs/admin";
import { PhotoSolid } from "@medusajs/icons";
import { FC } from "react";
import Media from "../../components/shared/media/media-page";

const MediaPage: FC = ({ notify }: RouteProps) => {
  return <Media notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Media",
    icon: PhotoSolid,
  },
};

export default MediaPage;
