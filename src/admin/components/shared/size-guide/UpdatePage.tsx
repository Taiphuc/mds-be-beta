import { RouteProps } from "@medusajs/admin";
import { Button } from "@medusajs/ui";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { FC, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import FindCollection from "../../input/find-collection";
import FindProduct from "../../input/find-product";
import FindTag from "../../input/find-tag";
import Modal from "../../molecules/modal";
import LayeredModal, {
  useLayeredModal,
} from "../../molecules/modal/layered-modal";
import BackButton from "../back-button";
import BodyCard from "../body-card";
import FormInput from "./FormInput";
import "./style.css";

const UpdateSizeGuidePage: FC<RouteProps> = ({ notify }) => {
  const id = useParams()?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSize, setDefaultSize] = useState(false);

  const [isClearTag, setIsClearTag] = useState(false);
  const [openPickTag, setOpenPickTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);

  const [isClearCollection, setIsClearCollection] = useState(false);
  const [openPickCollection, setOpenPickCollection] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<any[]>([]);

  const [isClearProduct, setIsClearProduct] = useState(false);
  const [openPickProduct, setOpenPickProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
  const { mutate: createSizeGuide } = useAdminCustomPost<any, any>(
    `/size-guide`,
    []
  );
  const context = useLayeredModal();

  const {
    data: dataSize,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminCustomQuery<any, any>("/size-guide/one", [], { id });
  const [data, setData] = useState(dataSize?.data);

  const saveSizeGuide = (type: "draft" | "publish") => {
    if (!data?.name) {
      notify.error("Name is required", "Please input a name");

      return;
    }
    const products = selectedProducts?.map((p) => p?.id);
    const variants = selectedVariants?.map((p) => p?.id);
    const collections = selectedCollections?.map((p) => p?.id);
    const tags = selectedTags?.map((p) => p?.id);

    createSizeGuide(
      {
        ...data,
        collections,
        tags,
        products,
        variants,
        status: type === "publish",
        default: defaultSize,
      },
      {
        onSuccess: () => {
          notify.success(
            "Updated size guide",
            "Size Guide create successfully"
          );
          navigate("/a/size-guide");
        },
        onError: () => {
          notify.error(
            "Update failed",
            "Something went wrong update size guide"
          );
        },
      }
    );
  };

  const handleOpenPickTags = () => setOpenPickTag(true);
  const handleClosePickTags = () => setOpenPickTag(false);
  const handleRemoveSelectedTag = (collection: any) => {
    // remove collection
    const newSelectedTags = selectedTags?.filter(
      (e) => e?.id !== collection?.id
    );
    setSelectedTags(newSelectedTags);
  };
  const handleClearSelectedTags = () => {
    setSelectedTags([]);
    setIsClearTag(true);
  };

  const handleOpenPickCollections = () => setOpenPickCollection(true);
  const handleClosePickCollections = () => setOpenPickCollection(false);
  const handleRemoveSelectedCollection = (collection: any) => {
    // remove collection
    const newSelectedCollections = selectedCollections?.filter(
      (e) => e?.id !== collection?.id
    );
    setSelectedCollections(newSelectedCollections);
  };
  const handleClearSelectedCollections = () => {
    setSelectedCollections([]);
    setIsClearCollection(true);
  };

  const handleOpenPickProducts = () => setOpenPickProduct(true);
  const handleClosePickProducts = () => setOpenPickProduct(false);
  const handleClearSelectedProduct = () => {
    setSelectedProducts([]);
    setSelectedVariants([]);
    setIsClearProduct(true);
  };
  const handleRemoveSelectedProduct = (product: any) => {
    // remove product
    const newSelectedProduct = selectedProducts?.filter(
      (e) => e?.id !== product?.id
    );
    setSelectedProducts(newSelectedProduct);
    // remove variants
    const newSelectedVariants = selectedVariants?.filter(
      (selectedVariant) => product?.id !== selectedVariant?.product_id
    );
    setSelectedVariants(newSelectedVariants);
  };
  useEffect(() => {
    setData(dataSize?.data);
    setSelectedProducts(dataSize?.data?.products || []);
    setSelectedVariants(dataSize?.data?.variants || []);
    setSelectedCollections(dataSize?.data?.collections || []);
    setSelectedTags(dataSize?.data?.tags || []);
    setDefaultSize(dataSize?.data?.isDefault);
  }, [dataSize]);

  useEffect(() => {
    refetchPages();
  }, [location.key]);

  useLayoutEffect(() => {
    if (isClearProduct) {
      setIsClearProduct(false);
    }
    if (isClearCollection) {
      setIsClearCollection(false);
    }
    if (isClearTag) {
      setIsClearTag(false);
    }
  }, [isClearProduct, isClearCollection, isClearTag]);
  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/size-guide"
        className="mb-xsmall"
      />
      <BodyCard
        className="h-full"
        title="Update size guide"
        actionables={[
          {
            label: "Save to draft",
            onClick: () => {
              saveSizeGuide("draft");
            },
          },
          {
            label: "Save to publish",
            onClick: () => {
              saveSizeGuide("publish");
            },
          },
        ]}
        footerMinHeight={40}
        setBorders
      >
        {!isLoadingPages && data && (
          <>
            <FormInput
              data={data}
              setData={setData}
              setDefaultSize={setDefaultSize}
              handleOpenPickProducts={handleOpenPickProducts}
              handleRemoveSelectedProduct={handleRemoveSelectedProduct}
              selectedProducts={selectedProducts}
              selectedCollections={selectedCollections}
              handleOpenPickCollections={handleOpenPickCollections}
              handleRemoveSelectedCollection={handleRemoveSelectedCollection}
              handleOpenPickTags={handleOpenPickTags}
              selectedTags={selectedTags}
              handleRemoveSelectedTag={handleRemoveSelectedTag}
            />
            <LayeredModal
              open={openPickProduct}
              handleClose={handleClosePickProducts}
              context={context}
            >
              <Modal.Body>
                <Modal.Header handleClose={handleClosePickProducts}>
                  <h1 className="inter-xlarge-semibold">
                    Current Sales Channels
                  </h1>
                </Modal.Header>
                <FindProduct
                  onChangeSelected={(data) => {
                    setSelectedProducts(data?.selectedProducts);
                    setSelectedVariants(data?.selectedVariants);
                  }}
                  defaultData={{ selectedProducts, selectedVariants }}
                  isClear={isClearCollection}
                />
                <Modal.Footer>
                  <div className="flex w-full items-center justify-end space-x-2">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleClearSelectedProduct}
                    >
                      CLear
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleClosePickProducts}
                    >
                      Close
                    </Button>
                  </div>
                </Modal.Footer>
              </Modal.Body>
            </LayeredModal>

            <LayeredModal
              open={openPickCollection}
              handleClose={handleClosePickCollections}
              context={context}
            >
              <Modal.Body>
                <Modal.Header handleClose={handleClosePickCollections}>
                  <h1 className="inter-xlarge-semibold">
                    Pick collections for current size guide
                  </h1>
                </Modal.Header>
                <FindCollection
                  onChangeSelected={(data) => {
                    setSelectedCollections(data?.selectedCollections);
                  }}
                  defaultData={{ selectedCollections }}
                  isClear={isClearCollection}
                />
                <Modal.Footer>
                  <div className="flex w-full items-center justify-end space-x-2">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleClearSelectedCollections}
                    >
                      CLear
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleClosePickCollections}
                    >
                      Close
                    </Button>
                  </div>
                </Modal.Footer>
              </Modal.Body>
            </LayeredModal>

            <LayeredModal
              open={openPickTag}
              handleClose={handleClosePickTags}
              context={context}
            >
              <Modal.Body>
                <Modal.Header handleClose={handleClosePickTags}>
                  <h1 className="inter-xlarge-semibold">
                    Pick collections for current size guide
                  </h1>
                </Modal.Header>
                <FindTag
                  onChangeSelected={(data) => {
                    setSelectedTags(data?.selectedTags);
                  }}
                  defaultData={{ selectedTags }}
                  isClear={isClearTag}
                />
                <Modal.Footer>
                  <div className="flex w-full items-center justify-end space-x-2">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleClearSelectedTags}
                    >
                      CLear
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleClosePickTags}
                    >
                      Close
                    </Button>
                  </div>
                </Modal.Footer>
              </Modal.Body>
            </LayeredModal>
          </>
        )}
      </BodyCard>
    </div>
  );
};
export default UpdateSizeGuidePage;
