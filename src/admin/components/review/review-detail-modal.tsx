import { Button, FocusModal } from "@medusajs/ui";
import { useAdminCustomPost } from "medusa-react";
import { FC } from "react";
import RatingStar from "./rating-star";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ReviewRes, UpdateActiveReq } from "./review-table";

type ReviewDetailModalProps = {
  open: boolean;
  setOpen: (e: boolean) => void;
  data: ReviewRes;
  reload: () => void;
  setData: (e: ReviewRes) => void;
};

const ReviewDetailModal: FC<ReviewDetailModalProps> = ({ open, setOpen, data, reload, setData }) => {
  const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useAdminCustomPost<UpdateActiveReq[], any>(
    "/product-reviews/update/active",
    []
  );

  const handleUpdateActive = (type: "publish" | "draft") => {
    mutateUpdate([{ id: data?.id, active: type === "publish" }], {
      onSuccess() {
        setData({ ...data, active: type === "publish" });
        reload();
      },
    });
  };
  const navigate = useNavigate();
  return (
    <FocusModal open={open} onOpenChange={setOpen} modal={false}>
      <FocusModal.Content>
        <FocusModal.Header>Review Details</FocusModal.Header>
        <FocusModal.Body className="justify-center items-center w-full flex">
          <div className="w-[600px] flex gap-3 flex-col border p-5 shadow rounded-md">
            <div className="flex gap-4 items-center">
              <p className="font-bold text-[18px]">Overall rating:</p>
              <RatingStar rate={data?.rating} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[18px]">Review title:</p>
              <p>{data?.title}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[18px]">Review content:</p>
              <p>{data?.content}</p>
            </div>
            <div className="flex gap-4 items-center">
              <p className="font-bold text-[18px]">Reviewer:</p>
              <p>{data?.user_name}</p>
            </div>
            <div className="flex gap-4 items-center">
              <p className="font-bold text-[18px]">Review date:</p>
              <p>{dayjs(data?.created_at).format("DD MMM YYYY HH:mm")}</p>
            </div>
            <div className="flex gap-4 items-center">
              <p className="font-bold text-[18px]">Review status:</p>
              {data?.active ? <p className="text-[#9ADE7B]">Publish</p> : <p className="text-[#FEA433]">Draft</p>}
            </div>
            <div className="flex flex-col gap-2 ">
              <p className="font-bold text-[18px]">Product detail:</p>
              <div className="w-full flex gap-4">
                <div className="w-[50px] h-[50px]">
                  <img src={data?.product?.thumbnail} alt="" width="100%" height="100%" className="object-cover" />
                </div>
                <div>{data?.product?.title}</div>
              </div>
            </div>
            <div className="flex gap-4 items-center justify-end">
              <Button
                variant="danger"
                onClick={() => {
                  handleUpdateActive("draft");
                }}
              >
                Draft Review
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  handleUpdateActive("publish");
                }}
              >
                Publish Review
              </Button>
              <Button
                onClick={() => {
                  navigate("/a/products/" + data?.product_id);
                }}
              >
                View Product
              </Button>
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};
export default ReviewDetailModal;
