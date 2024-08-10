import { RouteProps } from "@medusajs/admin";
import { Image as ImageType } from "@medusajs/medusa";
import { FC, useState } from "react";
import BodyCard from "../body-card";
import MediaContent from "./components/MediaContent";
interface MediaProps extends RouteProps {}

const Media: FC<MediaProps> = ({ notify }) => {
  const [_, setIsChange] = useState(false);
  const [filesSelected, setFilesSelected] = useState<ImageType[]>([]);

  return (
    <BodyCard
      className="h-full overflow-y-auto"
      title="Media manage"
      subtitle="Manage media of store"
      footerMinHeight={40}
      setBorders
    >
      <div className="w-full py-3 px-2">
        <MediaContent
          mediaCol={10}
          type="media"
          filesSelected={filesSelected}
          setFilesSelected={setFilesSelected}
          setIsChange={setIsChange}
          notify={notify}
        />
      </div>
    </BodyCard>
  );
};
export default Media;
