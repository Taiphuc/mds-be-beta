import type { ProductDetailsWidgetProps } from "@medusajs/admin";
import { Image as ImageType } from "@medusajs/medusa";
import { useToggleState } from "@medusajs/ui";
import { Image } from "antd";
import { useAdminUpdateProduct } from "medusa-react";
import { FC, useState } from "react";
import BodyCard from "../../shared/body-card";
import EditIcon from "../../shared/icons/edit-icon";
import MediaModal from "../../shared/media/MediaModal";
import { getErrorMessage } from "../../utils/error-messages";

type ProductMediaProps = {} & ProductDetailsWidgetProps;
const ProductMedia: FC<ProductMediaProps> = ({ product, notify }) => {
  const [type, setType] = useState<"thumbnail" | "media">();
  const { state: isOpenMediaModal, toggle } = useToggleState();
  const { mutate: updateProduct, isLoading: isLoadingUpdateProduct } =
    useAdminUpdateProduct(product?.id);

  const onError = (err: any) => {
    notify.error("Error", "Update error, " + getErrorMessage(err));
  };
  const onSuccess = () => {
    toggle();
  };

  const onUpdate = (files: ImageType[]) => {
    if (type === "thumbnail") {
      updateProduct(
        { thumbnail: files[0].url },
        {
          onError,
          onSuccess,
        }
      );
    }
    if (type === "media") {
      updateProduct(
        { images: files.map((file) => file.url) },
        {
          onError,
          onSuccess,
        }
      );
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <BodyCard
        title="Thumbnail"
        actionables={[
          {
            icon: <EditIcon />,
            onClick: () => {
              setType("thumbnail");
              toggle();
            },
            label: "Edit",
          },
        ]}
      >
        <Image src={product?.thumbnail} />
      </BodyCard>
      <BodyCard
        title="Media"
        className="col-span-2"
        actionables={[
          {
            icon: <EditIcon />,
            onClick: () => {
              setType("media");
              toggle();
            },
            label: "Edit",
          },
        ]}
      >
        <div className="w-full grid grid-cols-4 gap-2">
          {product?.images?.map((image) => {
            return <Image src={image?.url} key={image?.id} />;
          })}
        </div>
      </BodyCard>

      {product && (
        <MediaModal
          isLoading={isLoadingUpdateProduct}
          type={type}
          notify={notify}
          onFinish={onUpdate}
          onClose={() => toggle()}
          open={isOpenMediaModal}
          filesSelectedInit={
            type === "media"
              ? product.images
              : [{ url: product.thumbnail } as ImageType]
          }
        />
      )}
    </div>
  );
};
export default ProductMedia;
