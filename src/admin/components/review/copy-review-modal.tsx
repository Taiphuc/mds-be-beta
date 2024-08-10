import { Button, FocusModal, Input, Select, Toaster, useToast } from "@medusajs/ui";
import { useAdminCustomPost } from "medusa-react";
import { FC, useState } from "react";
import { ReviewRes } from "./review-table";
import { Product } from "../../../models/product";
import Spinner from "../shared/spinner";

type CopyReviewModalProps = {
  open: boolean;
  setOpen: (e: boolean) => void;
  data: Product;
  reload: () => void;
  setData: (e: ReviewRes) => void;
};

type CopyReviewFromCategoryReq = {
  category_id: string;
  product_id: string;
  limit: string;
};

const CopyReviewModal: FC<CopyReviewModalProps> = ({ open, setOpen, data, reload, setData }) => {
  const { toast } = useToast();
  const { mutate: mutateCopy, isLoading: isCopyLoading } = useAdminCustomPost<CopyReviewFromCategoryReq, any>(
    "/product-reviews/copy",
    []
  );
  const [copyReq, setCopyReq] = useState({ limit: "25", product_id: data?.id } as CopyReviewFromCategoryReq);

  const handleCopy = () => {
    mutateCopy(
      { ...copyReq, limit: +copyReq?.limit < 1 ? "1" : copyReq?.limit },
      {
        onSuccess() {
          reload();
          setOpen(false);
        },
        onError() {
          toast({
            title: "Copy failed",
            description: "Please try again",
            variant: "error",
            duration: 1500,
          });
        },
      }
    );
  };
  return (
    <FocusModal open={open} onOpenChange={setOpen} modal={false}>
      <FocusModal.Content>
        <FocusModal.Header>Review Details</FocusModal.Header>
        <FocusModal.Body className="justify-center items-center w-full flex">
          <Toaster />
          {isCopyLoading ? (
            <div className="w-full flex items-center justify-center h-56">
              <Spinner />
            </div>
          ) : (
            <div className="w-[600px] flex gap-3 flex-col border p-5 shadow rounded-md">
              <div className="flex gap-4 items-center">
                <p className="font-bold text-[18px]">Category: </p>
                <Select
                  onValueChange={(value) => {
                    setCopyReq({ ...copyReq, category_id: value });
                  }}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select a category" />
                  </Select.Trigger>
                  <Select.Content>
                    {data?.categories?.map((item) => (
                      <Select.Item key={item.id} value={item.id}>
                        {item.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div className="flex gap-4 items-center">
                <p className="font-bold text-[18px]">Quantity of copies: </p>
                <Input
                  value={copyReq.limit}
                  type="number"
                  placeholder="How many reviews do you want to copy?"
                  onChange={(e) => {
                    setCopyReq({ ...copyReq, limit: +e.target.value < 1 ? "" : e.target.value });
                  }}
                />
              </div>

              <div className="flex gap-4 items-center justify-end">
                <Button
                  variant="danger"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleCopy();
                  }}
                  disabled={!copyReq?.category_id}
                >
                  Run Copy
                </Button>
              </div>
            </div>
          )}
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};
export default CopyReviewModal;
