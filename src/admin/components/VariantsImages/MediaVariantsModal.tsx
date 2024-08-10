import { Product, ProductVariant } from "@medusajs/medusa";
import { Button, FocusModal } from "@medusajs/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import VariantsImagesMediaForm, {
  MediaFormType,
} from "./VariantsImagesMediaForm";
import { nestedForm } from "../utils/nested-form";
import { ProductVariantWithKey } from "../../widgets/bulk-edit-variant/bulk-edit-variant";

type Notify = {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  warn: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
};

export type FormImage = {
  url: string;
  name?: string;
  size?: number;
  nativeFile?: File;
};

type Props = {
  product: Product;
  variants: ProductVariantWithKey[];
  open: boolean;
  onUpload: (v: {
    media: { images: { url: string; selected: boolean }[] };
  }) => void;
  onClose: () => void;
  notify: Notify;
  type: "thumbnail" | "media";
  isUpdateFiltered?: boolean;
};

type MediaFormWrapper = {
  media: MediaFormType;
};

const MediaVariantsModal = ({
  open,
  onClose,
  onUpload,
  product,
  type,
  variants,
}: Props) => {
  const form = useForm<MediaFormWrapper>({
    defaultValues: getDefaultValues(product, variants, type),
  });
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    reset(getDefaultValues(product, variants, type));
  }, [reset, product, variants, type]);

  const onReset = () => {
    reset(getDefaultValues(product, variants, type));
    onClose();
  };
  const onSubmit = handleSubmit(onUpload);

  return (
    <FocusModal open={open} onOpenChange={onReset} modal>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button
            variant="primary"
            type="submit"
            disabled={!isDirty}
            form="variant-images-form"
          >
            Save
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className=" p-4">
          <form onSubmit={onSubmit} id="variant-images-form">
            <div>
              <h2 className="inter-large-semibold mb-2xsmall">Media</h2>
              <p className="inter-base-regular text-grey-50 mb-large">
                Add images to your product media.
              </p>
              <div>
                <VariantsImagesMediaForm
                  form={nestedForm(form, "media")}
                  type={type}
                />
              </div>
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

const getDefaultValues = (
  product: Product,
  variants: ProductVariant[],
  type: "thumbnail" | "media"
): MediaFormWrapper => {
  return {
    media: {
      images:
        product?.images?.map((image) => ({
          url: image.url,
          selected:
            variants.length > 1
              ? false
              : type === "thumbnail"
              ? variants[0]?.thumbnail === image.url
              : variants[0]?.images?.some(
                  (vImage) => vImage.url === image.url
                ) ?? false,
        })) || [],
    },
  };
};

export default MediaVariantsModal;
