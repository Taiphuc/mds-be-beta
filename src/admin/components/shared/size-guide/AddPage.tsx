import { RouteProps } from "@medusajs/admin";
import { Button } from "@medusajs/ui";
import { useAdminCustomPost } from "medusa-react";
import { FC, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const initData = {
  name: "",
  topText: `<h2>Women's Top</h2>
  <p>Use the size chart below to determine your size.&nbsp;</p>`,
  content: `<table>
  <thead>
  <tr>
  <th>Inch</th>
  <th>Chest</th>
  <th>Waist</th>
  <th>Hips</th>
  </tr>
  </thead>
  <tbody>
  <tr">
  <td>XS</td>
  <td>31-32</td>
  <td>24-25</td>
  <td>33-34</td>
  </tr>
  <tr>
  <td>S</td>
  <td>33-34</td>
  <td>26-27</td>
  <td>35-36</td>
  </tr>
  <tr>
  <td>M</td>
  <td>35-36</td>
  <td>28-29</td>
  <td>37-38</td>
  </tr>
  <tr>
  <td>L</td>
  <td>37-39</td>
  <td>30-32</td>
  <td>39-41</td>
  </tr>
  <tr>
  <td>XL</td>
  <td>40-42</td>
  <td>33-35</td>
  <td>42-44</td>
  </tr>
  <tr>
  <td>XXL</td>
  <td>43-45</td>
  <td>36-38</td>
  <td>45-47</td>
  </tr>
  </tbody>
  </table>
  <table>
  <thead>
  <tr>
  <th>Cm</th>
  <th>Chest</th>
  <th>Waist</th>
  <th>Hips</th>
  </tr>
  </thead>
  <tbody>
  <tr">
  <td>XS</td>
  <td>79-81</td>
  <td>61-64</td>
  <td>84-86</td>
  </tr>
  <tr>
  <td>S</td>
  <td>84-86</td>
  <td>66-69</td>
  <td>89-91</td>
  </tr>
  <tr>
  <td>M</td>
  <td>89-91</td>
  <td>71-74</td>
  <td>94-97</td>
  </tr>
  <tr>
  <td>L</td>
  <td>94-99</td>
  <td>76-81</td>
  <td>99-104</td>
  </tr>
  <tr>
  <td>XL</td>
  <td>102-107</td>
  <td>84-89</td>
  <td>107-112</td>
  </tr>
  <tr>
  <td>XXL</td>
  <td>109-114</td>
  <td>91-97</td>
  <td>114-119</td>
  </tr>
  </tbody>
  </table>
  `,
  bottomText: `<h2>How to Measure</h2>
  <p><strong>Bust:</strong> Measure around the fullest part of your bust, making sure the tape measure is parallel to the ground and not too tight or too loose. Make sure to wear a well-fitting bra to get an accurate measurement.</p>
  <p><strong>Waist:</strong> Measure around the narrowest part of your waist, usually just above your belly button. Make sure the tape measure is snug but not too tight or too loose.</p>
  <p><strong>Hips:</strong> Measure around the fullest part of your hips, usually around the widest part of your buttocks. Make sure the tape measure is parallel to the ground and not too tight or too loose.</p>`,
};
const AddSizeGuidePage: FC<RouteProps> = ({ notify }) => {
  const [data, setData] = useState(initData);
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
  const navigate = useNavigate();
  const { mutate: createSizeGuide } = useAdminCustomPost<any, any>(
    `/size-guide`,
    []
  );
  const context = useLayeredModal();
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
            "Created size guide",
            "Size Guide create successfully"
          );
          navigate("/a/size-guide");
        },
        onError: () => {
          notify.error(
            "Create failed",
            "Something went wrong creating size guide"
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
    const newSelectedProducts = selectedProducts?.filter(
      (e) => e?.id !== product?.id
    );
    setSelectedProducts(newSelectedProducts);
    // remove variants
    const newSelectedVariants = selectedVariants?.filter(
      (selectedVariant) => product?.id !== selectedVariant?.product_id
    );
    setSelectedVariants(newSelectedVariants);
  };

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
        title="Create new size guide"
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
                Pick products for current size guide
              </h1>
            </Modal.Header>
            <FindProduct
              onChangeSelected={(data) => {
                setSelectedProducts(data?.selectedProducts);
                setSelectedVariants(data?.selectedVariants);
              }}
              defaultData={{ selectedProducts, selectedVariants }}
              isClear={isClearProduct}
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
      </BodyCard>
    </div>
  );
};
export default AddSizeGuidePage;
